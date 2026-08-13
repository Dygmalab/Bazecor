import { dialog, globalShortcut, powerMonitor, shell } from "electron";
import log from "electron-log/main";
import GlobalRecording from "../../main/managers/GlobalRecording";
import type { KeyboardModel, LensSettings, LensState } from "../shared/types";
import {
  OVERLAY_EVENT_TAP,
  OVERLAY_EVENT_HOLD,
  OVERLAY_EVENT_RELEASE,
  OVERLAY_EVENT_DOUBLE_TAP,
  MACOS_INPUT_MONITORING_SETTINGS_URL,
} from "../shared/constants";
import { RawHidListener } from "./raw-hid-listener";
import { getInputMonitoringStatus, requestInputMonitoringAccess } from "./macos-permissions";
import {
  getAllLensKeyboards,
  getLastOverlayShown,
  getLensKeyboard,
  getLensSettings,
  hasAnyLensKeyboard,
  setLastOverlayShown,
  setLensSettings,
} from "./lens-settings";
import { readLatestModel } from "./backup-reader";
import {
  applyAspectRatioFor,
  applyResizeModeLive,
  broadcastSettings,
  broadcastState,
  createOverlayWindow,
  destroyOverlayWindow,
  hideOverlay,
  isOverlayVisible,
  overlayAlive,
  pushActiveLayer,
  pushModel,
  pushState,
  showOverlay,
  stopFade,
} from "./overlay-window";

const LAYER_CHANGE_AUTO_HIDE_MS = 3000;
// How long the overlay is held on screen but fully transparent before the
// layer-change auto-show fades it in, so the renderer has repainted the new
// active layer by the time anything is visible. See showOverlay()'s fadeDelayMs.
// Long enough to cover a slow repaint, still under the delay that would make the
// auto-show feel like it lags behind the layer key.
const LAYER_PAINT_SETTLE_MS = 230;
const TOGGLE_SHORTCUT = "CommandOrControl+Alt+L";
// Upper bound on a firmware flash. If the renderer never sends the matching
// "flashing finished" (crash, reload, an abort path we don't cover), Lens comes
// back on its own rather than staying dead until the app restarts.
const FLASHING_WATCHDOG_MS = 15 * 60 * 1000;

class OverlayController {
  private hid = new RawHidListener();

  private hidWired = false;

  private enabled = false;

  // Master on/off the user can flip with the shortcut without disabling the
  // whole feature: while inactive the window stays hidden and HID overlay
  // gestures are ignored (mirrors standalone Lens's overlayActive flag).
  private overlayActive = false;

  private currentModel: KeyboardModel | null = null;

  // Product name of the board currently shown (last-connected wins). Set by the
  // HID listener's active-changed event; drives which stored backup we load.
  private currentProduct: string | null = null;

  private activeLayer = 0;

  private holdKeyActive = false;

  private layerAutoShowActive = false;

  private layerChangeHideTimer: ReturnType<typeof setTimeout> | null = null;

  // The overlay should be on screen (restored/last user intent) but there is no
  // keyboard model to draw yet — showing it now would put the "Waiting for
  // Bazecor" placeholder on the user's screen. Reveal it as soon as a model
  // arrives instead.
  private pendingShow = false;

  private hidPermissionDenied = false;

  // Shown at most once per enable so the 2s HID retry loop can't spam dialogs.
  private permissionDialogShown = false;

  private flashing = false;

  private flashingWatchdog: ReturnType<typeof setTimeout> | null = null;

  isEnabled(): boolean {
    return this.enabled;
  }

  getState(): LensState {
    return {
      model: this.currentModel,
      activeLayer: this.activeLayer,
      configFound: hasAnyLensKeyboard(),
      activeProduct: this.currentProduct,
      hidPermissionDenied: this.hidPermissionDenied,
    };
  }

  setEnabled(v: boolean): void {
    setLensSettings({ enabled: v });
    if (v) {
      // Flipping the toggle on is an explicit "show me Lens", so it overrides
      // whatever visibility the user had left behind before disabling it —
      // otherwise turning Lens on would look like it did nothing at all.
      setLastOverlayShown(true);
      this.enable();
    } else this.disable();
  }

