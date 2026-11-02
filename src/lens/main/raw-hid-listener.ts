import { EventEmitter } from "events";
import log from "electron-log/main";
import { usb, type Device as UsbDevice } from "usb";
import {
  OVERLAY_MAGIC_BYTE,
  OVERLAY_PACKET_SIZE,
  PACKET_TYPE_OVERLAY,
  PACKET_TYPE_LAYER,
  PACKET_TYPE_OVERLAY_TAP,
  PACKET_TYPE_OVERLAY_HOLD,
  LENS_PRODUCTS,
  productForUsbIds,
  type LensProduct,
} from "../shared/constants";

// Minimal local shapes for node-hid so this file does not depend on the package's
// (sometimes missing) type declarations. Only the members we actually use.
interface HidDeviceInfo {
  vendorId?: number;
  productId?: number;
  usagePage?: number;
  usage?: number;
  interface?: number;
  product?: string;
  path?: string;
}

interface NodeHidDevice {
  on(event: "data", cb: (buf: Buffer) => void): void;
  on(event: "error", cb: (err: unknown) => void): void;
  close(): void;
  // Set by node-hid once the native handle is really closed (see release())
  _closed?: boolean;
}

// How long release() waits for node-hid to close the device. An interrupted read
// returns within 50 ms (node-hid's hid_read_timeout slice), so this is plenty.
const RELEASE_TIMEOUT_MS = 500;

interface NodeHidModule {
  devices(vendorId?: number, productId?: number): HidDeviceInfo[];
  devicesAsync?(vendorId: number, productId: number): Promise<HidDeviceInfo[]>;
  HID: new (path: string, options?: { nonExclusive: boolean }) => NodeHidDevice;
}

export interface OverlayEvent {
  type: "overlay";
  eventType: number;
}

export interface OverlayTapEvent {
  type: "overlay-tap";
  eventType: number;
}

export interface OverlayHoldEvent {
  type: "overlay-hold";
  eventType: number;
}

export interface LayerEvent {
  type: "layer";
  layer: number;
}

type RawHidEvents = {
  overlay: [event: OverlayEvent];
  "overlay-tap": [event: OverlayTapEvent];
  "overlay-hold": [event: OverlayHoldEvent];
  "layer-change": [event: LayerEvent];
  connected: [];
  disconnected: [];
  /** The keyboard driving the overlay changed (a new board was plugged in, or the
   * active one was unplugged and another took over). Carries the Bazecor product
   * name so the controller can load that keyboard's model. */
  "active-changed": [product: LensProduct];
  /** macOS: the device is plugged in but TCC blocked the open (Input Monitoring
   * not granted). Fired on every failed retry; consumers must dedupe. */
  "permission-denied": [];
};

// HID enumeration is not free, and running an unfiltered one every 2s made
// users' mice (USB and Bluetooth alike) stutter while Lens was on:
//   * Windows: hidapi opens every HID collection on the system and asks each
//     one for its manufacturer/product/serial strings — real requests to the
//     device, over the air for Bluetooth ones.
//   * macOS: an unfiltered IOHIDManager match makes IOKit build a device
//     reference for every HID service, mice and keyboards included.
//   * Linux (hidraw): only sysfs/udev reads, no device traffic.
// So enumeration is filtered to Dygma's vendor ID — on Windows every other
// device then only gets a cached attributes lookup, on macOS the vendor ID goes
// into the IOKit matching dictionary so nothing else is touched at all — and it
// runs off the main thread.
//
// It is also event-driven, and never runs while a board is open: on Windows even
// the filtered enumeration still asks the Dygma board itself for its strings,
// which must not happen periodically while the user is typing on it. A scan
// runs on USB hotplug, on the open board's "error" (unplug), on system resume
// and when Bazecor saves a backup for a board other than the one open. Polling
// only remains while no board is open, as the way to notice one that connects
// over Bluetooth, which raises no USB event.
const IDLE_SCAN_INTERVAL_MS = 3000;
// No board open, but Dygma collections enumerate (firmware without Lens, or an
// open that failed, e.g. macOS Input Monitoring). Each scan touches that board,
// so retry only occasionally; a firmware update re-enumerates it anyway.
const UNUSABLE_SCAN_INTERVAL_MS = 30000;
// The HID collections appear a moment after the USB attach (longer on the first
// plug, while Windows installs the driver), so rescan a few times.
const HOTPLUG_RESCAN_DELAYS_MS = [300, 1500, 4000];
const LENS_VENDOR_IDS = [...new Set(LENS_PRODUCTS.map(p => p.vendorId))];

