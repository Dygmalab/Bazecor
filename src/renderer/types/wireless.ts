export interface PropsInterface {
  inContext: boolean;
  connected: boolean;
  allowBeta: boolean;
  updateAllowBeta: any;
  cancelContext: any;
  startContext: any;
}

export interface WirelessInterface {
  battery: {
    LeftLevel: number;
    RightLevel: number;
    LeftState: number;
    RightState: number;
    savingMode: boolean;
  };
  energy: {
    modes: number;
    currentMode: number;
    disable: number;
  };
  bluetooth: {
    devices: number;
    state: number;
    stability: number;
  };
  rf: {
    channelHop: number;
    state: number;
    stability: number;
  };
}