  enable(): void {
    if (this.enabled) return;
    this.enabled = true;
    // Re-enabling is an explicit user action — let the permission dialog show
    // again if the grant is still missing.
    this.permissionDialogShown = false;
    log.info("[Lens] Enabling overlay");
    this.wireHidEvents();
    this.reloadModel(false);
    if (!overlayAlive()) {
      // Come back exactly as the user left Lens: on screen only if it was on
      // screen last time, and never as the bare "Waiting for Bazecor"
      // placeholder when there's no keyboard model to draw yet.
      const wantsShow = getLastOverlayShown();
      const showOnStart = wantsShow && this.currentModel !== null;
      this.pendingShow = wantsShow && !showOnStart;
      createOverlayWindow(() => {
        // Stays true even when the overlay starts hidden: this is the master
        // switch for the Lens key gestures, and a hidden overlay must still be
        // summonable with LENS TAP / HOLD.
        this.overlayActive = true;
        // reloadModel(false) above ran before this window existed, so its own
        // applyAspectRatioFor() call was a no-op (getWin() was still null) —
        // and createOverlayWindow()/applyOverlayMode() restore whatever bounds
        // were persisted from the last session, which may predate this ratio
        // lock entirely. Re-apply it now that the window is actually there.
        applyAspectRatioFor(this.currentModel?.product);
        if (this.currentModel) {
          pushModel(this.currentModel);
          pushActiveLayer(this.activeLayer);
        }
        pushState(this.getState());
        broadcastSettings(getLensSettings());
      }, showOnStart);
    }
    this.registerShortcut();
    this.checkMacosPermission();
    // Enabling Lens in the middle of a firmware update must not re-open the
    // keyboard; setFlashing(false) starts the listener once the flash is done.
    if (!this.flashing) this.hid.startWithRetry();
  }

  disable(): void {
    if (!this.enabled) return;
    this.enabled = false;
    log.info("[Lens] Disabling overlay");
    globalShortcut.unregister(TOGGLE_SHORTCUT);
    this.clearLayerChangeHideTimer();
    this.holdKeyActive = false;
    this.layerAutoShowActive = false;
    this.overlayActive = false;
    this.pendingShow = false;
    this.hid.stop();
    destroyOverlayWindow();
    if (this.hidPermissionDenied) {
      this.hidPermissionDenied = false;
      broadcastState(this.getState());
    }
  }

  /**
   * Called by the Bazecor renderer around a firmware update. While flashing, Lens
   * must let go of the keyboard completely: the flasher talks to the same USB
   * device over serial and the board reboots in and out of its bootloader, so an
   * open HID handle (plus node-hid's periodic enumeration) can stall the flash.
   *
   * Independent of enable/disable — a flash suspends the listener even if the
   * user's Lens toggle is on, and resuming only restarts it if Lens is still
   * enabled by then.
   */
  setFlashing(v: boolean): void {
    if (this.flashing === v) return;
    this.flashing = v;
    this.clearFlashingWatchdog();
    if (v) {
      this.hid.suspend();
      this.flashingWatchdog = setTimeout(() => {
        log.warn("[Lens] Flashing watchdog fired — no 'flashing finished' received, resuming Lens");
        this.setFlashing(false);
      }, FLASHING_WATCHDOG_MS);
    } else if (this.enabled) {
      this.hid.resume();
    }
  }

  private clearFlashingWatchdog(): void {
    if (this.flashingWatchdog) {
      clearTimeout(this.flashingWatchdog);
      this.flashingWatchdog = null;
    }
  }

