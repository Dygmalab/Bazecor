import Device from "../../api/comms/Device";

export interface SelectKeyboardProps {
  onConnect: (...args: any[]) => any;
  onDisconnect: (currentDevice: Device) => void;
  connected: boolean;
  device: unknown;
  darkMode: boolean;
  setLoading: (isLoading: boolean) => void;
}

export interface NeuronConnectionProps {
  loading: boolean;
  scanFoundDevices: boolean;
  scanDevices: () => void;
  onKeyboardConnect: () => Promise<void>;
  connected: boolean;
  onDisconnect: () => Promise<void>;
  onDisconnectConnect: () => Promise<void>;
  deviceItems: any;
  selectPort: (event: any) => void;
  selectedPortIndex: number;
  isVirtual: boolean;
  virtualDevice: Device;
  connectedDeviceIndex: number;
}

export interface DeviceItemsType {
  index: number;
  displayName: string;
  userName: string;
  path: string;
}
