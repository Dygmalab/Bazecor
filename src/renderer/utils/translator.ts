/**
 * A mapping of language codes to the format used by Bazecor.
 * It normalizes different language variations (e.g., 'en', 'en-GB') to a specific locale ('en-US', 'en-GB').
 * @type {{ [key: string]: string }}
 */
const translator: { [key: string]: string } = {
  da: "da-DK",
  "da-DK": "da-DK",
  de: "de-DE",
  "de-CH": "de-CH",
  "de-DE": "de-DE",
  en: "en-US",
  "en-GB": "en-GB",
  "en-US": "en-US",
  es: "es-ES",
  "es-ES": "es-ES",
  fi: "fi-FI",
  "fi-FI": "fi-FI",
  fr: "fr-FR",
  "fr-FR": "fr-FR",
  is: "is-IS",
  "is-IS": "is-IS",
  ja: "ja-JP",
  "ja-JP": "ja-JP",
  ko: "ko-KR",
  "ko-KR": "ko-KR",
  nb: "nb-NO",
  "nb-NO": "nb-NO",
  sv: "sv-SE",
  "sv-SE": "sv-SE",
};

/**
 * Converts an OS-level language code to the format used by Bazecor, with a fallback to a default language.
 * It first tries a direct match, then a match on the primary language subtag (e.g., 'en' from 'en-GB'),
 * and finally falls back to the default language if no match is found.
 *
 * @param {string} localLanguage The language code from the operating system or user settings.
 * @param {string} [defaultLanguage="en-US"] The default language to use if the local language is not supported.
 * @returns {string} The corresponding Bazecor language code.
 */
function getTranslator(localLanguage: string, defaultLanguage = "en-US"): string {
  const language = localLanguage || defaultLanguage;

  if (translator[language] !== undefined) {
    return translator[language];
  }

  if (translator[language.split("-")[0]] !== undefined) {
    return translator[language.split("-")[0]];
  }

  return defaultLanguage;
}

export default getTranslator;
