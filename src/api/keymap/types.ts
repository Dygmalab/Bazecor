export type KeymapCodeTableType = {
  code: number;
  labels: {
    primary: string | JSX.Element;
    top?: string | undefined;
    verbose?: string | undefined;
  };
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
  | "fr-XX-optimot";