const DEBOUNCE_MS: Record<number, number> = {
  0x00: 80, // RELEASE
  0x01: 150, // TAP
  0x02: 150, // HOLD
  0x03: 400, // DOUBLE_TAP
};
const DEFAULT_DEBOUNCE_MS = 150;

interface SeenDevice {
  product: LensProduct;
  firstSeen: number;
}

/**
 * Watches every supported Dygma keyboard over raw HID and keeps a single "active"
 * board — the most recently connected one (last-connected-wins). When boards are
 * plugged/unplugged it re-picks the active one and emits `active-changed`, opening
 * a HID handle only on the active device to receive its overlay/layer packets.
 */
export class RawHidListener extends EventEmitter<RawHidEvents> {
  private hidModule: NodeHidModule | null = null;

  private device: NodeHidDevice | null = null;

  private running = false;

  private scanTimer: ReturnType<typeof setTimeout> | null = null;

  private hotplugTimers: ReturnType<typeof setTimeout>[] = [];

  private hotplugAttached = false;

  // Between startWithRetry() and stop(). Checked after the enumeration await in
  // scan() so a scan still running when Lens is turned off can't reopen the board.
  private watching = false;

  private scanInFlight: Promise<void> | null = null;

  private rescanQueued = false;

  // The last enumeration found Dygma collections (usable or not). Sets the idle
  // poll cadence, see UNUSABLE_SCAN_INTERVAL_MS.
  private dygmaPresent = false;

  private lastEventTime: Record<string, number> = {};

  private enumLogged = false;

  // One-shot so the 2s scan loop can't spam the log with either diagnostic.
  private relaxedMatchLogged = false;

  private dygmaEnumLogged = false;

  // path -> {product, firstSeen}. Rebuilt from HID enumeration each scan.
  private seen = new Map<string, SeenDevice>();

  private activePath: string | null = null;

  private activeProduct: LensProduct | null = null;

  // Set while Bazecor is flashing firmware. The board reboots into (and out of)
  // its bootloader during that window, so both our open HID handle and the
  // periodic HID enumeration have to get out of the way — see suspend().
  private suspended = false;

  // Debounces per (source, eventType) pair so bouncy/duplicate packets from a
  // single physical press can't fire the same handler twice in quick succession.
  private shouldEmit(source: string, eventType: number): boolean {
    const key = `${source}:${eventType}`;
    const now = Date.now();
    const debounce = DEBOUNCE_MS[eventType] ?? DEFAULT_DEBOUNCE_MS;
    const last = this.lastEventTime[key] ?? 0;
    if (now - last < debounce) {
      log.verbose(`[Lens/HID] ${source} eventType=0x${eventType.toString(16)} debounced (${now - last}ms < ${debounce}ms)`);
      return false;
    }
    this.lastEventTime[key] = now;
    return true;
  }

  isConnected(): boolean {
    return this.running;
  }

  /** Product name of the board currently driving the overlay, or null. */
  getActiveProduct(): LensProduct | null {
    return this.activeProduct;
  }

  /** Loads node-hid once (CJS module normalized across webpack/ESM interop). */
  private async loadHid(): Promise<NodeHidModule | null> {
    if (this.hidModule) return this.hidModule;
    try {
      const mod = (await import("node-hid")) as unknown as NodeHidModule & { default?: NodeHidModule };
      const HID: NodeHidModule = mod.default ?? mod;
      if (typeof HID.devices !== "function") {
        log.warn(
          `[Lens/HID] node-hid did not expose devices(); module keys: ${Object.keys(mod).join(", ")}, resolved keys: ${Object.keys(HID).join(", ")}`,
        );
        return null;
      }
      this.hidModule = HID;
      return HID;
    } catch (err) {
      log.warn("[Lens/HID] Failed to load node-hid:", err);
      return null;
    }
  }

