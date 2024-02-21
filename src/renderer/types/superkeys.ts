/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
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

import { MacrosType } from "./macros";
import { KeymapDB } from "../../api/keymap";

export interface SuperkeysType {
  actions: number[];
  name: string;
  id: number;
}

export interface SuperKeyActionsProps {
  isStandardViewSuperkeys: boolean;
  superkeys: SuperkeysType[];
  selected: number;
  selectedAction: number;
  macros: MacrosType[];
  updateAction: (actionNumber: number, newAction: unknown) => void;
  changeAction: (id: number) => void;
  keymapDB: KeymapDB;
}

export interface SuperkeyPickerProps {
  isStandardViewSuperkeys: boolean;
  superkeys: SuperkeysType[];
  selected: number;
  macros: MacrosType[];
  updateAction: (actionNumber: number, newAction: unknown) => void;
  keymapDB: KeymapDB;
  onClick: (id: number) => void;
  index: number;
  icon: JSX.Element;
  title: string;
  description: string;
  elementActive: boolean;
}