  /**
   * macOS: asks TCC for the Input Monitoring status directly instead of waiting
   * for a device-open failure (which never fires with the keyboard unplugged and
   * doesn't always register Bazecor in the System Settings list). Fire-and-forget
   * from enable().
   */
  private async checkMacosPermission(): Promise<void> {
    if (process.platform !== "darwin") return;
    const status = await getInputMonitoringStatus();
    log.info(`[Lens] Input Monitoring status: ${status}`);
    if (status === "authorized" || status === "unavailable") return;
    if (!this.hidPermissionDenied) {
      this.hidPermissionDenied = true;
      broadcastState(this.getState());
    }
    if (status === "not determined") {
      // Shows the native macOS prompt and registers Bazecor in the Input
      // Monitoring list, so the user only has to flip the toggle.
      const result = await requestInputMonitoringAccess();
      log.info(`[Lens] Input Monitoring request result: ${result}`);
      if (result === "authorized") {
        this.hidPermissionDenied = false;
        broadcastState(this.getState());
        return;
      }
    }
    this.showInputMonitoringDialog();
  }

  /** Called on app quit. */
  shutdown(): void {
    globalShortcut.unregister(TOGGLE_SHORTCUT);
    this.clearFlashingWatchdog();
    this.clearLayerChangeHideTimer();
    stopFade();
    this.hid.stop();
  }

  /**
   * Re-reads the newest backup for the active keyboard and pushes it to the
   * overlay. Called at startup, when the active board changes (active-changed),
   * and every time Bazecor saves a backup for the active board.
   *
   * "Active" is whichever keyboard the HID listener currently tracks (last
   * connected). Before any board is detected we preload the sole registered
   * keyboard, if exactly one, so re-enabling Lens shows it without a flash.
   */
  reloadModel(push = true): void {
    const product = this.currentProduct ?? this.hid.getActiveProduct();

    if (!product) {
      const all = getAllLensKeyboards();
      const only = Object.keys(all).length === 1 ? Object.values(all)[0] : null;
      if (!only) return;
      const model = readLatestModel(only);
      if (!model) return;
      this.currentProduct = only.product;
      this.currentModel = model;
      this.activeLayer = model.defaultLayer;
      applyAspectRatioFor(model.product);
      if (push) {
        pushModel(model);
        pushActiveLayer(this.activeLayer);
      }
      this.applyPendingShow();
      return;
    }

    this.currentProduct = product;
    const keyboard = getLensKeyboard(product);
    const model = keyboard ? readLatestModel(keyboard) : null;
    if (!model) {
      // Active board has no stored backup yet (or it failed to read): clear the
      // view so the renderer shows the "waiting for Bazecor" screen instead of a
      // stale model from another keyboard.
      this.currentModel = null;
      if (push) pushState(this.getState());
      this.hideForMissingModel();
      return;
    }
    this.currentModel = model;
    this.activeLayer = model.defaultLayer;
    applyAspectRatioFor(model.product);
    if (push) {
      pushModel(model);
      pushActiveLayer(this.activeLayer);
    }
    this.applyPendingShow();
  }

  /** A model is available again: reveal the overlay if it was meant to be on
   * screen but had nothing to draw at the time (see pendingShow). */
  private applyPendingShow(): void {
    if (!this.pendingShow) return;
    if (!this.enabled || !this.overlayActive || !overlayAlive()) return;
    this.pendingShow = false;
    if (!isOverlayVisible()) showOverlay();
  }

  /** The active board has no model to draw. The overlay is a floating window
   * over everything else, so the "Waiting for Bazecor…" placeholder must never
   * be left sitting there — hide it and come back once a model shows up. */
  private hideForMissingModel(): void {
    if (!isOverlayVisible()) return;
    this.clearLayerChangeHideTimer();
    this.layerAutoShowActive = false;
    this.holdKeyActive = false;
    // Only come back on its own if being on screen was the user's standing
    // choice — it may well have been visible just for a momentary HOLD or a
    // layer-change auto-show.
    this.pendingShow = getLastOverlayShown();
    hideOverlay();
  }

