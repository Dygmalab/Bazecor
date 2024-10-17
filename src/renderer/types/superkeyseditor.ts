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
import { KeymapType } from "./layout";
import { MacrosType } from "./macros";
import { Neuron } from "./neurons";
import { SuperkeysType } from "./superkeys";

export interface SuperkeysEditorProps {
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  setLoading: (lding: boolean) => void;
  saveButtonRef?: React.RefObject<HTMLButtonElement>;
  discardChangesButtonRef?: React.RefObject<HTMLButtonElement>;
}

export interface SuperkeysEditorInitialStateType {
  keymap: KeymapType;
  macros: MacrosType[];
  superkeys: SuperkeysType[];
  storedMacros: MacrosType[];
  neurons: Neuron[];
  neuronID: string;
  kbtype: string;
  maxSuperKeys: number;
  modified: boolean;
  modifiedKeymap: boolean;
  selectedSuper: number;
  selectedAction: number;
  showDeleteModal: boolean;
  listToDelete: ListToDeleteSKType[];
  futureSK: SuperkeysType[];
  futureSSK: number;
  currentLanguageLayout: string;

  showStandardView: boolean;
  loading: boolean;
}

export interface ListToDeleteSKType {
  superIdx: number;
  newKey: number;
  layer: number;
  pos: number;
}
