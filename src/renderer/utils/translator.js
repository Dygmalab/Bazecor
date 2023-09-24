const translator = {
  "da": "da-DK",
  "da-DK": "da-DK",
  "de": "de-DE",
  "de-CH": "de-CH",
  "de-DE": "de-DE",
  "en": "en-US",
  "en-GB": "en-GB",
  "en-US": "en-US",
  "es": "es-ES",
  "es-ES": "es-ES",
  "fi": "fi-FI",
  "fi-FI": "fi-FI",
  "fr": "fr-FR",
  "fr-FR": "fr-FR",
  "is": "is-IS",
  "is-IS": "is-IS",
  "ja": "ja-JP",
  "ja-JP": "ja-JP",
  "ko": "ko-KR",
  "ko-KR": "ko-KR",
  "nb": "nb-NO",
  "nb-NO": "nb-NO",
  "sv": "sv-SE",
  "sv-SE": "sv-SE",
};

/**
 * Helper function to convert os-local to bazecor languages for config.js
 * @param {string} localLanguage Local language
 * @param {string} defaultLanguage Default language
 */
function getTranslator(localLanguage, defaultLanguage = "en-US") {
  let language = localLanguage || defaultLanguage;

  if (translator[language] !== undefined) {
    return translator[language];
  } else if (translator[language.split("-")[0]] !== undefined) {
    return translator[language.split("-")[0]];
  }

  return defaultLanguage;
}

export default getTranslator;
