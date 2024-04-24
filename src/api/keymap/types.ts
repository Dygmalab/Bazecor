export type KeymapCodeType = number;

export const NOKEY_KEY_CODE = 0;
export const TRANS_KEY_CODE = 65535;

export type KeymapCodeTableType = {
  code: KeymapCodeType;
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
  | "fr-XX-optimot"
  | "fr-XX-ergol";
