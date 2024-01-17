/*
 * Here are all available base keycodes (id) used in language files.
 *
 * To create a new keypicker layout start off by copying; en-US (American English) or en-GB (British English)
 * depending on if your keyboard layout is based on ANSI (en-US) or ISO (en-GB).
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
import enUS from "@Renderer/modules/KeyPickerKeyboard/languages/en/US.json";
import enGB from "@Renderer/modules/KeyPickerKeyboard/languages/en/GB.json";
import esES from "@Renderer/modules/KeyPickerKeyboard/languages/es/ES.json";
import deDE from "@Renderer/modules/KeyPickerKeyboard/languages/de/DE.json";
import frFR from "@Renderer/modules/KeyPickerKeyboard/languages/fr/FR.json";
import daDK from "@Renderer/modules/KeyPickerKeyboard/languages/da/DK.json";
import nbNO from "@Renderer/modules/KeyPickerKeyboard/languages/nb/NO.json";
import svSE from "@Renderer/modules/KeyPickerKeyboard/languages/sv/SE.json";

// Dygma - Layouts (official/native)
import isIS from "@Renderer/modules/KeyPickerKeyboard/languages/is/IS.json";
import jaJP from "@Renderer/modules/KeyPickerKeyboard/languages/ja/JP.json";
import koKR from "@Renderer/modules/KeyPickerKeyboard/languages/ko/KR.json";
import deCH from "@Renderer/modules/KeyPickerKeyboard/languages/de/CH.json";

// Dygma - Layouts (community/third-party)
import enXXeurkey from "@Renderer/modules/KeyPickerKeyboard/languages/en/XX-eurkey.json";
import frXXbepo from "@Renderer/modules/KeyPickerKeyboard/languages/fr/XX-bepo.json";
import frXXoptimot from "@Renderer/modules/KeyPickerKeyboard/languages/fr/XX-optimot.json";

const languages = {
  // Keycaps
  "en-US": enUS,
  "en-GB": enGB,
  "es-ES": esES,
  "de-DE": deDE,
  "fr-FR": frFR,
  "da-DK": daDK,
  "fi-FI": svSE,
  "nb-NO": nbNO,
  "sv-SE": svSE,
  // Official
  "is-IS": isIS,
  "ja-JP": jaJP,
  "ko-KR": koKR,
  "de-CH": deCH,
  // Community
  "en-XX-eurkey": enXXeurkey,
  "fr-XX-bepo": frXXbepo,
  "fr-XX-optimot": frXXoptimot,
};

/**
 * Is a JavaScript function that changes key picker layout
 * @param {string} selectedlanguage Selected language
 */
function getLanguage(selectedlanguage) {
  if (selectedlanguage !== "") {
    if (languages[selectedlanguage] !== undefined) {
      return languages[selectedlanguage];
    }
  }

  return enUS;
}

export default getLanguage;
