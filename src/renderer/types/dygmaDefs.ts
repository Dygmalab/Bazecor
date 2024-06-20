export type DygmaDeviceType = {
  info: {
    vendor: string;
    product: string;
    keyboardType: string;
    displayName: string;
    urls: {
      name: string;
      url: string;
    }[];
  };
  usb: {
    vendorId: number;
    productId: number;
  };
  keyboard?: {
    rows: number;
    columns: number;
  };
  keyboardUnderglow?: {
    rows: number;
    columns: number;
  };
  RGBWMode?: boolean;
  components?: {
    keymap: unknown;
  };
  instructions: {
    en: {
      updateInstructions: string;
    };
  };
  chipId?: string;
  wireless?: boolean;
  bootloader?: boolean;
  path?: string;
  filePath?: string;
  isDeviceSupported?: (port: string) => any;
  flash?: (
    filename: any,
    flash: { updateFirmware: (arg0: any, arg1: any) => any },
    stateUpdate: any,
    bootloader?: boolean,
  ) => any;
};
