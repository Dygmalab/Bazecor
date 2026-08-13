export interface PaletteColor {
  r: number;
  g: number;
  b: number;
  w: number;
  rgb: string;
}

export interface KeyboardModel {
  /** Bazecor product name this model was parsed from (e.g. "Sonsei", "Defy").
   * Drives which keyboard geometry the renderer draws. */
  product: string;
  /** Bazecor `info.keyboardType` ("ANSI"/"ISO"), for products that ship both
   * (e.g. Raise2). Lets the renderer pick the matching geometry/shape variant
   * instead of always assuming ANSI. Undefined for products with a single layout. */
  keyboardType?: string;
  keymap: number[][];
  palette: PaletteColor[];
  colormap: number[][];
  defaultLayer: number;
  superkeys: number[][];
  superkeyNames: string[];
  macroNames: string[];
  layerNames: string[];
}

/** Reference to the backup folder Lens reads the keyboard model from. */
export interface LensKeyboardRef {
  backupFolder: string;
  neuronID: string;
  product: string;
  /** Bazecor `info.keyboardType` ("ANSI"/"ISO"), when the product has variants. */
  keyboardType?: string;
}

export interface LensSettings {
  enabled: boolean;
  opacity: number;
  showUnderglow: boolean;
  layout: string;
  layerNames: string[];
  overlayMode: boolean;
  overlayAutoShow: boolean;
  /** When true, the overlay's resize frame and drag surface are active, so the
   * window can be repositioned/resized. Toggled from Preferences or the tray. */
  resizeMode: boolean;
}

/** Last position/size of the overlay window, persisted so the overlay reopens
 * where the user left it instead of recentering on the primary display. */
export interface OverlayBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Shape of the `lens` key persisted in Bazecor's electron-store. */
export interface LensStoreState extends LensSettings {
  /** Saved overlay window bounds (updated on move/resize/close). */
  overlayBounds?: OverlayBounds;
  /** Whether the overlay was on screen the last time the user deliberately
   * showed or hid it (Lens key TAP, Ctrl+Alt+L, tray). Restored on the next
   * launch so Lens never reappears after the user hid it. Undefined on a fresh
   * install, which counts as "show it once Lens gets enabled". */
  overlayShown?: boolean;
  /** Legacy single-keyboard ref (Sonsei-only Lens). Kept for one-time migration
   * into `keyboards`; new code writes/reads `keyboards`. */
  keyboard?: LensKeyboardRef;
  /** Per-product backup refs, keyed by Bazecor product name ("Sonsei", "Defy", …).
   * Lens reads the ref for whichever keyboard is currently the active device. */
  keyboards?: Record<string, LensKeyboardRef>;
  migratedFromStandalone?: boolean;
  /** Whether the "First time using Layer Lens" instructions card in Preferences
   * is folded away. Persisted so the user only has to dismiss it once.
   * Undefined on a fresh install, which counts as "expanded". */
  onboardingCollapsed?: boolean;
}

export interface LensState {
  model: KeyboardModel | null;
  activeLayer: number;
  configFound: boolean;
  /** Product name of the keyboard currently driving the overlay (last connected),
   * or null when none is active. */
  activeProduct: string | null;
  /** macOS only: the raw HID device exists but opening it was blocked by TCC
   * (Input Monitoring permission not granted to Bazecor). */
  hidPermissionDenied: boolean;
}

export type FunctionIconName =
  | "mute"
  | "vol-up"
  | "vol-down"
  | "play-pause"
  | "next"
  | "prev"
  | "stop"
  | "eject"
  | "shuffle"
  | "camera"
  | "calculator"
  | "bright-up"
  | "bright-down"
  | "power-off"
  | "sleep";

export interface DecodedKey {
  primary: string;
  hold: string;
  subtitle?: string; // second line at same size as primary (superkey name, macro name)
  modifiers?: string[]; // modifier tag boxes shown at bottom
  holdIcon?: "lock" | "shift" | "oneshot"; // Bazecor-style layer-switch glyph drawn in place of hold text
  icon?: FunctionIconName; // Bazecor media/tool key glyph drawn in place of primary text
}