  /**
   * Bazecor saved a backup for `product`. A backup save only ever happens for the
   * board currently connected to Bazecor (it runs on connect and on edits), so
   * it's an authoritative "this board is active now" signal — treat it as a
   * last-connected event and switch to it. We deliberately do NOT defer to HID's
   * active product here: node-hid can lag on unplug (on Windows it may not emit
   * an "error" until the next scan), so a stale HID-active board must never block
   * the real device's backup from taking over the overlay.
   */
  reloadForSavedBackup(product: string): void {
    log.info(`[Lens] backup for ${product} -> adopting as active board`);
    this.currentProduct = product;
    this.reloadModel();
  }

  /** Tray "Toggle Layer Lens" and the Ctrl+Alt+L shortcut. Deliberately the same
   * behaviour as the Lens key's own TAP (onOverlayTapAction) — the two are the
   * user's two ways of saying "show/hide it now" and must stay interchangeable. */
  toggleOverlay(): void {
    if (!this.enabled || !overlayAlive()) return;
    this.clearLayerChangeHideTimer();
    this.layerAutoShowActive = false;
    // Toggle off what's actually on screen, not off `overlayActive`: the two
    // can legitimately differ (the overlay starts hidden when the user left it
    // hidden, and the Lens key's TAP hides it without touching overlayActive),
    // and toggling the flag alone would waste the first press on a window
    // that's already hidden.
    //
    // overlayActive itself is never cleared here. It's the master switch for the
    // Lens key gestures (see enable()), so hiding the overlay from the tray used
    // to kill LENS TAP / LENS HOLD until the tray showed it again — a hidden
    // overlay must stay summonable from the keyboard.
    this.overlayActive = true;
    this.setUserVisible(!isOverlayVisible());
  }

  /**
   * Applies an explicit user show/hide (Lens key TAP, Ctrl+Alt+L, tray, Resize
   * Mode): remembers the choice so the next launch restores it, and defers the
   * reveal while there's no keyboard model to draw — the overlay floats over
   * everything, so the "Waiting for Bazecor…" placeholder must never be what
   * the user gets handed.
   */
  private setUserVisible(next: boolean): void {
    setLastOverlayShown(next);
    if (next && this.currentModel === null) {
      this.pendingShow = true;
      return;
    }
    this.pendingShow = false;
    if (next) showOverlay();
    else hideOverlay();
  }

  /** Used by setResizeMode below: makes sure the overlay is actually on screen
   * before enabling drag/resize. Goes through `overlayActive` (rather than
   * calling showOverlay() directly) so it can't desync from the physical
   * overlay key's own on/off state — if the overlay had been toggled off,
   * calling showOverlay() straight from setResizeMode left overlayActive
   * stuck false while the window reappeared, silently breaking the overlay
   * key (its TAP/HOLD handlers all guard on overlayActive). */
  ensureVisible(): void {
    if (!this.enabled || !overlayAlive()) return;
    if (this.overlayActive && isOverlayVisible()) return;
    this.overlayActive = true;
    this.setUserVisible(true);
  }

  private registerShortcut(): void {
    if (globalShortcut.isRegistered(TOGGLE_SHORTCUT)) return;
    globalShortcut.register(TOGGLE_SHORTCUT, () => {
      // Don't fire while a macro is being recorded (uiohook is capturing keys).
      if (GlobalRecording.getInstance().getRecording()) return;
      this.toggleOverlay();
    });
  }

