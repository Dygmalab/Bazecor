import React from "react";
import type { DecodedKey, FunctionIconName } from "../shared/types";

/* Shared key-face text rendering for every Lens keyboard view (Sonsei, Defy,
 * Raise2). Draws the decoded label — primary line, optional second line
 * (superkey/macro names, Bazecor "top+primary" two-line keys), hold hint, and
 * modifier tag boxes — centered on the key face. Extracted from the per-view
 * copies so label styling stays identical across boards. */

const FS = 13;
const FSS = 11; // two-line keys (Super/name, Macro/name, Mouse/UP) — same size both lines
const FSH = 9;
const MOD_BOX_H = 9;
const MOD_BOX_GAP = 2;
const MOD_BOX_FS = 6;
const MOD_BOX_PX = 3;
// Bazecor's LayerTag / OneShotTag glyph paths, mirrored as inline SVG for the overlay.
const HOLD_ICON_PATHS: Record<"lock" | "shift" | "oneshot", { viewBox: string; width: number; height: number; paths: string[] }> =
  {
    lock: {
      viewBox: "0 0 16 15",
      width: 16,
      height: 15,
      paths: [
        "M9.46875 10.3366L7.5 11.6491L3.15139 8.74998L3.35694 8.61295L2.45555 8.01202L1.34861 8.74998L7.5 12.8509L9.46875 11.5384V10.3366Z",
        "M13.6513 5.83331L7.5 1.73242L1.34861 5.83335L7.5 9.93427L9.46875 8.62177V7.41992L7.5 8.73242L3.15139 5.83335L7.5 2.93427L11.8486 5.83331H13.6513Z",
        "M11.6515 8.78981C11.6515 8.69914 11.7012 8.65381 11.8006 8.65381H12.9835C13.0763 8.65381 13.1227 8.69648 13.1227 8.78181V13.6138C13.1227 13.6778 13.1591 13.7098 13.232 13.7098H16.4925C16.5985 13.7098 16.6515 13.7471 16.6515 13.8218V14.4698C16.6515 14.5018 16.6383 14.5311 16.6118 14.5578C16.5852 14.5791 16.5422 14.5898 16.4825 14.5898H11.8404C11.7675 14.5898 11.7178 14.5791 11.6913 14.5578C11.6648 14.5311 11.6515 14.4938 11.6515 14.4458V8.78981Z",
      ],
    },
    shift: {
      viewBox: "0 0 16 15",
      width: 16,
      height: 15,
      paths: [
        "M8.96875 10.3366L7 11.6491L2.65139 8.74998L2.85694 8.61295L1.95555 8.01202L0.84861 8.74998L7 12.8509L8.96875 11.5384V10.3366Z",
        "M13.1513 5.83331L7 1.73242L0.84861 5.83335L7 9.93427L8.96875 8.62177V7.41992L7 8.73242L2.65139 5.83335L7 2.93427L11.3486 5.83331H13.1513Z",
        "M14.976 9.42251C14.848 9.28384 14.6907 9.16118 14.504 9.05451C14.3173 8.94784 14.0613 8.89451 13.736 8.89451C13.3787 8.89451 13.1067 8.96384 12.92 9.10251C12.7333 9.24118 12.64 9.42518 12.64 9.65451C12.64 9.72918 12.656 9.80918 12.688 9.89451C12.7253 9.97984 12.7947 10.0652 12.896 10.1505C13.0027 10.2305 13.1547 10.3025 13.352 10.3665L14.584 10.7345C15.0747 10.8785 15.4267 11.0945 15.64 11.3825C15.8587 11.6652 15.968 11.9958 15.968 12.3745C15.968 12.7372 15.8747 13.0518 15.688 13.3185C15.5013 13.5852 15.2373 13.7905 14.896 13.9345C14.5547 14.0732 14.1467 14.1425 13.672 14.1425C13.3253 14.1425 13 14.1025 12.696 14.0225C12.3973 13.9425 12.1307 13.8252 11.896 13.6705C11.6667 13.5158 11.48 13.3318 11.336 13.1185C11.3093 13.0758 11.2987 13.0385 11.304 13.0065C11.3147 12.9692 11.3413 12.9345 11.384 12.9025L11.888 12.5505C11.952 12.5132 12 12.4972 12.032 12.5025C12.0693 12.5078 12.1013 12.5265 12.128 12.5585C12.2613 12.7292 12.392 12.8705 12.52 12.9825C12.6533 13.0892 12.8053 13.1692 12.976 13.2225C13.1467 13.2758 13.3547 13.3025 13.6 13.3025C13.9733 13.3025 14.272 13.2412 14.496 13.1185C14.72 12.9905 14.832 12.7932 14.832 12.5265C14.832 12.4198 14.808 12.3238 14.76 12.2385C14.7173 12.1478 14.6427 12.0652 14.536 11.9905C14.4347 11.9158 14.2853 11.8465 14.088 11.7825L12.88 11.4145C12.5707 11.3185 12.3147 11.1905 12.112 11.0305C11.9147 10.8652 11.7653 10.6758 11.664 10.4625C11.5627 10.2492 11.512 10.0278 11.512 9.79851C11.512 9.45718 11.6027 9.15584 11.784 8.89451C11.9653 8.62784 12.2213 8.41984 12.552 8.27051C12.8827 8.12118 13.2693 8.04651 13.712 8.04651C14 8.04651 14.2693 8.08118 14.52 8.15051C14.776 8.21451 15.0053 8.30784 15.208 8.43051C15.416 8.55318 15.5867 8.69984 15.72 8.87051C15.7413 8.89718 15.7573 8.92651 15.768 8.95851C15.7787 8.98518 15.7627 9.01718 15.72 9.05451L15.152 9.47851C15.1253 9.49984 15.0987 9.50784 15.072 9.50251C15.0507 9.49184 15.0187 9.46518 14.976 9.42251Z",
      ],
    },
    oneshot: {
      viewBox: "0 0 19 16",
      width: 19,
      height: 16,
      paths: [
        "M14.481 8.5C14.4936 8.33497 14.5 8.16823 14.5 8C14.5 6.2934 13.8416 4.73944 12.766 3.58006C11.5796 2.30131 9.88297 1.5 8 1.5C6.11703 1.5 4.42045 2.30131 3.23403 3.58006C2.15836 4.73944 1.5 6.2934 1.5 8C1.5 9.7066 2.15836 11.2606 3.23403 12.4199C4.42045 13.6987 6.11703 14.5 8 14.5C8.17089 14.5 8.34024 14.4934 8.50781 14.4804L8.5 8.5H14.481ZM6.47611 7.5C6.33211 6.00074 5.54731 4.68907 4.40012 3.84163C5.247 3.10774 6.31961 2.6287 7.5 2.5224V7.5H6.47611ZM8.5 7.5V2.5224C9.68039 2.6287 10.753 3.10774 11.5999 3.84163C10.4527 4.68908 9.66789 6.00074 9.52389 7.5H8.5ZM10.5297 7.5C10.6748 6.28667 11.3412 5.2331 12.2999 4.57023C12.9537 5.38864 13.3783 6.39716 13.4776 7.5H10.5297ZM7.5 8.5V13.4776C6.31961 13.3713 5.247 12.8923 4.40012 12.1584C5.54731 11.3109 6.33211 9.99926 6.47611 8.5H7.5ZM5.47032 8.5C5.32524 9.71333 4.6588 10.7669 3.70009 11.4298C3.04633 10.6114 2.6217 9.60284 2.5224 8.5H5.47032Z",
        "M11.132 10.2C11.132 10.1094 11.172 10.064 11.252 10.064H12.204C12.2787 10.064 12.316 10.1067 12.316 10.192V15.024C12.316 15.088 12.3453 15.12 12.404 15.12H15.028C15.1133 15.12 15.156 15.1574 15.156 15.232V15.88C15.156 15.912 15.1453 15.9414 15.124 15.968C15.1027 15.9894 15.068 16 15.02 16H11.284C11.2253 16 11.1853 15.9894 11.164 15.968C11.1427 15.9414 11.132 15.904 11.132 15.856V10.2Z",
      ],
    },
  };

