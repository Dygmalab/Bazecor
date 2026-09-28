import type { Neuron } from "@Renderer/types/neurons";
import { rgb2w, rgbwProfiles } from "../../api/color";
import type { RGBWProfileId } from "../../api/color";
import { parsePaletteRaw } from "../../api/parsers/palette";

interface ProfileDevice {
  readonly serialNumber?: string;
  readonly path?: string;
  readonly device?: {
    readonly RGBWMode?: boolean;
    readonly info?: { readonly product?: string };
  };
  readonly isClosed: boolean;
  noCacheCommand: (command: string, ...args: string[]) => Promise<unknown>;
}

interface ApplyRgbwProfileOptions {
  device: ProfileDevice;
  getCurrentDevice: () => ProfileDevice | undefined;
  targetNeuronId: string;
  previousProfileId: string | undefined;
  profileId: RGBWProfileId;
  getNeurons: () => Neuron[];
  setNeurons: (neurons: Neuron[]) => void;
}

export type ApplyRgbwProfileResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "stale-session"
        | "invalid-palette"
        | "write-failed"
        | "readback-failed"
        | "readback-mismatch"
        | "metadata-conflict"
        | "metadata-failed";
      recovery?: "restored" | "failed";
    };

function numericPalette(rawPalette: string): string[] | null {
  if (typeof rawPalette !== "string") return null;
  const values = rawPalette.trim().split(/\s+/).filter(Boolean);
  if (values.length === 0 || values.length % 4 !== 0) return null;
  if (values.some(value => !/^\d+$/.test(value) || Number(value) > 255)) return null;
  return values.map(value => String(Number(value)));
}

function isCommandFailure(result: unknown): boolean {
  return result === undefined || result instanceof Error;
}

function palettesMatch(actual: unknown, expected: string[]): boolean {
  if (isCommandFailure(actual) || typeof actual !== "string") return false;
  const normalized = numericPalette(actual);
  return (
    normalized !== null && normalized.length === expected.length && normalized.every((value, index) => value === expected[index])
  );
}

export async function applyRgbwProfile(options: ApplyRgbwProfileOptions): Promise<ApplyRgbwProfileResult> {
  const { device, getCurrentDevice, targetNeuronId, previousProfileId, profileId, getNeurons, setNeurons } = options;
  const profile = rgbwProfiles[profileId];
  const capturedIdentity = {
    serialNumber: device.serialNumber,
    path: device.path,
    product: device.device?.info?.product,
  };
  const hasStableIdentity = () =>
    !device.isClosed &&
    device.serialNumber === capturedIdentity.serialNumber &&
    device.path === capturedIdentity.path &&
    device.device?.info?.product === capturedIdentity.product;
  const isActiveTarget = () => getCurrentDevice() === device && hasStableIdentity();

  if (!device.device?.RGBWMode || !isActiveTarget()) return { ok: false, reason: "stale-session" };

  let rawResult: unknown;
  try {
    rawResult = await device.noCacheCommand("palette");
  } catch {
    return { ok: false, reason: "readback-failed" };
  }
  if (isCommandFailure(rawResult) || typeof rawResult !== "string") return { ok: false, reason: "readback-failed" };
  const previousValues = numericPalette(rawResult);
  if (!previousValues) return { ok: false, reason: "invalid-palette" };

  let expectedValues: string[];
  try {
    const parsedPalette = parsePaletteRaw(previousValues.join(" "), true);
    if (parsedPalette.length !== previousValues.length / 4) return { ok: false, reason: "invalid-palette" };
    expectedValues = parsedPalette.flatMap(color => {
      const converted = rgb2w(color, profile);
      return [converted.r, converted.g, converted.b, converted.w].map(value => value.toString());
    });
    if (expectedValues.length !== previousValues.length) return { ok: false, reason: "invalid-palette" };
  } catch {
    return { ok: false, reason: "invalid-palette" };
  }
  if (!isActiveTarget()) return { ok: false, reason: "stale-session" };

  const recover = async (): Promise<"restored" | "failed"> => {
    if (!hasStableIdentity()) return "failed";
    try {
      const restoreResult = await device.noCacheCommand("palette", ...previousValues);
      if (isCommandFailure(restoreResult) || !hasStableIdentity()) return "failed";
      const restoredPalette = await device.noCacheCommand("palette");
      return hasStableIdentity() && palettesMatch(restoredPalette, previousValues) ? "restored" : "failed";
    } catch {
      return "failed";
    }
  };

  let writeResult: unknown;
  try {
    writeResult = await device.noCacheCommand("palette", ...expectedValues);
  } catch {
    return { ok: false, reason: "write-failed", recovery: await recover() };
  }
  if (isCommandFailure(writeResult)) return { ok: false, reason: "write-failed", recovery: await recover() };
  if (!isActiveTarget()) return { ok: false, reason: "stale-session", recovery: await recover() };

  let readback: unknown;
  try {
    readback = await device.noCacheCommand("palette");
  } catch {
    return { ok: false, reason: "readback-failed", recovery: await recover() };
  }
  if (isCommandFailure(readback) || typeof readback !== "string") {
    return { ok: false, reason: "readback-failed", recovery: await recover() };
  }
  if (!palettesMatch(readback, expectedValues)) {
    return { ok: false, reason: "readback-mismatch", recovery: await recover() };
  }
  if (!isActiveTarget()) return { ok: false, reason: "stale-session", recovery: await recover() };

  let latestNeurons: Neuron[];
  try {
    latestNeurons = getNeurons();
  } catch {
    return { ok: false, reason: "metadata-failed", recovery: await recover() };
  }
  const targetIndex = latestNeurons.findIndex(neuron => neuron.id === targetNeuronId);
  if (targetIndex < 0 || latestNeurons[targetIndex].rgbwProfileId !== previousProfileId) {
    return { ok: false, reason: "metadata-conflict", recovery: await recover() };
  }

  const nextNeurons = latestNeurons.map((neuron, index) =>
    index === targetIndex ? { ...neuron, rgbwProfileId: profileId } : neuron,
  );
  try {
    setNeurons(nextNeurons);
  } catch {
    try {
      setNeurons(latestNeurons);
    } catch {
      // The caller reports the Store failure while hardware recovery proceeds below.
    }
    return { ok: false, reason: "metadata-failed", recovery: await recover() };
  }

  return { ok: true };
}
