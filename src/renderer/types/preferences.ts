import { Neuron } from "./neurons";
import { WirelessInterface } from "./wireless";

export interface PreferencesProps {
  inContext: boolean;
  cancelContext: () => void;
  onChangeAllowBetas: (checked: boolean) => void;
  allowBeta: boolean;
  connected: boolean;
  startContext: () => void;
  toggleDarkMode: (mode: string) => void;
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
  selectNeuron: number;
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
