import Store from "../../main/managers/Store";
import type { LensKeyboardRef, LensSettings, LensStoreState, OverlayBounds } from "../shared/types";

export const LENS_DEFAULTS: LensSettings = {
  enabled: false,
  opacity: 0.85,
  showUnderglow: false,
  layout: "us",
  layerNames: [],
  overlayMode: true,
  overlayAutoShow: true,
  resizeMode: false,
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function sanitizeLensSettings(s: Partial<LensSettings>): LensSettings {
  return {
    enabled: typeof s.enabled === "boolean" ? s.enabled : LENS_DEFAULTS.enabled,
    opacity: clamp(typeof s.opacity === "number" ? s.opacity : LENS_DEFAULTS.opacity, 0.1, 1.0),
    showUnderglow: typeof s.showUnderglow === "boolean" ? s.showUnderglow : LENS_DEFAULTS.showUnderglow,
    layout: typeof s.layout === "string" ? s.layout : LENS_DEFAULTS.layout,
    layerNames: Array.isArray(s.layerNames) ? s.layerNames : LENS_DEFAULTS.layerNames,
    overlayMode: typeof s.overlayMode === "boolean" ? s.overlayMode : LENS_DEFAULTS.overlayMode,
    overlayAutoShow: typeof s.overlayAutoShow === "boolean" ? s.overlayAutoShow : LENS_DEFAULTS.overlayAutoShow,
    resizeMode: typeof s.resizeMode === "boolean" ? s.resizeMode : LENS_DEFAULTS.resizeMode,
  };
}

function readState(): LensStoreState {
  const raw = Store.getStore().get("lens");
  // Migrate the legacy single `keyboard` ref into the per-product `keyboards` map
  // the first time we see it, so old installs keep their stored Sonsei board.
  let keyboards = raw?.keyboards;
  if (!keyboards && raw?.keyboard?.product) {
    keyboards = { [raw.keyboard.product]: raw.keyboard };
  }
  return {
    ...sanitizeLensSettings(raw ?? {}),
    keyboard: raw?.keyboard,
    keyboards,
    migratedFromStandalone: raw?.migratedFromStandalone,
    overlayBounds: raw?.overlayBounds,
    overlayShown: raw?.overlayShown,
    onboardingCollapsed: raw?.onboardingCollapsed,
  };
}

function writeState(state: LensStoreState): void {
  Store.getStore().set("lens", state);
}

export function getLensSettings(): LensSettings {
  return sanitizeLensSettings(readState());
}

const settingsListeners: Array<(s: LensSettings) => void> = [];

/**
 * Notified after every setLensSettings() write, whoever made it (Preferences,
 * the tray, the overlay, the shortcut). Used by the tray to keep its menu's
 * checkmarks in sync with settings changed elsewhere.
 */
export function onLensSettingsChanged(cb: (s: LensSettings) => void): void {
  settingsListeners.push(cb);
}

export function setLensSettings(updates: Partial<LensSettings>): LensSettings {
  const state = readState();
  const next: LensStoreState = { ...state, ...sanitizeLensSettings({ ...state, ...updates }) };
  writeState(next);
  const settings = sanitizeLensSettings(next);
  for (const cb of settingsListeners) cb(settings);
  return settings;
}

function isValidRef(kb: LensKeyboardRef | undefined): kb is LensKeyboardRef {
  return !!kb && !!kb.backupFolder && !!kb.neuronID && !!kb.product;
}

/** Backup ref for a specific product ("Sonsei", "Defy", …), or null if unknown. */
export function getLensKeyboard(product: string): LensKeyboardRef | null {
  const kb = readState().keyboards?.[product];
  return isValidRef(kb) ? kb : null;
}

/** All stored per-product backup refs. */
export function getAllLensKeyboards(): Record<string, LensKeyboardRef> {
  const map = readState().keyboards ?? {};
  const out: Record<string, LensKeyboardRef> = {};
  for (const [product, kb] of Object.entries(map)) {
    if (isValidRef(kb)) out[product] = kb;
  }
  return out;
}

/** True if any keyboard has ever been registered with Lens. */
export function hasAnyLensKeyboard(): boolean {
  return Object.keys(getAllLensKeyboards()).length > 0;
}

export function setLensKeyboard(keyboard: LensKeyboardRef): void {
  const state = readState();
  const keyboards = { ...(state.keyboards ?? {}), [keyboard.product]: keyboard };
  writeState({ ...state, keyboards });
}

function isValidBounds(b: OverlayBounds | undefined): b is OverlayBounds {
  return (
    !!b &&
    Number.isFinite(b.x) &&
    Number.isFinite(b.y) &&
    Number.isFinite(b.width) &&
    Number.isFinite(b.height) &&
    b.width >= 100 &&
    b.height >= 60
  );
}

/** Saved overlay window bounds from the last session, or null if none/invalid. */
export function getOverlayBounds(): OverlayBounds | null {
  const b = readState().overlayBounds;
  return isValidBounds(b) ? b : null;
}

export function setOverlayBounds(bounds: OverlayBounds): void {
  writeState({ ...readState(), overlayBounds: bounds });
}

/**
 * Last deliberate visibility of the overlay (see LensStoreState.overlayShown).
 * Only the explicit show/hide paths write it — the momentary ones (Lens key
 * HOLD, "show only on layer change") must not, or a layer switch right before
 * quitting would decide how Lens comes back next launch.
 */
export function getLastOverlayShown(): boolean {
  return readState().overlayShown !== false;
}

export function setLastOverlayShown(shown: boolean): void {
  writeState({ ...readState(), overlayShown: shown });
}

/** Folded state of the Preferences onboarding card (see LensStoreState). */
export function getOnboardingCollapsed(): boolean {
  return readState().onboardingCollapsed === true;
}

export function setOnboardingCollapsed(v: boolean): void {
  writeState({ ...readState(), onboardingCollapsed: v });
}

export function isLegacyLensMigrated(): boolean {
  return readState().migratedFromStandalone === true;
}

export function markLegacyLensMigrated(): void {
  writeState({ ...readState(), migratedFromStandalone: true });
}

export function getRunInBackground(): boolean {
  return Store.getStore().get("settings").runInBackground === true;
}

export function setRunInBackground(v: boolean): void {
  const settings = Store.getStore().get("settings");
  Store.getStore().set("settings", { ...settings, runInBackground: v });
}

/** True until the user (or the first lens enable) has ever set runInBackground. */
export function isRunInBackgroundUnset(): boolean {
  return Store.getStore().get("settings").runInBackground === undefined;
}
