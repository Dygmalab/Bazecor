export interface KeyProps {
  id: string;
  keyCode: KeyCodeProps;
  x: number;
  y: number;
  selected: boolean;
  clicked: () => void;
  onKeyPress: () => void;
  centered: boolean;
  iconpresent: boolean;
  icon?: React.ReactNode;
  iconsize?: number | undefined;
  iconx?: number | undefined;
  icony?: number | undefined;
  content: KeyContentProps;
  idArray?: Array<number> | undefined;
  disabled?: boolean;
}

export interface KeyCodeProps {
  base?: number | undefined;
  modified: undefined | boolean;
}

export interface KeyContentProps {
  type: string;
  first: string;
  second: string;
  third: string;
  fourth: string;
}

interface KslTextIndexProps {
  x?: number | undefined;
  y?: number | undefined;
  w?: number | undefined;
  h?: number | undefined;
  dx?: number | undefined;
  ddx?: number | undefined;
  dy?: number | undefined;
  ddy?: number | undefined;
  fs?: number | undefined;
  fss?: number | undefined;
}

interface KslTextProps {
  outb: KslTextIndexProps;
  out: KslTextIndexProps;
  icon: KslTextIndexProps;
  text: {
    a: KslTextIndexProps;
    b: KslTextIndexProps;
    c: KslTextIndexProps;
    d: KslTextIndexProps;
    letter: KslTextIndexProps;
  };
}
export interface KslProps {
  "1UT": KslTextProps;
  "2UT": KslTextProps;
  "1US": KslTextProps;
  specialBlockDropdown: KslTextProps;
  genericBlockDropdown: KslTextProps;
  specialBlockT: KslTextProps;
  specialBlockT2: KslTextProps;
  "1U": KslTextProps;
  "1U2": KslTextProps;
  "1U5": KslTextProps;
  "1U6": KslTextProps;
  "1U8": KslTextProps;
  "2U": KslTextProps;
  "2U2": KslTextProps;
  "3U": KslTextProps;
  "6U2": KslTextProps;
  block: KslTextProps;
  specialBlock: KslTextProps;
  longBlock: KslTextProps;
  wideBlock: KslTextProps;
  enter: KslTextProps;
  title: KslTextProps;
}