  private wireHidEvents(): void {
    if (this.hidWired) return;
    this.hidWired = true;

    // A laptop suspend/resume (most likely while Lens sits hidden for a long
    // stretch — exactly when nobody notices) typically drops and re-enumerates
    // USB HID devices at the OS level. The scan loop would eventually pick the
    // board back up on its own next 2s tick, but force an immediate rescan on
    // resume anyway so overlay/layer-change events aren't left dead for even
    // one extra cycle right when the user comes back.
    powerMonitor.on("resume", () => {
      log.info("[Lens/HID] System resumed from sleep — forcing a rescan");
      this.hid.startWithRetry();
    });

    this.hid.on("permission-denied", () => {
      if (!this.hidPermissionDenied) {
        this.hidPermissionDenied = true;
        broadcastState(this.getState());
      }
      this.showInputMonitoringDialog();
    });

    this.hid.on("connected", () => {
      if (this.hidPermissionDenied) {
        this.hidPermissionDenied = false;
        broadcastState(this.getState());
      }
    });

    // A different board became the active one (plugged in, or the active one was
    // unplugged and another took over) — swap the displayed model to match.
    this.hid.on("active-changed", product => {
      if (product === this.currentProduct && this.currentModel) return;
      log.info(`[Lens] Active keyboard -> ${product}, loading its model`);
      this.currentProduct = product;
      this.reloadModel();
    });

    this.hid.on("layer-change", ({ layer }) => {
      this.activeLayer = layer;
      pushActiveLayer(layer);
      const defaultLayer = this.currentModel?.defaultLayer ?? 0;
      if (layer === defaultLayer) {
        this.onLayerChangeRelease();
      } else {
        this.onLayerChangeAutoShow();
      }
    });

    this.hid.on("overlay", ({ eventType }) => {
      if (eventType === OVERLAY_EVENT_TAP) {
        this.onOverlayTapAction();
      } else if (eventType === OVERLAY_EVENT_HOLD) {
        this.onOverlayHoldStart();
      } else if (eventType === OVERLAY_EVENT_RELEASE) {
        this.onOverlayHoldEnd();
      } else if (eventType === OVERLAY_EVENT_DOUBLE_TAP) {
        log.verbose("[Lens] DOUBLE_TAP event ignored (double-tap action removed)");
      }
    });

    this.hid.on("overlay-tap", ({ eventType }) => {
      if (eventType === OVERLAY_EVENT_TAP) this.onOverlayTapAction();
    });

    this.hid.on("overlay-hold", ({ eventType }) => {
      if (eventType === OVERLAY_EVENT_HOLD) this.onOverlayHoldStart();
      else if (eventType === OVERLAY_EVENT_RELEASE) this.onOverlayHoldEnd();
    });
  }

  private clearLayerChangeHideTimer(): void {
    if (this.layerChangeHideTimer) {
      clearTimeout(this.layerChangeHideTimer);
      this.layerChangeHideTimer = null;
    }
  }

  // Shared handlers for the overlay TAP / HOLD gesture, regardless of whether it
  // originates from the OVERLAY_KEY superkey (eventType-based) or a dedicated
  // OVERLAY_TAP / OVERLAY_HOLD key (its own packet type).
  private onOverlayTapAction(): void {
    if (!this.overlayActive || !overlayAlive()) return;
    this.clearLayerChangeHideTimer();
    this.layerAutoShowActive = false;
    log.verbose(`[Lens] TAP action → toggling visibility (currently ${isOverlayVisible() ? "visible" : "hidden"})`);
    this.setUserVisible(!isOverlayVisible());
  }

  private onOverlayHoldStart(): void {
    if (!this.overlayActive || !overlayAlive()) return;
    if (isOverlayVisible()) {
      log.verbose("[Lens] HOLD start ignored (Lens already visible)");
      return;
    }
    this.clearLayerChangeHideTimer();
    this.layerAutoShowActive = false;
    this.holdKeyActive = true;
    showOverlay();
  }

  private onOverlayHoldEnd(): void {
    if (!this.holdKeyActive) return;
    this.holdKeyActive = false;
    this.clearLayerChangeHideTimer();
    hideOverlay();
  }

  private onLayerChangeAutoShow(): void {
    if (!this.overlayActive || !overlayAlive()) return;
    if (!getLensSettings().overlayAutoShow) return;
    if (isOverlayVisible()) {
      // Already visible for some other reason (e.g. a manual TAP) — leave it alone.
      // Only Lens' own layer-change auto-show is allowed to auto-hide on release.
      return;
    }
    this.clearLayerChangeHideTimer();
    this.layerAutoShowActive = true;
    // The caller has only just handed the renderer the new layer over IPC. Hold
    // the overlay transparent for a beat before fading it in, so what appears is
    // already the layer being switched to rather than the one being left behind
    // — see showOverlay()'s fadeDelayMs.
    showOverlay(LAYER_PAINT_SETTLE_MS);
    // Fallback in case the layer never reverts to the default layer (e.g. a locked
    // layer switch instead of a momentary hold) — don't leave Lens on screen forever.
    this.layerChangeHideTimer = setTimeout(() => {
      this.layerChangeHideTimer = null;
      this.layerAutoShowActive = false;
      hideOverlay();
    }, LAYER_CHANGE_AUTO_HIDE_MS);
  }

