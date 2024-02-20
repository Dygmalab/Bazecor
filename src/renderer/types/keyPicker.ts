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

import { MacrosType } from "@Renderer/types/macros";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { SegmentedKeyType } from "@Renderer/types/layout";

export interface PickerProps {
  action: number;
  actions: number[];
  onKeySelect: (keyCode: number) => void;
  activeTab: string;
  selectedlanguage: string;
  kbtype: string;
  baseCode: number;
  modCode: number;
  disable: boolean;
  macros: MacrosType[];
  superkeys: SuperkeysType[];
  keyCode: SegmentedKeyType;
  isWireless: boolean;
}
