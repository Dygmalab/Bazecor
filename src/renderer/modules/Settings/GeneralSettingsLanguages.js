/**
 * Please use The Unicode Consortium Langugage-Territory Information database
 * for finding your unique language and territory code.
 * http://www.unicode.org/cldr/charts/latest/supplemental/language_territory_information.html
 *
 * | Language | Code | Territory   | Code |
 * | -------- | ---- | ----------- | ---- |
 * | German   | de   | Germany {O} | DE   |
 *
 * After you have found your unique language and territory code you will need
 * to combine them. Start with language code (de), add a separator (-) and at
 * last your territory code (DE); "de-DE".
 *
 * In case your keyboard layout aren't an officall language e.g. EurKEY you
 * select the language code that it's based off (en), add a seperator (-) and
 * you create a custom territory code that matches the given name of the
 * layout (EU); "en-EU".
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
import noNO from "@Assets/flags/noNO.png";
import svSE from "@Assets/flags/svSE.png";

// Dygma - Layouts
import isIS from "@Assets/flags/isIS.png";
import jaJP from "@Assets/flags/jaJP.png";
import koKR from "@Assets/flags/koKR.png";
import gswCH from "@Assets/flags/gswCH.png";
import xxEU from "@Assets/flags/xxEU.png";

const flags = [
  enUS,
  enGB,
  esES,
  deDE,
  frFR,
  daDK,
  fiFI,
  noNO,
  svSE,
  isIS,
  jaJP,
  koKR,
  gswCH,
  xxEU,
];

const languages = [
  "en-US",
  "en-GB",
  "es-ES",
  "de-DE",
  "fr-FR",
  "da-DK",
  "fi-FI",
  "no-NO",
  "sv-SE",
  "is-IS",
  "ja-JP",
  "ko-KR",
  "gsw-CH",
  "xx-EU",
];

const languageNames = [
  "English (US)",
  "English (UK)",
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
