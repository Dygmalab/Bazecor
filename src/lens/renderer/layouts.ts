/* Per-language base-layer keycode overrides for the Lens overlay, transcribed
 * from Bazecor's own keymap DB (src/api/keymap/languages/**), specifically the
 * unmodified/base-layer arrays each language file feeds into its `languages`
 * entry in src/api/keymap/languages/languageLayouts.ts — NOT the Alt/Ctrl/
 * AltGr/Shift modifier-combo tables in those files, which Lens has no use for
 * (it only ever shows the plain, unmodified label for a key).
 *
 * Keys here match src/renderer/modules/KeyPickerKeyboard/KeyPickerLanguage.ts's
 * LangOptions tags exactly (e.g. "es-ES", "es-MX", "de-CH"), so the value of
 * settings.language can be forwarded to `lens:set-layout` unchanged — see
 * GeneralSettings.tsx's changeLanguage() and App.tsx's startup sync. */

// en-US has no overrides in Bazecor either (languages["en-US"] is `undefined`
// there) — the plain US/BASE table in keycodes.ts already matches it.

export const LAYOUT_EN_GB: Record<number, string> = {
  49: "#",
  100: "\\",
};

export const LAYOUT_ES_ES: Record<number, string> = {
  45: "'",
  46: "¡",
  47: "`",
  48: "+",
  49: "Ç",
  51: "Ñ",
  52: "´",
  53: "º",
  54: ",",
  55: ".",
  56: "-",
  100: "<",
};

export const LAYOUT_ES_MX: Record<number, string> = {
  45: "'",
  46: "¿",
  47: "´",
  48: "+",
  49: "}",
  51: "Ñ",
  52: "{",
  53: "|",
  56: "-",
  100: "<",
};

// QWERTZ Y/Z swap (28/29) plus uppercase umlauts/eszett.
export const LAYOUT_DE_DE: Record<number, string> = {
  28: "Z",
  29: "Y",
  45: "ß",
  46: "´",
  47: "Ü",
  48: "+",
  49: "#",
  51: "Ö",
  52: "Ä",
  53: "^",
  54: ",",
  55: ".",
  56: "-",
  100: "<",
};

// Swiss German: same Y/Z swap as de-DE, different punctuation.
export const LAYOUT_DE_CH: Record<number, string> = {
  28: "Z",
  29: "Y",
  45: "'",
  46: "^",
  47: "Ü",
  48: "¨",
  49: "$",
  51: "Ö",
  52: "Ä",
  53: "§",
  56: "-",
  100: "<",
};

// AZERTY corner swap (A/Q and W/Z, codes 4/20/26/29).
export const LAYOUT_FR_FR: Record<number, string> = {
  4: "Q",
  20: "A",
  26: "Z",
  29: "W",
  30: "&",
  31: "é",
  32: '"',
  33: "'",
  34: "(",
  35: "-",
  36: "è",
  37: "_",
  38: "ç",
  39: "à",
  45: ")",
  46: "=",
  47: "^",
  48: "$",
  49: "*",
  51: "M",
  52: "ù",
  53: "²",
  54: ";",
  55: ":",
  56: "!",
  100: "<",
};

export const LAYOUT_DA_DK: Record<number, string> = {
  45: "+",
  46: "´",
  47: "Å",
  48: "¨",
  49: "'",
  51: "Æ",
  52: "Ø",
  53: "½",
  56: "-",
  100: "<",
};

export const LAYOUT_NB_NO: Record<number, string> = {
  45: "+",
  46: "\\",
  47: "Å",
  48: "¨",
  49: "'",
  51: "Ø",
  52: "Æ",
  53: "|",
  56: "-",
  100: "<",
};

export const LAYOUT_SV_SE: Record<number, string> = {
  45: "+",
  46: "´",
  47: "Å",
  48: "¨",
  49: "'",
  51: "Ö",
  52: "Ä",
  53: "§",
  56: "-",
  100: "<",
};

export const LAYOUT_IS_IS: Record<number, string> = {
  45: "Ö",
  46: "-",
  47: "Ð",
  48: "'",
  49: "+",
  51: "Æ",
  52: "´",
  53: "°",
  56: "Þ",
  100: "<",
};

export const LAYOUT_IT_IT: Record<number, string> = {
  45: "'",
  46: "ì",
  47: "è",
  48: "+",
  49: "ù",
  51: "ò",
  52: "à",
  53: "\\",
  54: ",",
  55: ".",
  56: "-",
  100: "<",
};

// Full kana overlay of the QWERTY letter block plus a handful of JIS/IME-only
// keys (135 = ろ, 136 = kana/romaji toggle, 137 = ¥, 138/139 = Henkan/Muhenkan).
// Matches Bazecor's jaJPLetters + the dakuten/handakuten punctuation keys.
export const LAYOUT_JA_JP: Record<number, string> = {
  4: "ち",
  5: "こ",
  6: "そ",
  7: "し",
  8: "い",
  9: "は",
  10: "き",
  11: "く",
  12: "に",
  13: "ま",
  14: "の",
  15: "り",
  16: "も",
  17: "み",
  18: "ら",
  19: "せ",
  20: "た",
  21: "す",
  22: "と",
  23: "か",
  24: "な",
  25: "ひ",
  26: "て",
  27: "さ",
  28: "ん",
  29: "つ",
  30: "ぬ",
  31: "ふ",
  32: "あ",
  33: "う",
  34: "え",
  35: "お",
  36: "や",
  37: "ゆ",
  38: "よ",
  39: "わ",
  45: "ほ",
  46: "へ",
  47: "゛",
  48: "゜",
  49: "む",
  51: "れ",
  52: "け",
  53: "半角/全角 漢字",
  54: "ね",
  55: "る",
  56: "め",
  135: "\\ろ",
  136: "Hiragana",
  137: "¥",
  138: "変換",
  139: "無変換",
};

