import { CSSProperties } from "react";
import { PaletteType } from "./layout";

export interface ColorEditorProps {
  colors: PaletteType[];
  disabled: boolean;
  onColorSelect: (colorIndex: number) => void;
  colorButtonIsSelected: boolean;
  onColorPick: (colorIndex: number, r: number, g: number, b: number) => void;
  colorsInUse: boolean[];
  selected: number;
  isColorButtonSelected: boolean;
  onColorButtonSelect: (action: string, colorIndex: number) => void;
  toChangeAllKeysColor: (colorIndex: number, start: number, end: number) => void;
  deviceName: string;
}

export interface ColorPickerProps {
  menuKey: string;
  id: number;
  onClick: (e: unknown) => void;
  dataID: string;
  selected: number;
  buttonStyle: CSSProperties;
  className: string;
}