  /** Begin watching; keeps scanning (on USB hotplug and on an interval) until stop(). */
  startWithRetry(): void {
    this.watching = true;
    this.attachHotplug();
    this.scanNow();
  }

  private onUsbHotplug = (device: UsbDevice): void => {
    if (!LENS_VENDOR_IDS.includes(device.deviceDescriptor?.idVendor)) return;
    this.clearHotplugTimers();
    this.hotplugTimers = HOTPLUG_RESCAN_DELAYS_MS.map(ms => setTimeout(() => this.scanNow(), ms));
  };

  private attachHotplug(): void {
    if (this.hotplugAttached) return;
    try {
      usb.on("attach", this.onUsbHotplug);
      usb.on("detach", this.onUsbHotplug);
      this.hotplugAttached = true;
    } catch (err) {
      // Polling still finds the board, just not as quickly.
      log.warn("[Lens/HID] USB hotplug events unavailable, relying on polling:", err);
    }
  }

  private detachHotplug(): void {
    this.clearHotplugTimers();
    if (!this.hotplugAttached) return;
    this.hotplugAttached = false;
    usb.off("attach", this.onUsbHotplug);
    usb.off("detach", this.onUsbHotplug);
  }

  private clearHotplugTimers(): void {
    this.hotplugTimers.forEach(t => clearTimeout(t));
    this.hotplugTimers = [];
  }

  /**
   * Releases the keyboard for the duration of a firmware flash.
   *
   * Flashing power-cycles the Neuron and its keyscanner sides, and the flasher
   * drives the board over its serial/CDC interface on the same composite USB
   * device we hold a HID handle on. Keeping that handle open — and re-enumerating
   * HID devices while the board is dropping off and re-appearing on the bus — is
   * enough to stall the flash
   * (it hangs waiting on a keyscanner response that never arrives). So we close
   * the handle and park the scan loop entirely until resume().
   */
  suspend(): void {
    if (this.suspended) return;
    this.suspended = true;
    log.info("[Lens/HID] Suspending — releasing the keyboard while firmware flashing runs");
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    this.clearHotplugTimers();
    this.closeDevice();
    // Forget everything: after a flash the board re-enumerates on a new HID path,
    // so a stale `seen` entry would keep us from treating it as newly connected.
    this.seen.clear();
    this.activePath = null;
    this.activeProduct = null;
    this.running = false;
    this.emit("disconnected");
  }

  /** Re-attaches to the keyboard once flashing is over. Safe to call unpaired. */
  resume(): void {
    if (!this.suspended) return;
    this.suspended = false;
    log.info("[Lens/HID] Resuming after firmware flashing");
    this.startWithRetry();
  }

  /** Re-checks the connected boards now, e.g. when Bazecor talks to a board other
   * than the one open. No-op while stopped or suspended. */
  rescan(): void {
    if (!this.watching || this.suspended) return;
    this.scanNow();
  }

  /**
   * Runs one scan, never two at once (enumeration is async): a request arriving
   * mid-scan queues a single follow-up. Every scan, whatever triggered it,
   * re-arms the poll timer at the cadence its outcome calls for.
   *
   * scan() can throw past its own try/catches — e.g. a listener registered on
   * "connected"/"active-changed" (overlay-controller.ts) throwing synchronously
   * during setActive(). That once killed the polling loop silently and for good
   * (no more layer-change/overlay events until the app restarted), so the timer
   * is re-armed regardless of outcome.
   */
  private scanNow(): void {
    if (this.scanInFlight) {
      this.rescanQueued = true;
      return;
    }
    this.scanInFlight = this.scan()
      .catch(err => log.warn("[Lens/HID] scan() failed, will retry:", err))
      .finally(() => {
        this.scanInFlight = null;
        if (this.rescanQueued) {
          this.rescanQueued = false;
          this.scanNow();
          return;
        }
        this.scheduleScan();
      });
  }

  private scheduleScan(): void {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    // A board is open: no polling at all, see the note on IDLE_SCAN_INTERVAL_MS.
    if (this.suspended || !this.watching || this.device) return;
    const delay = this.dygmaPresent ? UNUSABLE_SCAN_INTERVAL_MS : IDLE_SCAN_INTERVAL_MS;
    this.scanTimer = setTimeout(() => {
      this.scanTimer = null;
      this.scanNow();
    }, delay);
  }

