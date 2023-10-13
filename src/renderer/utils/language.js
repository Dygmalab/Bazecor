// Do NOT modify this object - languages available in 1.3.4 and before
const legacyLanguage = {
  english: "en-US",
  british: "en-GB",
  spanish: "es-ES",
  german: "de-DE",
  french: "fr-FR",
  frenchBepo: "fr-XX-bepo",
  swedish: "sv-SE",
  finnish: "fi-FI",
  danish: "da-DK",
  norwegian: "nb-NO",
  icelandic: "is-IS",
  japanese: "ja-JP",
  korean: "ko-KR",
  swissGerman: "de-CH",
  eurkey: "en-XX-eurkey",
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
