export type KeymapCodeType = number;

export type KeymapCodeTableType = {
  code: KeymapCodeType;
  labels: {
    primary: string | JSX.Element;
    top?: string | JSX.Element | undefined;
    verbose?: string | JSX.Element | undefined;
  };
  alt?: boolean;
  newGroupName?: string;
};

export type BaseKeycodeTableType = {
  keys: KeymapCodeTableType[];
  groupName: string;
};

export type LanguageType =
  | "en-US"
  | "en-GB"
  | "es-ES"
  | "es-MX"
  | "de-DE"
  | "fr-FR"
  | "da-DK"
  | "fi-FI"
  | "nb-NO"
  | "sv-SE"
  | "is-IS"
  | "ja-JP"
  | "ko-KR"
  | "pl-PL"
  | "de-CH"
  | "en-XX-eurkey"
  | "fr-XX-bepo"
  | "fr-XX-optimot"
  | "fr-XX-ergol";
