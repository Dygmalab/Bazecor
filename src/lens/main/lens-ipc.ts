import { app, ipcMain, shell } from "electron";
import log from "electron-log/main";
import type { LensKeyboardRef, LensSettings, LensState } from "../shared/types";
import { MACOS_INPUT_MONITORING_SETTINGS_URL, isSupportedLensProduct } from "../shared/constants";
import {
  getLensSettings,
  getOnboardingCollapsed,
  getRunInBackground,
  isRunInBackgroundUnset,
  setLensKeyboard,
  setLensSettings,
  setOnboardingCollapsed,
} from "./lens-settings";
import { overlayController, setOverlayAutoShow, setResizeMode } from "./overlay-controller";
import {
  applyOpacityLive,
  applyOverlayMode,
  broadcastSettings,
  overlayMove,
  overlayMoveBy,
  overlayResize,
} from "./overlay-window";

let registered = false;

/**
 * Registers every lens IPC handler exactly once, at app level (NOT from
 * createWindow(), which re-runs on macOS activate and would double-register).
 */
export function registerLensIpc(onRunInBackgroundChange: (v: boolean) => void): void {
  if (registered) return;
  registered = true;

  ipcMain.handle("lens:get-state", (): LensState => overlayController.getState());

  ipcMain.handle("lens:get-settings", (): LensSettings => getLensSettings());

  ipcMain.handle("lens:set-enabled", (_, v: boolean): LensSettings => {
    overlayController.setEnabled(v);
    // First time the user turns Lens on, default to keeping Bazecor in the tray
    // so the overlay stays available like the old standalone app did.
    if (v && isRunInBackgroundUnset()) onRunInBackgroundChange(true);
    const s = getLensSettings();
    broadcastSettings(s);
    return s;
  });

  ipcMain.handle("lens:set-opacity", (_, v: number): LensSettings => {
    const s = setLensSettings({ opacity: v });
    applyOpacityLive(s.opacity);
    broadcastSettings(s);
    return s;
  });

  ipcMain.handle("lens:set-resize-mode", (_, v: boolean): LensSettings => setResizeMode(v));

  ipcMain.handle("lens:set-show-underglow", (_, v: boolean): LensSettings => {
    const s = setLensSettings({ showUnderglow: v });
    broadcastSettings(s);
    return s;
  });

  ipcMain.handle("lens:set-layout", (_, v: string): LensSettings => {
    const s = setLensSettings({ layout: v });
    broadcastSettings(s);
    return s;
  });

  ipcMain.handle("lens:set-layer-name", (_, layer: number, name: string): LensSettings => {
    const names = [...getLensSettings().layerNames];
    names[layer] = name;
    const s = setLensSettings({ layerNames: names });
    broadcastSettings(s);
    return s;
  });

  ipcMain.handle("lens:set-overlay", (_, v: boolean): LensSettings => {
    const s = setLensSettings({ overlayMode: v });
    applyOverlayMode(v);
    broadcastSettings(s);
    return s;
  });

  ipcMain.handle("lens:set-overlay-auto-show", (_, v: boolean): LensSettings => setOverlayAutoShow(v));

  ipcMain.handle("lens:get-onboarding-collapsed", (): boolean => getOnboardingCollapsed());

  ipcMain.handle("lens:set-onboarding-collapsed", (_, v: boolean): boolean => {
    setOnboardingCollapsed(v);
    return getOnboardingCollapsed();
  });

  // macOS: opens System Settings → Privacy & Security → Input Monitoring (used by
  // the permission banner in Bazecor's Layer Lens settings).
  ipcMain.on("lens:open-input-monitoring", () => {
    shell.openExternal(MACOS_INPUT_MONITORING_SETTINGS_URL).catch(err => log.warn("[Lens] Could not open System Settings:", err));
  });

  // Full process relaunch — needed on macOS for a fresh Input Monitoring grant to
  // take effect. With "run in background" on, closing the window doesn't restart
  // the process, so the settings UI offers an explicit restart instead.
  ipcMain.on("lens:relaunch", () => {
    log.info("[Lens] Relaunching Bazecor (requested from Lens settings)");
    app.relaunch();
    app.exit(0);
  });

  ipcMain.handle("lens:get-run-in-background", (): boolean => getRunInBackground());

  ipcMain.handle("lens:set-run-in-background", (_, v: boolean): boolean => {
    onRunInBackgroundChange(v);
    return getRunInBackground();
  });

  // Fired by the Bazecor renderer (Backup.ts) right after a backup is written to
  // disk — replaces the old ~/.lens/lens-config.json file bridge.
  ipcMain.on("lens:backup-saved", (_, keyboard: LensKeyboardRef) => {
    // Defensive guard: only accept boards Lens knows how to visualize. Even though
    // the renderer (Backup.ts) already filters this, we double-check here so a
    // stray/unsupported backup can never repoint Lens at the wrong device.
    if (!isSupportedLensProduct(keyboard?.product)) {
      log.info(`[Lens] lens:backup-saved ignored for unsupported product "${keyboard?.product}"`);
      return;
    }
    log.info(`[Lens] lens:backup-saved accepted for ${keyboard.product} (neuronID: ${keyboard.neuronID}) -> stored`);
    setLensKeyboard(keyboard);
    overlayController.reloadForSavedBackup(keyboard.product);
  });

  // Fired by the Bazecor renderer (App.tsx toggleFlashing) at both ends of a
  // firmware update. Lens releases the keyboard for the whole flash — see
  // OverlayController.setFlashing().
  ipcMain.on("lens:set-flashing", (_, v: boolean) => {
    log.info(`[Lens] lens:set-flashing ${v}`);
    overlayController.setFlashing(!!v);
  });

  // Overlay drag / resize in Resize Mode.
  ipcMain.on("lens:win-move", (_, x: number, y: number) => overlayMove(x, y));
  ipcMain.on("lens:win-move-by", (_, dx: number, dy: number) => overlayMoveBy(dx, dy));
  ipcMain.on("lens:win-resize", (_, dir: string, dx: number, dy: number) => overlayResize(dir, dx, dy));
}
