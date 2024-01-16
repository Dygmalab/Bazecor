import { Neuron } from "./neurons";

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
  modified: boolean;
}
