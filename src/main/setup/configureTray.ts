import { app, Menu, nativeImage, Tray } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import log from "electron-log/main";
import Window from "../managers/Window";
import createWindow from "../createWindow";
import { markAppQuitting } from "../managers/AppLifecycle";
import { getLensSettings, getRunInBackground, onLensSettingsChanged, setRunInBackground } from "../../lens/main/lens-settings";
import {
  overlayController,
  setOverlayAutoShow,
  setOverlayAutoShowDuration,
  setOverlayOpacity,
  setResizeMode,
} from "../../lens/main/overlay-controller";

let tray: Tray | null = null;

export function openMainWindow(): void {
  const win = Window.getWindow();
  if (win && !win.isDestroyed()) {
    win.show();
    win.focus();
  } else {
    createWindow();
    // Coming back from background mode the app is still an accessory (createWindow
    // restores the Dock icon, but macOS doesn't bring an accessory app forward on
    // its own), so the new window would otherwise open behind everything else.
    if (process.platform === "darwin") app.focus({ steal: true });
  }
}

// Checkmark state the currently installed menu was built with, so refreshTrayMenu()
// can skip the rebuild when nothing it shows has changed.
let menuAutoShow: boolean | null = null;
let menuOpacity: number | null = null;
let menuAutoShowDuration: number | null = null;

// 1s..5s. Preferences' slider goes further (up to 10s, in half seconds); the tray keeps to the common values
const AUTO_SHOW_DURATION_STEPS_S = [1, 2, 3, 4, 5];

/** Layer change display time submenu. Same as the opacity one: the title shows the exact
 * value and the closest step gets the check. Disabled, like in Preferences, while
 * "Show only on layer change" is off, since it has no effect then. */
function buildAutoShowDurationMenu(durationMs: number, autoShow: boolean): Electron.MenuItemConstructorOptions {
  const seconds = durationMs / 1000;
  const lastStep = AUTO_SHOW_DURATION_STEPS_S[AUTO_SHOW_DURATION_STEPS_S.length - 1];
  const closestStep = Math.min(lastStep, Math.max(AUTO_SHOW_DURATION_STEPS_S[0], Math.round(seconds)));
  return {
    label: `Layer change display time (${seconds}s)`,
    enabled: autoShow,
    submenu: AUTO_SHOW_DURATION_STEPS_S.map(step => ({
      label: `${step}s`,
      type: "radio",
      checked: step === closestStep,
      click: () => setOverlayAutoShowDuration(step * 1000),
    })),
  };
}

// 10%..100%, matching the range of the opacity slider in Preferences
const OPACITY_STEPS = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

/** Opacity submenu. Preferences sets any value with its slider, so the title shows the
 * exact one and the closest step gets the check. */
function buildOpacityMenu(opacity: number): Electron.MenuItemConstructorOptions {
  const percent = Math.round(opacity * 100);
  const closestStep = Math.min(100, Math.max(10, Math.round(percent / 10) * 10));
  return {
    label: `Opacity (${percent}%)`,
    submenu: OPACITY_STEPS.map(step => ({
      label: `${step}%`,
      type: "radio",
      checked: step === closestStep,
      click: () => setOverlayOpacity(step / 100),
    })),
  };
}

/** Rebuilt (not mutated) rather than updated in place: Electron menu items are
 * immutable once the menu has been set on the tray. */
function buildTrayMenu(): Menu {
  const settings = getLensSettings();
  menuAutoShow = settings.overlayAutoShow;
  menuOpacity = settings.opacity;
  menuAutoShowDuration = settings.overlayAutoShowDuration;
  return Menu.buildFromTemplate([
    { label: "Open Bazecor", click: () => openMainWindow() },
    { label: "Toggle Layer Lens", click: () => overlayController.toggleOverlay() },
    { label: "Toggle Resize Mode", click: () => setResizeMode(!getLensSettings().resizeMode) },
    {
      label: "Show only on layer change",
      type: "checkbox",
      checked: menuAutoShow,
      click: () => setOverlayAutoShow(!getLensSettings().overlayAutoShow),
    },
    buildAutoShowDurationMenu(menuAutoShowDuration, menuAutoShow),
    buildOpacityMenu(menuOpacity),
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        markAppQuitting();
        app.quit();
      },
    },
  ]);
}

