export interface WirelessPropsInterface {
  connected: boolean;
  path: string;
  titleElement: () => void;
  darkMode: () => void;
  toggleDarkMode: () => void;
  startContext: () => void;
  cancelContext: () => void;
  updateAllowBeta: () => void;
  allowBeta: boolean;
  inContext: boolean;
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

export interface BatterySettingsProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  toggleSavingMode: () => void;
  isCharging: boolean;
}

export interface EnergyManagementProps {
  wireless: WirelessInterface;
  toggleSavingMode: () => void;
}

export interface RFSettingsProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  sendRePair: () => void;
}