// Bazecor's media/tool key glyphs (IconMediaSoundMute, IconToolsEject, …),
// mirrored as raw path data at their "sm" (20x20) size — the only size
// Bazecor's own keymap DB ever uses for these keys (db/mediacontrols.tsx,
// db/miscellaneous.tsx). Most are solid fills; a few (camera, calculator's
// frame lines, the brightness rays/arc) are stroke-only outlines.
interface FnIconPath {
  d: string;
  stroke?: boolean;
  strokeWidth?: number;
  evenodd?: boolean;
}
const FUNCTION_ICON_SIZE = 20;
const FUNCTION_ICON_PATHS: Record<FunctionIconName, FnIconPath[]> = {
  mute: [
    {
      d: "M8.316 4.384l-2.752 2.75H2.408a.742.742 0 00-.742.743v4.453c0 .41.332.742.742.742h3.156l2.752 2.751c.465.465 1.267.138 1.267-.525V4.908c0-.663-.803-.988-1.267-.524zm7.626 5.72l1.412-1.412a.5.5 0 000-.706l-.706-.705a.5.5 0 00-.706 0l-1.411 1.411-1.412-1.411a.5.5 0 00-.705 0l-.706.705a.499.499 0 000 .706l1.411 1.412-1.41 1.41a.499.499 0 000 .706l.705.706a.5.5 0 00.706 0l1.41-1.411 1.412 1.411c.195.195.511.195.706 0l.706-.705a.5.5 0 000-.706l-1.412-1.412z",
    },
  ],
  "vol-up": [
    {
      d: "M8.56 5.505L6.396 7.667h-2.48a.583.583 0 00-.584.583v3.5c0 .322.261.583.584.583h2.48l2.162 2.162a.584.584 0 00.996-.412V5.916a.584.584 0 00-.996-.412zm5.67-1.242a.588.588 0 10-.645.984A5.672 5.672 0 0116.157 10c0 1.92-.962 3.697-2.572 4.754a.588.588 0 10.645.983A6.846 6.846 0 0017.333 10a6.846 6.846 0 00-3.103-5.737zM15 10c0-1.544-.78-2.964-2.085-3.797a.58.58 0 00-.805.18.59.59 0 00.18.812A3.317 3.317 0 0113.833 10c0 1.14-.577 2.188-1.543 2.805a.59.59 0 00-.18.81.582.582 0 00.805.182A4.487 4.487 0 0014.999 10zm-3.446-1.868a.584.584 0 00-.563 1.022.97.97 0 01.508.846.97.97 0 01-.508.846.584.584 0 00.563 1.022A2.137 2.137 0 0012.666 10c0-.775-.426-1.49-1.112-1.868z",
    },
  ],
  "vol-down": [
    {
      d: "M10.7 4.38L7.995 7.083h-3.1a.729.729 0 00-.73.73v4.375c0 .402.326.729.73.729h3.1l2.703 2.702c.457.457 1.245.136 1.245-.515V4.896c0-.652-.789-.971-1.245-.516zm3.742 3.284a.73.73 0 00-.704 1.278c.393.216.636.621.636 1.058 0 .437-.243.842-.635 1.058a.73.73 0 00.704 1.277A2.672 2.672 0 0015.833 10c0-.969-.533-1.863-1.39-2.336z",
    },
  ],
  "play-pause": [
    { d: "M8.814 10L3.99 4.167v11.666L8.814 10zM14.261 4.846h2.83v10.377h-2.83z" },
    { d: "M9.544 7.196l2.32 2.805-2.32 2.804v2.418h2.83V4.846h-2.83v2.35z", evenodd: true },
  ],
  next: [{ d: "M10.417 9.583l-6.25-6.25v12.5l6.25-6.25z" }, { d: "M16.31 9.583l-6.25-6.25v12.5l6.25-6.25z" }],
  prev: [{ d: "M8.393 10.417l6.25 6.25v-12.5l-6.25 6.25z" }, { d: "M2.5 10.417l6.25 6.25v-12.5l-6.25 6.25z" }],
  stop: [{ d: "M5 5h10v10H5z" }],
  eject: [{ d: "M4.167 14.167h11.666v1.666H4.167v-1.666zm5.833-10L4.442 12.5h11.116L10 4.167z" }],
  shuffle: [
    {
      d: "M15.855 11.254a.55.55 0 00-.773 0 .534.534 0 00-.16.387c0 .144.058.28.16.386l.637.633h-2.95L7.927 6.605l-.004-.003a.56.56 0 00-.422-.196H3.047c-.3 0-.547.246-.547.547 0 .3.246.547.547.547h4.195l2.051 2.578-2.05 2.578H3.046c-.3 0-.547.246-.547.547 0 .3.246.547.547.547H7.5c.16 0 .313-.07.418-.195l.004-.004L10 10.94l2.078 2.61.004.004a.546.546 0 00.418.195h3.297l-.637.633a.528.528 0 00-.16.387.55.55 0 00.934.387l1.312-1.305a.838.838 0 00.254-.606c0-.23-.09-.445-.254-.605l-1.39-1.387z",
    },
    {
      d: "M10.914 9.196c.043.055.11.082.18.082h.004c.07 0 .136-.031.18-.086l1.48-1.847h2.96l-.636.633a.528.528 0 00-.16.386.55.55 0 00.934.387l1.39-1.383a.845.845 0 000-1.21l-1.312-1.306a.55.55 0 00-.774 0 .534.534 0 00-.16.387c0 .145.059.281.16.387l.637.633H12.5c-.16 0-.313.07-.418.195l-.004.004-1.574 1.96a.23.23 0 00.004.298l.406.48z",
    },
  ],
  camera: [
    {
      d: "M14.167 10V5.833A.833.833 0 0013.333 5H2.5a.833.833 0 00-.833.833v8.334c0 .46.373.833.833.833h10.833c.46 0 .834-.373.834-.833V10zm0 0l4.024-4.024a.083.083 0 01.142.059v7.93c0 .075-.09.112-.142.06L14.167 10z",
      stroke: true,
      strokeWidth: 1.25,
    },
  ],
  calculator: [
    {
      d: "M16.667 11.667l-2.5 2.5m0 0l-2.5 2.5m2.5-2.5l-2.5-2.5m2.5 2.5l2.5 2.5M2.5 14.167h6.667",
      stroke: true,
      strokeWidth: 1.25,
    },
    {
      d: "M6.667 11.667a.833.833 0 11-1.667 0 .833.833 0 011.667 0zm0 5a.833.833 0 11-1.667 0 .833.833 0 011.667 0z",
      evenodd: true,
    },
    { d: "M10.833 5.833H17.5M5.833 2.5v6.667M2.5 5.833h6.667", stroke: true, strokeWidth: 1.25 },
  ],
  "bright-up": [
    {
      d: "M7.273 11.954a3.636 3.636 0 013.636-3.636v0a3.636 3.636 0 013.636 3.636v.471a.257.257 0 01-.256.257h-6.76a.257.257 0 01-.256-.257v-.47z",
      stroke: true,
      strokeWidth: 1,
    },
    { d: "M10.909 5.773V2.5M15.273 7.723l2.314-2.314", stroke: true, strokeWidth: 1.25 },
    { d: "M16.727 11.954H20", stroke: true, strokeWidth: 1 },
    { d: "M6.182 7.723L3.868 5.409", stroke: true, strokeWidth: 1.25 },
    { d: "M4 10.864v6.545H2.545v-6.545z" },
    { d: "M0 13.409h6.545v1.455H0z" },
  ],
  "bright-down": [
    {
      d: "M8 12.567a4 4 0 014-4v0a4 4 0 014 4v.517a.282.282 0 01-.282.283H8.282A.282.282 0 018 13.084v-.517z",
      stroke: true,
      strokeWidth: 1,
    },
    { d: "M12 5.767v-1.6M16.8 7.912l1.131-1.131", stroke: true, strokeWidth: 1.25 },
    { d: "M18.4 12.567H20", stroke: true, strokeWidth: 1 },
    { d: "M6.8 7.912L5.669 6.781", stroke: true, strokeWidth: 1.25 },
    { d: "M0 14.167h7.2v1.6H0z" },
  ],
  "power-off": [
    { d: "M6.667 16.667v.833h6.667v-.833z" },
    { d: "M17.02 18.813L.354 2.147", stroke: true, strokeWidth: 1 },
    {
      d: "M4.167 3.333h12.5c.46 0 .833.374.833.834v10c0 .46-.373.833-.833.833h-.834l-1-1H16.5V4.333H5.167l-1-1zM12.477 14H3.5V5.024l-.99-.99a.84.84 0 00-.01.133v10c0 .46.373.833.833.833h10.143l-1-1z",
      evenodd: true,
    },
  ],
  sleep: [
    {
      d: "M13.333 16.666v.833H6.666v-.833zM10.321 11.398c-.047 0-.08-.007-.1-.023-.015-.015-.023-.047-.023-.093v-.21c0-.05.006-.088.018-.111a.775.775 0 01.082-.128l1.989-2.935c.03-.05.015-.075-.047-.075h-1.785c-.039 0-.066-.008-.082-.024a.173.173 0 01-.017-.087v-.543c0-.066.027-.099.082-.099h3.226c.058 0 .087.031.087.093v.24a.234.234 0 01-.018.093.79.79 0 01-.064.1l-2.036 2.974c-.019.027-.02.047-.005.058a.13.13 0 00.058.012h1.937c.07 0 .105.03.105.088v.565c0 .032-.01.057-.03.076-.015.02-.042.03-.081.03H10.32zM14.58 7.232c-.06 0-.103-.01-.128-.03-.02-.02-.03-.06-.03-.12v-.27c0-.065.007-.113.022-.143a.995.995 0 01.105-.165l2.558-3.772c.04-.065.02-.098-.06-.098h-2.295c-.05 0-.085-.01-.105-.03a.223.223 0 01-.023-.112v-.698c0-.085.035-.127.105-.127h4.148c.075 0 .112.04.112.12v.307a.302.302 0 01-.022.12c-.015.03-.043.073-.083.128l-2.617 3.825c-.025.035-.028.06-.008.075.02.01.045.015.075.015h2.49c.09 0 .135.037.135.112v.728c0 .04-.012.072-.037.097-.02.025-.055.038-.105.038h-4.238z",
    },
    {
      d: "M13.333 3.333h-10a.833.833 0 00-.833.834v10c0 .46.373.833.833.833h13.334c.46 0 .833-.373.833-.833v-5h-1V14h-13V4.333h9.833v-1z",
    },
  ],
};

