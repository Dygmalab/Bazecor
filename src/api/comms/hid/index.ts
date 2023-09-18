import { find, connected, isDeviceConnected, isDeviceSupported } from "./HIDAPI";

const hid: any = {};
hid.find = find;
hid.connect = connected;
hid.isDeviceConnected = isDeviceConnected;
hid.isDeviceSupported = isDeviceSupported;

export default hid;
