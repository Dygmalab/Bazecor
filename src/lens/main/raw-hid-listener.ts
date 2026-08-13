import { EventEmitter } from "events";
import log from "electron-log/main";
import {
  OVERLAY_MAGIC_BYTE,
  OVERLAY_PACKET_SIZE,
  PACKET_TYPE_OVERLAY,
  PACKET_TYPE_LAYER,
  PACKET_TYPE_OVERLAY_TAP,
  PACKET_TYPE_OVERLAY_HOLD,
  SONSEI_RAW_HID_REPORT_ID,
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
}

interface NodeHidModule {
  devices(): HidDeviceInfo[];
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

const SCAN_INTERVAL_MS = 2000;

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

  private lastEventTime: Record<string, number> = {};

  private enumLogged = false;

  // path -> {product, firstSeen}. Rebuilt from HID enumeration each scan.
  private seen = new Map<string, SeenDevice>();

  private activePath: string | null = null;

  private activeProduct: LensProduct | null = null;

  // Set while Bazecor is flashing firmware. The board reboots into (and out of)
  // its bootloader during that window, so both our open HID handle and the 2s
  // HID.devices() enumeration have to get out of the way — see suspend().
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

  /** Begin watching; keeps scanning on an interval until stop(). */
  startWithRetry(): void {
    this.scan()
      .catch(err => log.warn("[Lens/HID] Initial scan() failed:", err))
      .finally(() => this.scheduleScan());
  }

  /**
   * Releases the keyboard for the duration of a firmware flash.
   *
   * Flashing power-cycles the Neuron and its keyscanner sides, and the flasher
   * drives the board over its serial/CDC interface on the same composite USB
   * device we hold a HID handle on. Keeping that handle open — and re-enumerating
   * every device with node-hid's blocking HID.devices() every 2s while the board
   * is dropping off and re-appearing on the bus — is enough to stall the flash
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

  // scan() can throw past its own try/catches — e.g. a listener registered on
  // "connected"/"active-changed" (overlay-controller.ts) throwing synchronously
  // during setActive(). Previously that rejected this callback before reaching
  // scheduleScan() below, and since scanTimer was already nulled, the polling
  // loop died silently and permanently — no more layer-change/overlay events,
  // ever, until the app restarted. Always reschedule regardless of outcome.
  private scheduleScan(): void {
    if (this.scanTimer || this.suspended) return;
    this.scanTimer = setTimeout(async () => {
      this.scanTimer = null;
      try {
        await this.scan();
      } catch (err) {
        log.warn("[Lens/HID] scan() failed, will retry:", err);
      } finally {
        this.scheduleScan();
      }
    }, SCAN_INTERVAL_MS);
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
      devices = HID.devices();
    } catch (err) {
      log.warn("[Lens/HID] devices() enumeration failed:", err);
      return;
    }

    // Keep only the raw HID / vendor collection (usagePage 0xff00, usage 0x01) of
    // supported boards — the same interface the overlay firmware reports on.
    const matches = devices.filter(
      d => d.path && d.usagePage === 0xff00 && d.usage === 0x01 && productForUsbIds(d.vendorId ?? 0, d.productId ?? 0) !== null,
    );

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
    // one may re-enumerate. Fire-and-forget, but never leave it unhandled — this
    // is called from a "device error" event, exactly the moment a listener
    // downstream is most likely to hit unexpected state.
    this.scan().catch(err => log.warn("[Lens/HID] Re-scan after device error failed:", err));
  }

  private closeDevice(): void {
    try {
      this.device?.close();
    } catch {
      // ignore
    }
    this.device = null;
  }

  private logNoDeviceOnce(devices: HidDeviceInfo[]): void {
    if (this.enumLogged) return;
    this.enumLogged = true;
    const vendorIds = new Set(LENS_PRODUCTS.map(p => p.vendorId));
    const dygma = devices
      .filter(d => vendorIds.has(d.vendorId ?? 0))
      .map(d => ({
        productId: `0x${(d.productId ?? 0).toString(16)}`,
        usagePage: `0x${(d.usagePage ?? 0).toString(16)}`,
        usage: `0x${(d.usage ?? 0).toString(16)}`,
        interface: d.interface,
        product: d.product,
        hasPath: !!d.path,
      }));
    log.info(
      `[Lens/HID] No supported keyboard found (want usagePage=0xff00 usage=0x01). ` +
        `Enumerated ${devices.length} HID devices, ${dygma.length} with a Dygma VID: ${JSON.stringify(dygma)}`,
    );
  }

  private onData(buf: Buffer): void {
    if (buf.length < OVERLAY_PACKET_SIZE) return;

    // USB HID prepends the report ID at buf[0]; BLE HID does not.
    const base = buf[0] === SONSEI_RAW_HID_REPORT_ID ? 1 : 0;
    if (buf[base] !== OVERLAY_MAGIC_BYTE) return;

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
}
