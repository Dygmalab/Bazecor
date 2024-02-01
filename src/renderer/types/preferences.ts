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
  updateTab: (value: string) => void;
  toggleBackup: (value: boolean) => void;
}
