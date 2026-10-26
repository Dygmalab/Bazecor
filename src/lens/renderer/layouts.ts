/* Per-language key labels for the Lens overlay, read straight from Bazecor's
 * own keymap DB (src/api/keymap/languages/**) instead of being transcribed
 * here: the overlay can't drift from the Layout Editor, and every language
 * Bazecor's picker offers — including any added later — works in Lens with no
 * changes on this side.
 *
 * Layout ids are Bazecor's own language tags (KeyPickerLanguage.ts's
 * LangOptions: "es-ES", "de-CH", "fr-XX-bepo", …), so settings.language is
 * forwarded to `lens:set-layout` unchanged — see GeneralSettings.tsx's
 * changeLanguage() and App.tsx's startup sync. An id Bazecor doesn't know
 * (including Lens's own "us" default) resolves like en-US, as it does in
 * KeymapDB. */

import { languagesDB, supportModifiedTables } from "../../api/keymap/languages/languageLayouts";
import { ModifiedDigitTables } from "../../api/keymap/db/digits";
import { ModifiedPunctuationTables } from "../../api/keymap/db/punctuation";
import type { BaseKeycodeTableType, KeymapCodeTableType } from "../../api/keymap/types";

// Plain HID keycodes; anything at or above this is a modifier combo or one of
// the named ranges (layers, macros, …) that languages never relabel.
const BASE_CODE_LIMIT = 256;

const modifiedTablesDB = supportModifiedTables as Record<string, BaseKeycodeTableType[]>;

function labelsOf(keys: KeymapCodeTableType[], accept: (key: KeymapCodeTableType) => boolean): Record<number, string> {
  return Object.fromEntries(
    keys.flatMap(key => {
      const { primary } = key.labels;
      // Labels can be JSX in Bazecor's DB; Lens draws text only, so those keep
      // their default label.
      return accept(key) && typeof primary === "string" ? [[key.code, primary]] : [];
    }),
  );
}

const layoutCache = new Map<string, Record<number, string>>();

/** Base-layer labels `layout` changes, keyed by HID keycode: the same
 * `languagesDB[layout]` array KeymapDB's newLanguageLayout() swaps into its
 * default tables. en-US has none (its entry is `undefined` in Bazecor too) — the
 * plain US BASE table in keycodes.ts already matches it. */
export function layoutOverrides(layout: string): Record<number, string> {
  let overrides = layoutCache.get(layout);
  if (!overrides) {
    overrides = labelsOf(languagesDB[layout] ?? [], key => key.code < BASE_CODE_LIMIT);
    layoutCache.set(layout, overrides);
  }
  return overrides;
}

/** Characters that modifier combos produce on a layout, keyed by the full
 * keycode (modifier bits included): Shift+2 (2079) → '"' on es-ES, AltGr+E
 * (1032) and its Ctrl+Alt twin (776) → "€", and so on.
 *
 * Bazecor flags every such entry `alt: true` — the default Shifted Digits/
 * Punctuation tables (US symbols) and each language's shiftModifier*, altGr*
 * and altCtrl* tables — and its key picker shows them bare, with no "S+" or
 * "AGr+" tag. The generic withModifiers() tables never set it; those combos
 * really are shortcuts, and keep showing as the base key + modifier chips. */
export type SymbolOverrides = Record<number, string>;

const symbolCache = new Map<string, SymbolOverrides>();

const isSymbol = (key: KeymapCodeTableType) => key.alt === true;

/** Built in the order KeymapDB fills its own lookup — defaults first, then the
 * language's tables, last write wins — so a key a language doesn't redefine
 * falls through to the US symbol exactly as it does in Bazecor (es-ES Shift+1 is
 * "!" only because the Spanish table leaves it to the default). */
export function symbolOverrides(layout: string): SymbolOverrides {
  let symbols = symbolCache.get(layout);
  if (!symbols) {
    const tables = [...ModifiedDigitTables, ...ModifiedPunctuationTables, ...(modifiedTablesDB[layout] ?? [])];
    symbols = Object.assign({}, ...tables.map(table => labelsOf(table.keys, isSymbol))) as SymbolOverrides;
    symbolCache.set(layout, symbols);
  }
  return symbols;
}
