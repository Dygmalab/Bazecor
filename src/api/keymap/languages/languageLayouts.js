// Dygma - Layouts (keycaps)
import esES, { esESModifiedTables } from "./es/ES";
import deDE, { deDEModifiedTables } from "./de/DE";
import frFR, { frFRModifiedTables } from "./fr/FR";
import daDK, { daDKModifiedTables } from "./da/DK";
import noNO, { noNOModifiedTables } from "./no/NO";
import svSE, { svSEModifiedTables } from "./sv/SE";

// Dygma - Layouts
import isIS, { isISModifiedTables } from "./is/IS";
import jaJP, { jaJPModifiedTables } from "./ja/JP";
import koKR, { koKRModifiedTables } from "./ko/KR";
import gswCH, { gswCHModifiedTables } from "./gsw/CH";
import xxEU, { xxEUModifiedTables } from "./xx/EU";

const supportModifiedTables = {
  "es-ES": esESModifiedTables,
  "de-DE": deDEModifiedTables,
  "fr-FR": frFRModifiedTables,
  "no-NO": noNOModifiedTables,
  "sv-SE": svSEModifiedTables,
  "da-DK": daDKModifiedTables,
  "is-IS": isISModifiedTables,
  "ja-JP": jaJPModifiedTables,
  "ko-KR": koKRModifiedTables,
  "gsw-CH": gswCHModifiedTables,
  "xx-EU": xxEUModifiedTables,
};

const languages = {
  "en-US": "en-US",
  "es-ES": esES,
  "de-DE": deDE,
  "fr-FR": frFR,
  "no-NO": noNO,
  "sv-SE": svSE,
  "da-DK": daDK,
  "is-IS": isIS,
  "ja-JP": jaJP,
  "ko-KR": koKR,
  "gsw-CH": gswCH,
  "xx-EU": xxEU,
};

export { languages as default, supportModifiedTables };
