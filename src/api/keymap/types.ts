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
