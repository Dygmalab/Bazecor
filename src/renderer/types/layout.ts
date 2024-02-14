export interface LayoutEditorProps {
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  darkMode: boolean;
  setLoading: (lding: boolean) => void;
  inContext: boolean;
}

export interface KeyType {
  keyCode: number;
  label: string | JSX.Element;
  extraLabel?: string;
  verbose?: string;
}

export interface SegmentedKeyType {
  base: number;
  modified: number;
}

export interface KeymapType {
  custom: KeyType[][];
  default: KeyType[][];
  onlyCustom: boolean;
}

export interface PaletteType {
  r: number;
  g: number;
  b: number;
  rgb: string;
}

export interface ColormapType {
  palette: PaletteType[];
  colorMap: number[][];
}