  /** Every HID collection carrying a supported vendor ID. */
  private static async enumerate(HID: NodeHidModule): Promise<HidDeviceInfo[]> {
    const lists = await Promise.all(
      LENS_VENDOR_IDS.map(vid => (HID.devicesAsync ? HID.devicesAsync(vid, 0) : Promise.resolve(HID.devices(vid, 0)))),
    );
    return lists.flat();
  }

  /**
   * Picks the raw HID / vendor collection of every supported board out of a full
   * HID enumeration.
   *
   * The overlay firmware reports on Dygma's vendor usage page (0xff00), and every
   * board we have checked declares it with usage 0x01, so that exact pair is what
   * we look for first. When it finds nothing we retry on the usage page alone:
   * the Defy's *wired* Neuron was reported as invisible to Lens, and a vendor
   * collection declaring a different usage id is the one cause we can cover from
   * this side — the strict filter would silently skip it while the board is
   * plugged in and working. Anything outside 0xff00 stays excluded: those are the
   * board's real keyboard/consumer collections, which we must never open.
   */
  private matchSupportedDevices(devices: HidDeviceInfo[]): HidDeviceInfo[] {
    const onVendorPage = devices.filter(
      d => d.path && d.usagePage === 0xff00 && productForUsbIds(d.vendorId ?? 0, d.productId ?? 0) !== null,
    );
    const strict = onVendorPage.filter(d => d.usage === 0x01);
    if (strict.length > 0 || onVendorPage.length === 0) return strict;

    if (!this.relaxedMatchLogged) {
      this.relaxedMatchLogged = true;
      log.info(
        `[Lens/HID] No 0xff00/0x01 collection found, falling back to usagePage 0xff00 with any usage: ` +
          `${JSON.stringify(onVendorPage.map(d => ({ product: d.product, usage: `0x${(d.usage ?? 0).toString(16)}` })))}`,
      );
    }
    return onVendorPage;
  }

  /**
   * Enumerates supported keyboards, updates the connected set, and re-picks the
   * active device (last connected wins; on removal of the active one, falls back
   * to the most-recently-seen board still present).
   */
  private async scan(): Promise<void> {
    // Never touch the HID bus mid-flash, including via the re-scan onDeviceError()
    // fires when the board drops off as it reboots into the bootloader.
    if (this.suspended) return;
    const HID = await this.loadHid();
    if (!HID) return;

    let devices: HidDeviceInfo[];
    try {
      devices = await RawHidListener.enumerate(HID);
    } catch (err) {
      log.warn("[Lens/HID] devices() enumeration failed:", err);
      return;
    }
    // Lens may have been turned off, or a flash started, while we waited.
    if (this.suspended || !this.watching) return;
    this.dygmaPresent = devices.length > 0;

    this.logDygmaEnumOnce(devices);
    const matches = this.matchSupportedDevices(devices);

    const now = Date.now();
    const present = new Set<string>();
    let newestNewPath: string | null = null;

    for (const d of matches) {
      const path = d.path as string;
      present.add(path);
      if (!this.seen.has(path)) {
        const product = productForUsbIds(d.vendorId ?? 0, d.productId ?? 0) as LensProduct;
        this.seen.set(path, { product, firstSeen: now });
        newestNewPath = path; // a freshly-connected board wins the active slot
        log.info(`[Lens/HID] Detected ${product} (path ${path})`);
      }
    }

    // Drop boards that are no longer enumerated.
    let activeRemoved = false;
    for (const path of [...this.seen.keys()]) {
      if (!present.has(path)) {
        const gone = this.seen.get(path);
        this.seen.delete(path);
        log.info(`[Lens/HID] ${gone?.product ?? "device"} disconnected (path ${path})`);
        if (path === this.activePath) activeRemoved = true;
      }
    }

    if (this.seen.size === 0) {
      this.logNoDeviceOnce(devices);
    } else {
      this.enumLogged = false;
    }

    if (newestNewPath) {
      this.setActive(newestNewPath, HID);
    } else if (activeRemoved) {
      this.setActive(this.mostRecentPath(), HID);
    } else if (!this.device && this.seen.size > 0) {
      // No open device but a supported board is still connected. Covers two cases:
      //   * the active board was unplugged via a device "error" (onDeviceError
      //     nulls activePath before this scan), leaving another board connected
      //     that isn't "new" — activate it so unplugging one of two boards falls
      //     back to the other;
      //   * an earlier open failed (e.g. macOS TCC) — retry it.
      this.setActive(this.mostRecentPath(), HID, true);
    }
  }

