const keyboardTypeMap: { [locale: string]: "ANSI" | "ISO" } = {
  "da-DK": "ISO",
  "en-US": "ANSI",
  "en-GB": "ISO",
  "en-XX-eurkey": "ANSI",
  "fi-FI": "ISO",
  "fr-FR": "ISO",
  "fr-XX-bepo": "ISO",
  "fr-XX-optimot": "ISO",
  "fr-XX-ergol": "ISO",
  "de-DE": "ISO",
  "is-IS": "ISO",
  "ja-JP": "ISO",
  "ko-KR": "ANSI",
  "nb-NO": "ISO",
  "pl-PL": "ANSI",
  "es-ES": "ISO",
  "es-MX": "ISO",
  "sv-SE": "ISO",
  "de-CH": "ISO",
  // Add other mappings as needed
};

// Custom hook to determine keyboard type based on locale
export const getKeyboardLayout = (locale: string): "ANSI" | "ISO" | "Unknown" => keyboardTypeMap[locale] || "Unknown";
