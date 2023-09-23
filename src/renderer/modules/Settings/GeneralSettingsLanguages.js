/**
 * You can find a list of keyboard identifiers languages on Microsoft website:
 * https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-input-locales-for-windows-language-packs?view=windows-11
 *
 * Or by using "Keyboard Layout Info" website, where you should look for KLID.
 * https://kbdlayout.info
 *
 * In case your keyboard layout aren't an officall language e.g. EurKEY you
 * select the keyboard language that it's based off (en-US), add a seperator (-)
 * and add the layouts name, in lowercase, resulting with;
 * "en-US-eurkey"
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
import enUSeurkey from "@Assets/flags/enUSeurkey.png";

// !!!
// Sorting order in this file is based off display language (languageNames)
// rather than natural sorting order of (A-Z) in their respective category.
// !!!

const flags = [
  // Keycaps
  enUS,
  enGB,
  esES,
  deDE,
  frFR,
  daDK,
  fiFI,
  nbNO,
  svSE,
  // Official
  isIS,
  jaJP,
  koKR,
  deCH,
  // Community
  frFR, // BÉPO (French)
  enUSeurkey,
];

const languages = [
  // Keycaps
  "en-US",
  "en-GB",
  "es-ES",
  "de-DE",
  "fr-FR",
  "da-DK",
  "fi-FI",
  "nb-NO",
  "sv-SE",
  // Official
  "is-IS",
  "ja-JP",
  "ko-KR",
  "de-CH",
  // Community
  "fr-FR-bepo",
  "en-US-eurkey",
];

const languageNames = [
  // Keycaps
  "English (US)",
  "English (GB)",
  "Spanish",
  "German",
  "French",
  "Danish",
  "Finnish",
  "Norwegian",
  "Swedish",
  // Official
  "Icelandic",
  "Japanese",
  "Korean",
  "Swiss German",
  // Community
  "BÉPO (French)",
  "EurKEY (1.3)",
];

export {flags, languages, languageNames};
