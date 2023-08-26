const legacyLanguage = {
  english: "en-US",
  spanish: "es-ES",
  german: "de-DE",
  french: "fr-FR",
  swedish: "sv-SE",
  finnish: "fi-FI",
  danish: "da-DK",
  norwegian: "no-NO",
  icelandic: "is-IS",
  japanese: "ja-JP",
  korean: "ko-KR",
  swissGerman: "gsw-CH",
  eurkey: "xx-EU",
};

/**
 * Helper function to convert legacy languages stored in config.js
 * @param {string} storedLanguage Stored language
 * @param {string} defaultLanguage Default language
 */
function getLanguage(storedLanguage, defaultLanguage = "en-US") {
  let language = storedLanguage || defaultLanguage;

  if (legacyLanguage[language] !== undefined) {
    return legacyLanguage[language];
  }

  return language;
}

export default getLanguage;