  /** Path of the most-recently-connected board still present, or null. */
  private mostRecentPath(): string | null {
    let best: string | null = null;
    let bestTime = -1;
    for (const [path, info] of this.seen) {
      if (info.firstSeen > bestTime) {
        bestTime = info.firstSeen;
        best = path;
      }
    }
    return best;
  }

  /** Makes `path` the active board and opens a HID handle on it. */
  private setActive(path: string | null, HID: NodeHidModule, force = false): void {
    if (path === this.activePath && !force) return;

    this.closeDevice();
    this.activePath = path;
    this.activeProduct = path ? (this.seen.get(path)?.product ?? null) : null;

    if (!path || !this.activeProduct) {
      this.running = false;
      this.emit("disconnected");
      return;
    }

    try {
      // macOS: hidapi seizes the device by default (exclusive open), which the
      // system denies for anything enumerated as a keyboard — the event system
      // already owns it. A shared (non-exclusive) open is all we need to read
      // the raw HID reports; the flag is ignored on other platforms.
      this.device = new HID.HID(path, { nonExclusive: true });
    } catch (openErr) {
      // Enumerable but won't open. On macOS the raw HID collection lives on an
      // IOHIDDevice that also exposes keyboard usages, so TCC blocks the open
      // until the user grants Input Monitoring — by far the most likely cause.
      if (process.platform === "darwin") {
        log.warn(`[Lens/HID] Open blocked (Input Monitoring permission missing?): ${openErr}`);
        this.emit("permission-denied");
      } else {
        log.warn(`[Lens/HID] Cannot open ${this.activeProduct}: ${openErr}`);
      }
      // Keep activePath set so a later scan retries the open (grant may arrive).
      this.running = false;
      return;
    }

    log.info(`[Lens/HID] Active device: ${this.activeProduct} (${path})`);
    this.running = true;
    this.emit("connected");
    this.emit("active-changed", this.activeProduct);
    this.device.on("data", (buf: Buffer) => this.onData(buf));
    this.device.on("error", () => this.onDeviceError());
  }

  private onDeviceError(): void {
    const lostPath = this.activePath;
    log.info(`[Lens/HID] Active device error (${this.activeProduct}), re-scanning...`);
    this.closeDevice();
    if (lostPath) this.seen.delete(lostPath);
    this.activePath = null;
    this.activeProduct = null;
    this.running = false;
    this.emit("disconnected");
    // Re-evaluate immediately: another board may still be connected, or the same
    // one may re-enumerate. With nothing open any more, this also restarts the
    // idle poll.
    this.scanNow();
  }

  private closeDevice(): void {
    try {
      this.device?.close();
    } catch {
      // ignore
    }
    this.device = null;
  }

  /** Every collection a Dygma board exposes, as the log wants to see it. */
  private static describeDygmaDevices(devices: HidDeviceInfo[]) {
    const vendorIds = new Set(LENS_PRODUCTS.map(p => p.vendorId));
    return devices
      .filter(d => vendorIds.has(d.vendorId ?? 0))
      .map(d => ({
        productId: `0x${(d.productId ?? 0).toString(16)}`,
        usagePage: `0x${(d.usagePage ?? 0).toString(16)}`,
        usage: `0x${(d.usage ?? 0).toString(16)}`,
        interface: d.interface,
        product: d.product,
        hasPath: !!d.path,
      }));
  }

  /**
   * Dumps every Dygma collection once per listener run, whether or not a board
   * matched. The "nothing found" dump below only fires when no board matched at
   * all, which is no help for a board that enumerates but never delivers overlay
   * packets — the Defy wired Neuron report. This is the line to ask a user for.
   */
  private logDygmaEnumOnce(devices: HidDeviceInfo[]): void {
    if (this.dygmaEnumLogged) return;
    const dygma = RawHidListener.describeDygmaDevices(devices);
    if (dygma.length === 0) return;
    this.dygmaEnumLogged = true;
    log.info(`[Lens/HID] Dygma HID collections enumerated: ${JSON.stringify(dygma)}`);
  }

