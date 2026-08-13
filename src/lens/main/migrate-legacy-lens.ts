import { execFile } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import log from "electron-log/main";
import type { LensSettings } from "../shared/types";
import { isSupportedLensProduct } from "../shared/constants";
import {
  isLegacyLensMigrated,
  markLegacyLensMigrated,
  sanitizeLensSettings,
  setLensKeyboard,
  setLensSettings,
} from "./lens-settings";

const LENS_DIR = path.join(os.homedir(), ".lens");
const LEGACY_PID_FILE = path.join(LENS_DIR, "lens.pid");
const LEGACY_SETTINGS_FILE = path.join(LENS_DIR, "settings.json");
const LEGACY_CONFIG_FILE = path.join(LENS_DIR, "lens-config.json");
const LEGACY_AUTOSTART_FLAG = path.join(LENS_DIR, ".autostart-registered");

interface LegacyLensConfig {
  keyboard?: {
    backupFolder?: string;
    neuronID?: string;
    product?: string;
  };
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return null;
  }
}

/** Terminates a still-running standalone Lens (tracked by its ~/.lens/lens.pid file). */
function killStandaloneLens(): void {
  try {
    const pid = parseInt(fs.readFileSync(LEGACY_PID_FILE, "utf-8").trim(), 10);
    if (!Number.isNaN(pid)) {
      log.info("[Lens] Migration: terminating standalone Lens PID", pid);
      process.kill(pid, "SIGTERM");
    }
  } catch {
    // not running / no pid file
  }
  try {
    fs.rmSync(LEGACY_PID_FILE, { force: true });
  } catch {
    /* ignore */
  }
}

/** Best-effort removal of the standalone app's login/autostart registration. */
function removeStandaloneAutostart(): void {
  if (process.platform === "linux") {
    try {
      fs.rmSync(path.join(os.homedir(), ".config", "autostart", "dygma-lens.desktop"), { force: true });
    } catch {
      /* ignore */
    }
    try {
      fs.rmSync(LEGACY_AUTOSTART_FLAG, { force: true });
    } catch {
      /* ignore */
    }
  } else if (process.platform === "win32") {
    // Electron's setLoginItemSettings wrote an HKCU Run value; the exact name depends
    // on how the standalone app registered itself, so try the known candidates.
    // A stale leftover is harmless (Windows silently ignores missing targets).
    const runKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
    for (const name of ["Dygma Lens", "electron.app.Dygma Lens", "dygma-lens"]) {
      execFile("reg", ["delete", runKey, "/v", name, "/f"], () => {
        /* ignore result */
      });
    }
  }
  // macOS: the standalone login item points at the old Lens.app; if the app is
  // deleted it is inert, and another process cannot reliably remove it — leave it.
}

/**
 * One-time import of a standalone Dygma Lens installation (settings, keyboard
 * reference, autostart) into Bazecor's store. The rest of ~/.lens is left on
 * disk as a cheap rollback path.
 */
export function migrateLegacyLens(): void {
  if (isLegacyLensMigrated()) return;

  const hadStandalone = fs.existsSync(LENS_DIR);
  if (!hadStandalone) {
    markLegacyLensMigrated();
    return;
  }

  log.info("[Lens] Migrating standalone Lens installation from", LENS_DIR);
  killStandaloneLens();

  const legacySettings = readJson<Partial<LensSettings>>(LEGACY_SETTINGS_FILE);
  if (legacySettings) {
    const sanitized = sanitizeLensSettings(legacySettings);
    // Carry the visual preferences over, but never auto-enable: Lens stays off
    // until the user flips the toggle in Bazecor's settings (auto-enabling also
    // triggered the macOS permission flow without the user ever opting in).
    setLensSettings({ ...sanitized, enabled: false, overlayMode: true });
  }

  const legacyConfig = readJson<LegacyLensConfig>(LEGACY_CONFIG_FILE);
  const kb = legacyConfig?.keyboard;
  // Import the legacy keyboard reference if it's a board Lens can visualize
  // (the standalone app only tracked Sonsei, but be tolerant of any supported one).
  if (kb?.backupFolder && kb?.neuronID && isSupportedLensProduct(kb.product)) {
    log.info(`[Lens] Migration: importing ${kb.product} keyboard reference (neuronID: ${kb.neuronID})`);
    setLensKeyboard({ backupFolder: kb.backupFolder, neuronID: kb.neuronID, product: kb.product as string });
  } else if (kb?.product) {
    log.info(`[Lens] Migration: skipping keyboard reference for unsupported product "${kb.product}"`);
  }

  removeStandaloneAutostart();
  markLegacyLensMigrated();
  log.info("[Lens] Standalone Lens migration finished");
}