/** Keeps the menu's checkmarks in sync with the same settings changed from
 * Preferences (or by the tray items themselves). */
function rebuildTrayMenuIfChanged(): void {
  if (!tray) return;
  const { overlayAutoShow, opacity, overlayAutoShowDuration } = getLensSettings();
  if (overlayAutoShow === menuAutoShow && opacity === menuOpacity && overlayAutoShowDuration === menuAutoShowDuration) {
    return;
  }
  tray.setContextMenu(buildTrayMenu());
}

// Dragging the opacity slider in Preferences changes the setting on every step;
// rebuild once it settles instead of on each one.
const TRAY_REFRESH_DEBOUNCE_MS = 200;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function refreshTrayMenu(): void {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    rebuildTrayMenuIfChanged();
  }, TRAY_REFRESH_DEBOUNCE_MS);
}

function createTray(): void {
  if (tray) return;
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "logo.png")
    : path.join(app.getAppPath(), "build", "logo.png");
  let icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    log.warn("[Tray] Icon not found at", iconPath);
  } else {
    icon = icon.resize({ width: 16, height: 16 });
  }
  tray = new Tray(icon);
  tray.setToolTip("Bazecor");
  tray.setContextMenu(buildTrayMenu());
  tray.on("double-click", () => openMainWindow());
}

function destroyTray(): void {
  tray?.destroy();
  tray = null;
}

const LINUX_AUTOSTART_FILE = path.join(os.homedir(), ".config", "autostart", "bazecor.desktop");

function applyLoginItem(enabled: boolean): void {
  // In dev process.execPath is the bare electron binary — don't register that.
  if (!app.isPackaged) return;
  if (process.platform === "linux") {
    try {
      if (enabled) {
        fs.mkdirSync(path.dirname(LINUX_AUTOSTART_FILE), { recursive: true });
        fs.writeFileSync(
          LINUX_AUTOSTART_FILE,
          `[Desktop Entry]\nType=Application\nName=Bazecor\nExec=${process.execPath} --hidden\nX-GNOME-Autostart-enabled=true\n`,
        );
      } else {
        fs.rmSync(LINUX_AUTOSTART_FILE, { force: true });
      }
    } catch (err) {
      log.warn("[Tray] Failed to update Linux autostart entry:", err);
    }
  } else if (process.platform === "win32") {
    // Squirrel installs the app under a versioned app-x.y.z folder that changes on
    // every update; registering through Update.exe --processStart keeps the login
    // item valid across updates.
    const updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe");
    const exeName = path.basename(process.execPath);
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: updateExe,
      args: ["--processStart", `"${exeName}"`, "--process-start-args", `"--hidden"`],
    });
  } else {
    app.setLoginItemSettings({ openAtLogin: enabled, openAsHidden: true });
  }
}

/** Persists the run-in-background setting and applies its side effects (tray + login item). */
export function applyRunInBackground(v: boolean): void {
  setRunInBackground(v);
  if (v) createTray();
  else destroyTray();
  applyLoginItem(v);
}

const configureTray = () => {
  onLensSettingsChanged(refreshTrayMenu);
  app.on("before-quit", event => {
    // main/index.ts's own before-quit handler runs first (registered earlier)
    // and may have already cancelled this on macOS (Cmd+Q redirected to a
    // normal window close instead of a real quit) — don't mark quitting in
    // that case, or every future window close would think a quit is already
    // in progress and skip the "keep running in background" handling.
    if (event.defaultPrevented) return;
    markAppQuitting();
  });
  if (getRunInBackground()) {
    createTray();
    applyLoginItem(true);
  }
};

export default configureTray;
