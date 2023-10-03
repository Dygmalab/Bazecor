export interface WirelessPropsInterface {
  connected: boolean;
  path: string;
  titleElement: () => void;
  darkMode: boolean;
  toggleDarkMode: (mode: any) => void;
  startContext: () => void;
  cancelContext: () => void;
  updateAllowBeta: (event: any) => void;
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
    infoChannel1: string;
    infoChannel2: string;
    infoChannel3: string;
    infoChannel4: string;
    infoChannel5: string;
    deviceName: string;
  };
  rf: {
    channelHop: number;
    power: number;
  };
  brightness: number;
  brightnessUG: number;
  fade: number;
  idleleds: number;
}

export interface BatterySettingsProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  isCharging: boolean;
}

export interface EnergyManagementProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
}

export interface AdvancedEnergyManagementProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export interface RFSettingsProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  sendRePair: () => void;
}

export interface ConnectionProps {
  connection: number;
}

export interface SelectWirelessDropdownProps {
  // action: number;
  // activeTab: number;
  keyCode: { base: number; modified: number };
  onKeySelect: (event: number) => void;
}

export interface WirelessButton {
  name: string;
  keynum: number;
}
