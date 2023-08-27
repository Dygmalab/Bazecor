/**
 * You can find a list of keyboard identifiers languages on Microsoft website:
 * https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-input-locales-for-windows-language-packs?view=windows-11
 *
 * Or by using "Keyboard Layout Info" website, where you should look for KLID.
 * https://kbdlayout.info
 *
 * In case your keyboard layout aren't an officall language e.g. EurKEY you
 * select the language code that it's based off (en), add a seperator (-) and
 * you create a custom code that matches the given name of the layout (EU);
 * "en-EU"
 *
 * All flags MUST be a circle with the dimensions of 512x512 pixels, you can
 * find all offical language flags on https://flagpedia.net/download/vector.
 *
 * You can always request help from Dygma or our community, in case you need
 * help with adding your language to Bazecor or creating graphics (flags).
 */

// Dygma - Layouts (keycaps)
import enUS from "@Assets/flags/enUS.png";
import enGB from "@Assets/flags/enGB.png";
import esES from "@Assets/flags/esES.png";
import deDE from "@Assets/flags/deDE.png";
import frFR from "@Assets/flags/frFR.png";
import daDK from "@Assets/flags/daDK.png";
import fiFI from "@Assets/flags/fiFI.png";
import nbNO from "@Assets/flags/nbNO.png";
import svSE from "@Assets/flags/svSE.png";

// Dygma - Layouts
import isIS from "@Assets/flags/isIS.png";
import jaJP from "@Assets/flags/jaJP.png";
import koKR from "@Assets/flags/koKR.png";
import deCH from "@Assets/flags/deCH.png";
import enEU from "@Assets/flags/enEU.png";

const flags = [
  enUS,
  enGB,
  esES,
  deDE,
  frFR,
  daDK,
  fiFI,
  nbNO,
  svSE,
  isIS,
  jaJP,
  koKR,
  deCH,
  enEU,
];

const languages = [
  "en-US",
  "en-GB",
  "es-ES",
  "de-DE",
  "fr-FR",
  "da-DK",
  "fi-FI",
  "nb-NO",
  "sv-SE",
  "is-IS",
  "ja-JP",
  "ko-KR",
  "de-CH",
  "en-EU",
];

const languageNames = [
  "English (US)",
  "English (GB)",
  "Spanish",
  "German",
  "French",
  "Danish",
  "Finnish",
  "Norwegian",
  "Swedish",
  "Icelandic",
  "Japanese",
  "Korean",
  "Swiss German",
  "EurKEY (1.3)",
];

export {flags, languages, languageNames};
