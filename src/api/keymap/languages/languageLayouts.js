/*
 * Here are all available base keycodes (code) used in language files, normally you just replace alphas and symbols.
 * Other keycodes are here for reference only and should NOT be replaced (numpad 99 is an exception).
 *
 * How to replace 53 or ` on an en-GB (British English) keyboard:
 * In it's base configuration without you pressing any modifier (ctrl, alt, shift...) you reference it
 * simply by using it's base code of 53. When using a modifier; it can cause a lot of headache.
 *
 * Base: 53 (0 + 53)
 * Control: 309 (256 + 53)
 * Alt: 565 (512 + 53)
 * AltGr: 1077 (1024 + 53)
 * Shift: 2101 (2048 + 53)
 * OS: 4149 (4096 + 53)
 *
 * So where did 1024 and 2048 come from? Normally a keyboard have 256 keycodes and to be able to use
 * modifiers; they reside on a different base (layer), and that value depends on the number of possible
 * combinations you can use with said modifier(s).
 *
 * At the end of all language files you can see what possible combinations of modifiers you can use.
 * The number at the end of each function is the base (layer) value of said modifier(s), you need
 * to append that to your keycode.
 *
 * const enGBCtrlTable = withModifiers(table, "Control +", "C+", 256);
 * const enGBLAltTable = withModifiers(table, "Alt +", "A+", 512);
 * const enGBRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
 * const enGBShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
 * const enGBGuiTable = withModifiers(table, "Os+", "O+", 4096);
 *
 * (... more modifiers ...)
 *
 * ANSI
 * .------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬--------.
 * |  53  |  30  |  31  |  32  |  33  |  34  |  35  |  36  |  37  |  38  |  39  |  45  |  46  |   42   |
 * |------┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬------|
 * |  43    |  20  |  26  |  8   |  21  |  23  |  28  |  24  |  12  |  18  |  19  |  47  |  48  |  49  |
 * |--------┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴------|
 * |   57     |  4   |  22  |  7   |  9   |  10  |  11  |  13  |  14  |  15  |  51  |  52  |    40     |
 * |----------┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴-----------|
 * |      225     |  29  |  27  |  6   |  25  |  5   |  17  |  16  |  54  |  55  |  56  |     229      |
 * |-------┬------┴┬-----┴-┬----┴------┴------┴------┴------┴------┴---┬--┴----┬-┴-----┬┴------┬-------|
 * |  224  |  227  |  226  |                     44                    |  230  |  231  |  101  |  228  |
 * '-------┴-------┴-------┴-------------------------------------------┴-------┴-------┴-------┴-------'
 *
 * ISO
 * .------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬------┬--------.
 * |  53  |  30  |  31  |  32  |  33  |  34  |  35  |  36  |  37  |  38  |  39  |  45  |  46  |   42   |
 * |------┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬------|
 * |  43    |  20  |  26  |  8   |  21  |  23  |  28  |  24  |  12  |  18  |  19  |  47  |  48  |  40  |
 * |--------┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┬----┴-┐    |
 * |   57     |  4   |  22  |  7   |  9   |  10  |  11  |  13  |  14  |  15  |  51  |  52  |  49  |    |
 * |-------┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴---┬--┴------┴----|
 * |  225  |  100 |  29  |  27  |  6   |  25  |  5   |  17  |  16  |  54  |  55  |  56  |     229      |
 * |-------+------┴┬-----┴-┬----┴------┴------┴------┴------┴------┴---┬--┴----┬-┴-----┬┴------┬-------|
 * |  224  |  227  |  226  |                     44                    |  230  |  231  |  101  |  228  |
 * '-------┴-------┴-------┴-------------------------------------------┴-------┴-------┴-------┴-------'
 *
 * ESC / Function
 * .------.   .------┬------┬------┬------.   .------┬------┬------┬------.   .------┬------┬------┬------.
 * |  41  |   |  58  |  59  |  60  |  61  |   |  62  |  63  |  64  |  65  |   |  66  |  67  |  68  |  69  |
 * '------'   '------┴------┴------┴------'   '------┴------┴------┴------'   '------┴------┴------┴------'
 *
 *  Cursor and screen / Numpad
 * .------┬------┬------.   .------┬------┬------┬------.
 * |  70  |  71  |  72  |   |  83  |  84  |  85  |  86  |
 * |------+------+------|   |------+------+------+------|
 * |  73  |  74  |  75  |   |  95  |  96  |  97  |      |
 * |------+------+------|   |------+------+------┤  87  |
 * |  76  |  77  |  78  |   |  92  |  93  |  94  |      |
 * '------+------+------'   |------+------+------+------|
 *        |  82  |          |  89  |  90  |  91  |      |
 * .------+------+------.   |------┴------+------┤  88  |
 * |  80  |  81  |  79  |   |     98      |  99  |      |
 * '------┴------┴------'   '-------------┴------┴------'
 */

// Dygma - Layouts (keycaps)
import enGB, { enGBModifiedTables } from "./en/GB";
import esES, { esESModifiedTables } from "./es/ES";
import deDE, { deDEModifiedTables } from "./de/DE";
import frFR, { frFRModifiedTables } from "./fr/FR";
import daDK, { daDKModifiedTables } from "./da/DK";
import nbNO, { nbNOModifiedTables } from "./nb/NO";
import svSE, { svSEModifiedTables } from "./sv/SE";

// Dygma - Layouts
import isIS, { isISModifiedTables } from "./is/IS";
import jaJP, { jaJPModifiedTables } from "./ja/JP";
import koKR, { koKRModifiedTables } from "./ko/KR";
import deCH, { deCHModifiedTables } from "./de/CH";
import enEU, { enEUModifiedTables } from "./en/EU";

const supportModifiedTables = {
  "en-GB": enGBModifiedTables,
  "es-ES": esESModifiedTables,
  "de-DE": deDEModifiedTables,
  "fr-FR": frFRModifiedTables,
  "da-DK": daDKModifiedTables,
  "fi-FI": svSEModifiedTables,
  "nb-NO": nbNOModifiedTables,
  "sv-SE": svSEModifiedTables,
  "is-IS": isISModifiedTables,
  "ja-JP": jaJPModifiedTables,
  "ko-KR": koKRModifiedTables,
  "de-CH": deCHModifiedTables,
  "en-EU": enEUModifiedTables,
};

const languages = {
  "en-US": "en-US",
  "en-GB": enGB,
  "es-ES": esES,
  "de-DE": deDE,
  "fr-FR": frFR,
  "da-DK": daDK,
  "fi-FI": svSE,
  "nb-NO": nbNO,
  "sv-SE": svSE,
  "is-IS": isIS,
  "ja-JP": jaJP,
  "ko-KR": koKR,
  "de-CH": deCH,
  "en-EU": enEU,
};

export { languages as default, supportModifiedTables };
