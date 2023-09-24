/**
 * You can find a list of keyboard identifiers languages on Microsoft website:
 * https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-input-locales-for-windows-language-packs?view=windows-11
 *
 * Or by using "Keyboard Layout Info" website, where you should look for KLID.
 * https://kbdlayout.info
 *
 * In case your keyboard layout aren't an officall language e.g. EurKEY you
 * select the keyboard language that it's based off (en), add a seperator (-),
 * add XX (en-XX) to indicate all regions, add a seperator (-), and append
 * the layouts name, in lowercase, resulting with;
 * "en-XX-eurkey"
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

// Dygma - Layouts (official/native)
import isIS from "@Assets/flags/isIS.png";
import jaJP from "@Assets/flags/jaJP.png";
import koKR from "@Assets/flags/koKR.png";
import deCH from "@Assets/flags/deCH.png";

// Dygma - Layouts (community/third-party)
import enXXeurkey from "@Assets/flags/enXXeurkey.png";

// !!!
// Sorting order below is based off display language (languageNames).
// !!!

const flags = [
  daDK,
  enUS,
  enGB,
  enXXeurkey,
  fiFI,
  frFR,
  frFR, // BÉPO (French)
  deDE,
  isIS,
  jaJP,
  koKR,
  nbNO,
  esES,
  svSE,
  deCH,
];

const languages = [
  "da-DK",
  "en-US",
  "en-GB",
  "en-XX-eurkey",
  "fi-FI",
  "fr-FR",
  "fr-XX-bepo",
  "de-DE",
  "is-IS",
  "ja-JP",
  "ko-KR",
  "nb-NO",
  "es-ES",
  "sv-SE",
  "de-CH",
];

const languageNames = [
  "Danish",
  "English (US)",
  "English (GB)",
  "EurKEY (1.3)",
  "Finnish",
  "French",
  "French (BÉPO)",
  "German",
  "Icelandic",
  "Japanese",
  "Korean",
  "Norwegian",
  "Spanish",
  "Swedish",
  "Swiss German",
];

export {flags, languages, languageNames};
