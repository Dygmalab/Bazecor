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

import { Neuron } from "./neurons";
import { WirelessInterface } from "./wireless";

export interface PreferencesProps {
  cancelContext: () => void;
  updateAllowBetas: (checked: boolean) => void;
  allowBeta: boolean;
  connected: boolean;
  startContext: () => void;
  toggleDarkMode: (mode: string) => void;
  toggleBackup: (value: boolean) => void;
  setLoading: (lding: boolean) => void;
}

export interface KBDataPref {
  keymap: {
    custom: Array<number>;
    default: Array<number>;
    onlyCustom: number;
  };
  ledBrightness: number;
  ledBrightnessUG: number;
  defaultLayer: number;
  ledIdleTimeLimit: number;
  qukeysHoldTimeout: number;
  qukeysOverlapThreshold: number;
  qukeysMinHold: number;
  qukeysMinPrior: number;
  SuperTimeout: number;
  SuperRepeat: number;
  SuperWaitfor: number;
  SuperHoldstart: number;
  SuperOverlapThreshold: number;
  mouseSpeed: number;
  mouseSpeedDelay: number;
  mouseAccelSpeed: number;
  mouseAccelDelay: number;
  mouseWheelSpeed: number;
  mouseWheelDelay: number;
  mouseSpeedLimit: number;
  showDefaults: boolean;
}

export interface PrefState {
  devTools: boolean;
  advanced: boolean;
  verboseFocus: boolean;
  darkMode: string;
  neurons: Array<Neuron>;
  selectedNeuron: number;
  neuronID: string;
}

export interface LEDSettingsPreferences {
  kbData: KBDataPref;
  wireless: WirelessInterface;
  setKbData: (data: KBDataPref) => void;
  setWireless: (data: WirelessInterface) => void;
  connected: boolean;
  isWireless: boolean;
}

export interface AdvancedSettingsProps {
  connected: boolean;
  defaultLayer: number;
  selectDefaultLayer: (value: string) => void;
  keyboardType: string;
  neurons: Neuron[];
  neuronID: string;
  selectedNeuron: number;
  updateTab: (value: string) => void;
  onlyCustomLayers: string | boolean;
  toggleBackup: (value: boolean) => void;
  onChangeOnlyCustomLayers: (checked: boolean) => void;
}

export interface NeuronSettingsProps {
  neurons: Neuron[];
  selectedNeuron: number;
  selectNeuron: (value: string) => void;
  applyNeurons: (data: Neuron[]) => void;
  updateNeuronName: (data: string) => void;
  deleteNeuron: (toDelete: number) => void;
}

export interface NeuronSelectorProps {
  onSelect: (value: string) => void;
  itemList: Neuron[];
  selectedItem: number;
  updateItem: (data: string) => void;
  deleteItem: (toDelete: number) => void;
  subtitle: string;
}

export interface BackupSettingsProps {
  connected: boolean;
  neurons: any;
  neuronID: string;
  toggleBackup: (value: boolean) => void;
  destroyContext: () => Promise<void>;
}