  private logNoDeviceOnce(devices: HidDeviceInfo[]): void {
    if (this.enumLogged) return;
    this.enumLogged = true;
    const dygma = RawHidListener.describeDygmaDevices(devices);
    log.info(
      `[Lens/HID] No supported keyboard found (want usagePage=0xff00). ` +
        `Enumerated ${dygma.length} HID collections with a Dygma VID: ${JSON.stringify(dygma)}`,
    );
  }

  private onData(buf: Buffer): void {
    if (buf.length < OVERLAY_PACKET_SIZE) return;

    // USB HID prepends the report ID at buf[0] (SONSEI_RAW_HID_REPORT_ID on every
    // board checked so far); BLE HID does not. Locate the payload by the magic byte
    // rather than by that one report ID, so a board whose vendor interface uses a
    // different one still decodes instead of having every packet dropped here.
    let base: number;
    if (buf[0] === OVERLAY_MAGIC_BYTE) base = 0;
    else if (buf[1] === OVERLAY_MAGIC_BYTE) base = 1;
    else return;

    const packetType = buf[base + 1];

    if (packetType === PACKET_TYPE_OVERLAY) {
      const eventType = buf[base + 2];
      if (!this.shouldEmit("overlay", eventType)) return;
      log.verbose(`[Lens/HID] overlay (OVERLAY_KEY superkey): eventType=0x${eventType.toString(16)}`);
      this.emit("overlay", { type: "overlay", eventType });
    } else if (packetType === PACKET_TYPE_OVERLAY_TAP) {
      const eventType = buf[base + 2];
      if (!this.shouldEmit("overlay-tap", eventType)) return;
      log.verbose(`[Lens/HID] overlay-tap (OVERLAY_TAP key): eventType=0x${eventType.toString(16)}`);
      this.emit("overlay-tap", { type: "overlay-tap", eventType });
    } else if (packetType === PACKET_TYPE_OVERLAY_HOLD) {
      const eventType = buf[base + 2];
      if (!this.shouldEmit("overlay-hold", eventType)) return;
      log.verbose(`[Lens/HID] overlay-hold (OVERLAY_HOLD key): eventType=0x${eventType.toString(16)}`);
      this.emit("overlay-hold", { type: "overlay-hold", eventType });
    } else if (packetType === PACKET_TYPE_LAYER) {
      log.verbose(`[Lens/HID] layer-change: layer=${buf[base + 2]}`);
      this.emit("layer-change", { type: "layer", layer: buf[base + 2] });
    }
  }

  stop(): void {
    this.running = false;
    this.watching = false;
    this.rescanQueued = false;
    this.dygmaPresent = false;
    this.detachHotplug();
    // Re-log the one-shot diagnostics next time the listener runs, so a user who
    // toggles Lens off and on gets a fresh enumeration dump instead of silence.
    this.dygmaEnumLogged = false;
    this.relaxedMatchLogged = false;
    this.enumLogged = false;
    // A stop() while suspended (Lens disabled mid-flash) wins: clearing the flag
    // makes the later resume() a no-op instead of restarting a listener the user
    // just turned off. enable() calls startWithRetry() again on its own.
    this.suspended = false;
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    this.closeDevice();
    this.seen.clear();
    this.activePath = null;
    this.activeProduct = null;
  }

  /**
   * stop(), then wait until node-hid has really closed the device. Its close()
   * only interrupts the read in flight; the handle is closed later, from that
   * read's callback. If the process exits first, the callback runs while Node
   * is tearing down, node-hid throws a C++ exception and the process aborts
   * (the macOS crash on Quit). Call this before letting the app quit.
   */
  async release(): Promise<void> {
    const { device } = this;
    this.stop();
    if (!device) return;
    const deadline = Date.now() + RELEASE_TIMEOUT_MS;
    while (!device._closed && Date.now() < deadline) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        setTimeout(resolve, 10);
      });
    }
    if (!device._closed) log.warn("[Lens/HID] Device still open after release timeout; quitting anyway");
  }
}