// Korean is IME-driven (Hangul composition happens in the OS); Bazecor only
// labels the two IME toggle keys, nothing else on the base layer.
export const LAYOUT_KO_KR: Record<number, string> = {
  144: "한/영",
  145: "한자",
};

// Polish and Russian keep plain US labels on the base layer in Bazecor too —
// diacritics (Ą Ć Ę Ł Ń Ó Ś Ź Ż) and Cyrillic both live entirely behind AltGr,
// which Lens doesn't render. Listed explicitly so they read as "checked", not
// missing.
export const LAYOUT_PL_PL: Record<number, string> = {};
export const LAYOUT_RU_RU: Record<number, string> = {};

// EurKey is itself an AltGr-only overlay on top of plain QWERTY — its base
// layer is unmodified US, same reasoning as pl-PL/ru-RU above.
export const LAYOUT_EN_XX_EURKEY: Record<number, string> = {};

export const LAYOUTS: Record<string, Record<number, string>> = {
  "en-GB": LAYOUT_EN_GB,
  "es-ES": LAYOUT_ES_ES,
  "es-MX": LAYOUT_ES_MX,
  "de-DE": LAYOUT_DE_DE,
  "de-CH": LAYOUT_DE_CH,
  "fr-FR": LAYOUT_FR_FR,
  "da-DK": LAYOUT_DA_DK,
  "fi-FI": LAYOUT_SV_SE, // Bazecor itself reuses the Swedish table for Finnish.
  "nb-NO": LAYOUT_NB_NO,
  "sv-SE": LAYOUT_SV_SE,
  "is-IS": LAYOUT_IS_IS,
  "it-IT": LAYOUT_IT_IT,
  "ja-JP": LAYOUT_JA_JP,
  "ko-KR": LAYOUT_KO_KR,
  "pl-PL": LAYOUT_PL_PL,
  "ru-RU": LAYOUT_RU_RU,
  "en-XX-eurkey": LAYOUT_EN_XX_EURKEY,
  // fr-XX-bepo / fr-XX-optimot / fr-XX-ergol are full alternate physical
  // layouts (Bazecor's own base tables for them run to ~1400 lines each) and
  // aren't ported yet — they fall back to plain US labels below rather than
  // silently showing the wrong (AZERTY) layout.
};

export function layoutOverrides(layout: string): Record<number, string> {
  return LAYOUTS[layout] ?? {};
}

/* Shift-row symbol tables: what a plain Shift + digit/punctuation key actually
 * produces on each layout, transcribed from each language's own Bazecor DB
 * shift-modifier table (src/api/keymap/languages/**, the "shiftModifier*"
 * table each file feeds into withModifiers(..., 2048)) — NOT derived from the
 * BASE tables above, since a key's shifted symbol isn't always guessable from
 * its unshifted one (e.g. es-ES Shift+2 is '"', not related to '2' at all). */

export const SHIFT_US: Record<number, string> = {
  30: "!",
  31: "@",
  32: "#",
  33: "$",
  34: "%",
  35: "^",
  36: "&",
  37: "*",
  38: "(",
  39: ")",
  45: "_",
  46: "+",
  47: "{",
  48: "}",
  49: "|",
  51: ":",
  52: '"',
  53: "~",
  54: "<",
  55: ">",
  56: "?",
};

// From src/api/keymap/languages/es/ES.ts's shiftModifierSpanish table.
export const SHIFT_ES_ES: Record<number, string> = {
  31: '"',
  32: "·",
  35: "&",
  36: "/",
  37: "(",
  38: ")",
  39: "=",
  45: "?",
  46: "¿",
  47: "^",
  48: "*",
  49: "Ç",
  51: "Ñ",
  52: "¨",
  53: "ª",
  54: ";",
  55: ":",
  56: "_",
  100: ">",
};

// From src/api/keymap/languages/es/MX.ts's shiftModifierSpanish table — also
// used for Argentina and the rest of Latin America, which Bazecor doesn't
// split out any further (its language picker only offers "es-MX" for all of
// Latin America, same physical layout).
export const SHIFT_ES_MX: Record<number, string> = {
  31: '"',
  32: "#",
  35: "&",
  36: "/",
  37: "(",
  38: ")",
  39: "=",
  45: "?",
  46: "¡",
  47: "¨",
  48: "*",
  49: "]",
  51: "Ñ",
  52: "[",
  53: "°",
  54: ";",
  55: ":",
  56: "_",
  100: ">",
};

const SHIFT_LAYOUTS: Record<string, Record<number, string>> = {
  us: SHIFT_US,
  "en-US": SHIFT_US,
  "es-ES": SHIFT_ES_ES,
  "es-MX": SHIFT_ES_MX,
};

/** Shift-row symbol table for `layout`, or `null` if this layout doesn't have
 * one transcribed yet — callers should fall back to showing the base key +
 * a "S" chip rather than guessing with another layout's symbols (showing the
 * US "@" for Shift+2 on a Spanish board was the actual bug this avoids). */
export function shiftOverrides(layout: string): Record<number, string> | null {
  return SHIFT_LAYOUTS[layout] ?? null;
}