  private async showInputMonitoringDialog(): Promise<void> {
    if (this.permissionDialogShown) return;
    this.permissionDialogShown = true;

    // Quarantined apps launched from the DMG or Downloads run "translocated" from
    // a randomized read-only path that changes on every launch, so TCC can never
    // tie the Input Monitoring grant to the app — granting it has no effect until
    // the user moves Bazecor.app into /Applications.
    if (process.execPath.includes("/AppTranslocation/")) {
      log.warn(`[Lens] App is translocated (${process.execPath}) — TCC grants will not stick`);
      await dialog.showMessageBox({
        type: "warning",
        title: "Layer Lens",
        message: "Move Bazecor to the Applications folder",
        detail:
          "Bazecor is running from a temporary location (macOS App Translocation), " +
          "so macOS cannot remember the Input Monitoring permission Layer Lens needs.\n\n" +
          "Quit Bazecor, drag Bazecor.app into the Applications folder, open it from " +
          "there, and enable Layer Lens again.",
        buttons: ["OK"],
      });
      return;
    }

    const { response } = await dialog.showMessageBox({
      type: "warning",
      title: "Layer Lens",
      message: "Layer Lens needs the Input Monitoring permission",
      detail:
        "macOS requires your approval before Bazecor can receive layer changes and " +
        "overlay key events from your Dygma keyboard.\n\n" +
        "In System Settings, go to Privacy & Security → Input Monitoring and enable " +
        "Bazecor.\n\n" +
        "Then restart Bazecor completely: closing the window is not enough while it " +
        "keeps running in the menu bar — use the tray icon to quit, or the Restart " +
        "button in Bazecor's Layer Lens settings.",
      buttons: ["Open System Settings", "Not Now"],
      defaultId: 0,
      cancelId: 1,
    });
    if (response === 0) {
      shell
        .openExternal(MACOS_INPUT_MONITORING_SETTINGS_URL)
        .catch(err => log.warn("[Lens] Could not open System Settings:", err));
    }
  }

  // A layer-change back to the model's default (resting) layer is the release of
  // whatever momentary layer-shift key caused the earlier change — hide right away
  // instead of waiting out the fallback timeout, but only if we're the ones who
  // showed it (don't clobber a window the user opened some other way).
  private onLayerChangeRelease(): void {
    this.clearLayerChangeHideTimer();
    if (!this.layerAutoShowActive) return;
    this.layerAutoShowActive = false;
    hideOverlay();
  }
}

export const overlayController = new OverlayController();

/** Shared by the tray menu, Preferences, and the lens:set-resize-mode IPC
 * handler so the "apply + broadcast" side effects only live in one place.
 *
 * Turning it on also reveals the overlay if it's currently hidden (which is
 * the default most of the time — it only shows on a layer change or the
 * overlay key) — enabling resize/drag on a window nobody can see looks like
 * the toggle silently does nothing. Goes through overlayController.ensureVisible()
 * rather than calling showOverlay() directly — see its comment. */
export function setResizeMode(v: boolean): LensSettings {
  const s = setLensSettings({ resizeMode: v });
  applyResizeModeLive(s.resizeMode);
  if (v) overlayController.ensureVisible();
  broadcastSettings(s);
  return s;
}

/** Shared by the tray menu and the lens:set-overlay-auto-show IPC handler, so
 * both paths persist and broadcast the change the same way. */
export function setOverlayAutoShow(v: boolean): LensSettings {
  const s = setLensSettings({ overlayAutoShow: v });
  broadcastSettings(s);
  return s;
}
