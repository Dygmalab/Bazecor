export const SONSEI_VENDOR_ID = 0x35ef;
export const SONSEI_PRODUCT_ID = 0x0031;

export const SONSEI_KEYS_PER_LAYER = 60;
export const SONSEI_COLOR_LAYER_SIZE = 56;
export const SONSEI_PALETTE_SIZE = 16;

/**
 * Every keyboard Lens can visualize. Centralizes the per-product bits that used
 * to be Sonsei-only constants: the USB IDs used to detect the device over raw
 * HID, how many keys/LEDs a backup layer holds, and whether the palette is RGB
 * (3 bytes) or RGBW (4 bytes, e.g. Defy). Add a row here to support a new board
 * (Raise 2 next). `productIds` lists every app-mode PID (wired + wireless).
 *
 * keysPerLayer/colorLayerSize verified against real backups:
 *   Sonsei: 60 keys, 56 LEDs, RGB.   Defy: 80 keys, 178 LEDs, RGBW.
 *   Raise2: 80 keys, 176 LEDs (69 key + 107 underglow), RGBW.
 */
export type LensProduct = "Sonsei" | "Defy" | "Raise2";

export interface LensProductSpec {
  product: LensProduct;
  vendorId: number;
  productIds: number[];
  keysPerLayer: number;
  colorLayerSize: number;
  paletteFormat: "rgb" | "rgbw";
}

export const LENS_PRODUCTS: LensProductSpec[] = [
  {
    product: "Sonsei",
    vendorId: SONSEI_VENDOR_ID,
    productIds: [0x0031],
    keysPerLayer: 60,
    colorLayerSize: 56,
    paletteFormat: "rgb",
  },
  {
    product: "Defy",
    vendorId: 0x35ef,
    productIds: [0x0010, 0x0012],
    keysPerLayer: 80,
    colorLayerSize: 178,
    paletteFormat: "rgbw",
  },
  {
    // App-mode PID is 0x0021 for both ANSI and ISO in the current hardware
    // definitions (src/api/hardware-dygma-raise2-*/index.ts); 0x0023 is the PID
    // the ISO variant's own comment says it should use. Listing both so
    // detection keeps working if that gets corrected.
    product: "Raise2",
    vendorId: 0x35ef,
    productIds: [0x0021, 0x0023],
    keysPerLayer: 80,
    colorLayerSize: 176,
    paletteFormat: "rgbw",
  },
];

/** Lookup a product's spec by its Bazecor `product` name (case-insensitive). */
export function getProductSpec(product: string): LensProductSpec | undefined {
  return LENS_PRODUCTS.find(p => p.product.toLowerCase() === product.toLowerCase());
}

/** Match an enumerated HID device (VID/PID) to a supported product, or null. */
export function productForUsbIds(vendorId: number, productId: number): LensProduct | null {
  const spec = LENS_PRODUCTS.find(p => p.vendorId === vendorId && p.productIds.includes(productId));
  return spec ? spec.product : null;
}

/** True if Lens knows how to visualize this Bazecor product. */
export function isSupportedLensProduct(product: string | undefined): boolean {
  return !!product && getProductSpec(product) !== undefined;
}

export const LENS_CONFIG_PATH_SEGMENTS = [".lens", "lens-config.json"];

export const OVERLAY_MAGIC_BYTE = 0xaa;
export const OVERLAY_PACKET_SIZE = 5;

export const PACKET_TYPE_OVERLAY = 0x01; // OVERLAY_KEY (superkey)
export const PACKET_TYPE_LAYER = 0x02;
export const PACKET_TYPE_OVERLAY_TAP = 0x03; // OVERLAY_TAP key
export const PACKET_TYPE_OVERLAY_HOLD = 0x04; // OVERLAY_HOLD key

export const OVERLAY_EVENT_RELEASE = 0x00;
export const OVERLAY_EVENT_TAP = 0x01;
export const OVERLAY_EVENT_HOLD = 0x02;
export const OVERLAY_EVENT_DOUBLE_TAP = 0x03;

// HID report ID for the Raw HID / vendor interface (firmware HID_REPORTID_RAWHID).
// USB HID prepends this ID at buf[0]; BLE HID strips it.
export const SONSEI_RAW_HID_REPORT_ID = 5;

// Deep link to System Settings → Privacy & Security → Input Monitoring.
export const MACOS_INPUT_MONITORING_SETTINGS_URL = "x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent";
