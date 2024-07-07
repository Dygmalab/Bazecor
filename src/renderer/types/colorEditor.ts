/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { CSSProperties } from "react";
import { PaletteType } from "./layout";

export interface ColorEditorProps {
  colors: PaletteType[];
  disabled: boolean;
  onColorSelect: (colorIndex: number) => void;
  colorButtonIsSelected: boolean;
  onColorPick: (colorIndex: number, r: number, g: number, b: number) => void;
  selected: number;
  isColorButtonSelected: boolean;
  onColorButtonSelect: (action: string, colorIndex: number) => void;
  toChangeAllKeysColor: (colorIndex: number, start: number, end: number) => void;
  deviceName: string;
  clearLayer?: (fillKeyCode?: number, chooseYourKeyboardSide?: string) => void;
  changeUnderglowColor?: (colorIndex?: number, chooseYourKeyboardSide?: string) => void;
  changeKeyColor?: (colorIndex?: number, chooseYourKeyboardSide?: string) => void;
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
