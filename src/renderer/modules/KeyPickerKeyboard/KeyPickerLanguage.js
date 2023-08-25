// Dygma - Layouts (keycaps)
import enUS from "@Renderer/modules/KeyPickerKeyboard/languages/en/US.json";
import enGB from "@Renderer/modules/KeyPickerKeyboard/languages/en/GB.json";
import esES from "@Renderer/modules/KeyPickerKeyboard/languages/es/ES.json";
import deDE from "@Renderer/modules/KeyPickerKeyboard/languages/de/DE.json";
import frFR from "@Renderer/modules/KeyPickerKeyboard/languages/fr/FR.json";
import daDK from "@Renderer/modules/KeyPickerKeyboard/languages/da/DK.json";
import noNO from "@Renderer/modules/KeyPickerKeyboard/languages/no/NO.json";
import svSE from "@Renderer/modules/KeyPickerKeyboard/languages/sv/SE.json";

// Dygma - Layouts
import isIS from "@Renderer/modules/KeyPickerKeyboard/languages/is/IS.json";
import jaJP from "@Renderer/modules/KeyPickerKeyboard/languages/ja/JP.json"
import koKR from "@Renderer/modules/KeyPickerKeyboard/languages/ko/KR.json";
import gswCH from "@Renderer/modules/KeyPickerKeyboard/languages/gsw/CH.json";
import xxEU from "@Renderer/modules/KeyPickerKeyboard/languages/xx/EU.json";

const languages = {
  "en-US": enUS,
  "en-GB": enGB,
  "es-ES": esES,
  "de-DE": deDE,
  "fr-FR": frFR,
  "sv-SE": svSE,
  "fi-FI": svSE,
  "da-DK": daDK,
  "no-NO": noNO,
  "is-IS": isIS,
  "ja-JP": jaJP,
  "gsw-CH": gswCH,
  "ko-KR": koKR,
  "xx-EU": xxEU,
}

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