const MOD_CHAR_W = 3.5;
const MOD_WIDTH: Record<string, number> = { Ctrl: 4, Shift: 5, Alt: 3, AltGr: 5, OS: 2, Meh: 3, Hyper: 5 };

function modBoxWidth(label: string): number {
  const chars = MOD_WIDTH[label] ?? label.length;
  return chars * MOD_CHAR_W + MOD_BOX_PX * 2;
}

// Bazecor's own combo names (db/utils.ts's withModifiers group names, e.g.
// "Meh +" for Ctrl+Alt+Shift, "Hyper +" for +OS on top of that) — the exact
// reason spelling out 3+ separate "Ctrl"/"Alt"/"Shift" chips doesn't fit a
// 57px key face is that Bazecor itself collapses these into one word instead.
// Anything else with 3+ mods falls back to Bazecor's own abbreviation style
// ("C+A+AGr", from the same file's other `top` labels) as a single chip.
const MOD_ABBR: Record<string, string> = { Ctrl: "C", Alt: "A", AltGr: "AGr", Shift: "S", OS: "O" };
const MOD_ORDER = ["Ctrl", "Alt", "AltGr", "Shift", "OS"];
function combineMods(mods: string[]): string {
  const has = (m: string) => mods.includes(m);
  if (mods.length === 5) return "Hyper+AltGr";
  if (mods.length === 4 && has("Ctrl") && has("Alt") && has("AltGr") && has("Shift")) return "Meh+AltGr";
  if (mods.length === 4 && has("Ctrl") && has("Alt") && has("Shift") && has("OS")) return "Hyper";
  if (mods.length === 3 && has("Ctrl") && has("Alt") && has("Shift")) return "Meh";
  return MOD_ORDER.filter(has)
    .map(m => MOD_ABBR[m])
    .join("+");
}

