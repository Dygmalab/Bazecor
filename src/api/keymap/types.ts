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
