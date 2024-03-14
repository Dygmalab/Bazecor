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

import { LanguageType } from "src/api/keymap/types";
import { KeyType, KeymapType } from "./layout";
import { MacroActionsType, MacrosType } from "./macros";
import { Neuron } from "./neurons";
import { SuperkeysType } from "./superkeys";

export interface MacroEditorProps {
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  setLoading: (lding: boolean) => void;
}

export interface MacroEditorInitialStateType {
  keymap: KeymapType;
  macros: MacrosType[];
  superkeys: SuperkeysType[];
  storedMacros: MacrosType[];
  neurons: Neuron[];
  neuronIdx: number;
  maxMacros: number;
  modified: boolean;
  selectedMacro: number;
  showDeleteModal: boolean;
  listToDelete: ListToDeleteType[];
  listToDeleteS: ListToDeleteSType[];
  listToDeleteM: ListToDeleteMType[];
  selectedList: number;
  usedMemory: number;
  totalMemory: number;
  macrosEraser: string;
  loading: boolean;
  currentLanguageLayout: LanguageType;
  kbtype: string;
  scrollPos: number;
}

export interface ListToDeleteType {
  key: KeyType;
  newKey: number;
  layer: number;
  pos: number;
}

export interface ListToDeleteSType {
  action: number;
  newKey: number;
  superIdx: number;
  pos: number;
}

export interface ListToDeleteMType {
  actions: MacroActionsType[];
  newKey: number;
  macroIdx: number;
  pos: number;
}