function lum(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** Foreground (text) color with enough contrast against the key's LED color. */
export function fg(r: number, g: number, b: number): string {
  return lum(r, g, b) > 128 ? "#111" : "#eee";
}

/** Shrink a line's font so Bazecor's longer labels ("BACKSPACE", "PAGE DOWN")
 * still fit a standard 57px key face instead of overflowing. */
export function fitFontSize(text: string, base: number): number {
  if (text.length >= 9) return base * 0.62;
  if (text.length >= 7) return base * 0.72;
  if (text.length >= 5) return base * 0.85;
  return base;
}

/** Ported from Bazecor's own `getDivideKeys` (per-hardware Keymap.jsx): a
 * single word longer than 7 characters — and not a modifier combo like
 * "C+A" — gets cut at 4 chars onto two lines ("BACKSPACE" -> "BACK"/"SPACE")
 * instead of overflowing the key face. Multi-word labels are left alone (they
 * already wrap on the space). */
export function splitLongWord(text: string): [string, string] | null {
  if (!text || text.includes(" ")) return null;
  if (text.length <= 7) return null;
  if (text.startsWith("C+") || text.startsWith("A+") || text.startsWith("AGr+")) return null;
  return [text.slice(0, 4), text.slice(4)];
}

/**
 * Text/modifier content for one key, positioned around center (cx, cy). `boxTop`
 * and `boxH` bound the key face so the hold line / modifier boxes sit near the
 * bottom. Shared by both rectangular keys (absolute coords) and silhouette keys
 * (local coords inside their translated group). `rotation` (degrees, about
 * (cx, cy)) tilts the whole label block to follow a curved key silhouette
 * (Defy's fanned thumb keys) instead of sitting flat/horizontal.
 */
export function keyLabel(
  cx: number,
  cy: number,
  boxTop: number,
  boxH: number,
  label: DecodedKey,
  fgColor: string,
  rotation = 0,
): JSX.Element {
  const hasSub = Boolean(label.subtitle);
  const mods = label.modifiers ?? [];
  const hasMods = mods.length > 0;

  let primaryY = cy + 1;
  if (hasMods) primaryY = cy - 5;
  else if (label.hold) primaryY = cy - 2;

  let primaryContent: JSX.Element | null = null;
  if (label.icon) {
    const paths = FUNCTION_ICON_PATHS[label.icon];
    const size = 15;
    primaryContent = (
      <svg
        x={cx - size / 2}
        y={primaryY - size / 2}
        width={size}
        height={size}
        viewBox={`0 0 ${FUNCTION_ICON_SIZE} ${FUNCTION_ICON_SIZE}`}
        pointerEvents="none"
      >
        {paths.map(p => (
          <path
            key={p.d}
            d={p.d}
            fill={p.stroke ? "none" : fgColor}
            stroke={p.stroke ? fgColor : undefined}
            strokeWidth={p.strokeWidth}
            strokeLinejoin={p.stroke ? "round" : undefined}
            fillRule={p.evenodd ? "evenodd" : undefined}
            clipRule={p.evenodd ? "evenodd" : undefined}
          />
        ))}
      </svg>
    );
  } else if (hasSub) {
    primaryContent = (
      <>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fitFontSize(label.primary, FSS)}
          fontWeight="700"
          fontFamily="system-ui,-apple-system,sans-serif"
          fill={fgColor}
          pointerEvents="none"
        >
          {label.primary}
        </text>
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fitFontSize(label.subtitle ?? "", FSS)}
          fontWeight="700"
          fontFamily="system-ui,-apple-system,sans-serif"
          fill={fgColor}
          pointerEvents="none"
        >
          {label.subtitle}
        </text>
      </>
    );
  } else if (label.primary) {
    const split = splitLongWord(label.primary);
    if (split) {
      primaryContent = (
        <>
          <text
            x={cx}
            y={primaryY - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fitFontSize(split[0], FSS)}
            fontWeight="700"
            fontFamily="system-ui,-apple-system,sans-serif"
            fill={fgColor}
            pointerEvents="none"
          >
            {split[0]}
          </text>
          <text
            x={cx}
            y={primaryY + 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fitFontSize(split[1], FSS)}
            fontWeight="700"
            fontFamily="system-ui,-apple-system,sans-serif"
            fill={fgColor}
            pointerEvents="none"
          >
            {split[1]}
          </text>
        </>
      );
    } else {
      primaryContent = (
        <text
          x={cx}
          y={primaryY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fitFontSize(label.primary, FS)}
          fontWeight="700"
          fontFamily="system-ui,-apple-system,sans-serif"
          fill={fgColor}
          pointerEvents="none"
        >
          {label.primary}
        </text>
      );
    }
  }

  let secondaryContent: JSX.Element[] | JSX.Element | null = null;
  if (label.holdIcon) {
    const icon = HOLD_ICON_PATHS[label.holdIcon];
    const scale = label.holdIcon === "oneshot" ? 0.65 : 0.7;
    const iw = icon.width * scale;
    const ih = icon.height * scale;
    const ix = cx - iw / 2;
    const iy = boxTop + boxH - 12 - ih;
    secondaryContent = (
      <svg x={ix} y={iy} width={iw} height={ih} viewBox={icon.viewBox} fill={fgColor} opacity={0.85} pointerEvents="none">
        {icon.paths.map(d => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  } else if (hasMods) {
    // 3+ separate chips ("Ctrl"/"Alt"/"Shift"/…) don't fit a 57px key face —
    // collapse into a single combined chip instead (see combineMods above).
    // Shift alone is abbreviated to "S" even at 1-2 chips: it's the most common
    // modifier shown here, and the full word crowds a key face that's already
    // showing the modified character above it.
    const display = mods.length >= 3 ? [combineMods(mods)] : mods.map(m => (m === "Shift" ? "S" : m));
    const totalW = display.reduce((s, m) => s + modBoxWidth(m), 0) + MOD_BOX_GAP * (display.length - 1);
    const boxY = boxTop + boxH - 10 - MOD_BOX_H;
    let bx = cx - totalW / 2;
    secondaryContent = display.map(m => {
      const bw = modBoxWidth(m);
      const el = (
        <g key={m}>
          <rect
            x={bx}
            y={boxY}
            width={bw}
            height={MOD_BOX_H}
            rx={2}
            fill="rgba(0,0,0,0.28)"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.5}
          />
          <text
            x={bx + bw / 2}
            y={boxY + MOD_BOX_H / 2 + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={MOD_BOX_FS}
            fontWeight="600"
            fontFamily="system-ui,-apple-system,sans-serif"
            fill={fgColor}
            pointerEvents="none"
          >
            {m}
          </text>
        </g>
      );
      bx += bw + MOD_BOX_GAP;
      return el;
    });
  } else if (label.hold) {
    // boxTop+boxH is the full key cell, but the color face is inset 4px top/
    // bottom (see the "-8" rect height at each call site) — "-10" left this
    // (layer names, superkey/oneshot hints) sitting only 2px above the face's
    // real bottom edge, cramped against it.
    secondaryContent = (
      <text
        x={cx}
        y={boxTop + boxH - 13}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fitFontSize(label.hold, FSH)}
        fontWeight="600"
        fontFamily="system-ui,-apple-system,sans-serif"
        fill={fgColor}
        opacity={0.7}
        pointerEvents="none"
      >
        {label.hold}
      </text>
    );
  }

  const content = (
    <>
      {primaryContent}
      {secondaryContent}
    </>
  );

  if (!rotation) return content;
  return <g transform={`rotate(${rotation},${cx},${cy})`}>{content}</g>;
}
