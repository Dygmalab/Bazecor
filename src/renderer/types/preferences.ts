export default interface KBDataPref {
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
