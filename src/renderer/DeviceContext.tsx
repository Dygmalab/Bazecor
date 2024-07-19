/* eslint-disable no-await-in-loop */
import React, { useReducer, createContext, useContext, useMemo } from "react";
import log from "electron-log/renderer";
import { VirtualType } from "./types/virtual";
import serial from "../api/comms/serial";
import Device, { State } from "../api/comms/Device";
import HID from "../api/hid/hid";
import { isVirtualType } from "../api/comms/virtual";

type CountProviderProps = { children: React.ReactNode };

type ContextType =
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined;

export type Action =
  | { type: "changeCurrent"; payload: { selected: number; device: Device } }
  | { type: "addDevice"; payload: Device }
  | { type: "addDevices"; payload: Device[] }
  | { type: "addDevicesList"; payload: Device[] }
  | { type: "disconnect"; payload: string[] };

export type ActionType = "changeCurrent" | "addDevice" | "addDevicesList" | "disconnect";

export type Dispatch = (action: Action) => void;

const DeviceContext = createContext<ContextType>(undefined);

function deviceReducer(state: State, action: Action) {
  // log.verbose("Entering DeviceREDUCER!!!", state, action);
  switch (action.type) {
    case "changeCurrent": {
      if (action.payload.selected === -1) {
        // We are working with Virtual keyboards here
        const newList = [...state.deviceList];
        newList.push(action.payload.device);
        log.warn("EXECUTED changeCurrent with selected === -1: ", action.payload, newList);
        return { selected: newList.length - 1, currentDevice: newList[newList.length - 1], deviceList: newList };
      }
      const newCurrent = state.deviceList[action.payload.selected];
      log.warn("EXECUTED changeCurrent: ", action.payload, newCurrent);
      return { ...state, selected: action.payload.selected, currentDevice: newCurrent };
    }
    case "addDevice": {
      const newDevices = [...state.deviceList];
      newDevices.push(action.payload);
      log.warn("EXECUTED addDevice: ", action.payload, newDevices);
      return { ...state, deviceList: newDevices, currentDevice: state.currentDevice, selected: state.selected };
    }
    case "addDevices": {
      let newDevices = [...state.deviceList];
      newDevices = newDevices.concat(action.payload);
      log.warn("EXECUTED addDevices: ", action.payload, newDevices);
      return { ...state, deviceList: newDevices, currentDevice: state.currentDevice, selected: state.selected };
    }
    case "addDevicesList": {
      const newDevices = [...action.payload];
      log.warn("EXECUTED addDevicesList: ", action.payload, newDevices);
      return { ...state, deviceList: newDevices };
    }
    case "disconnect": {
      let newDevices = [...state.deviceList];
      let newSelected: number = state.selected;
      newDevices = newDevices.filter((device, index) => {
        const toRemove = action.payload.includes(device.serialNumber.toLowerCase());

        if (index < state.selected && newSelected > -1) newSelected -= 1;
        if (toRemove && state.selected === index) {
          log.info("entered with", state.selected, index, toRemove, device.serialNumber.toLowerCase());
          newSelected = -1;
        }

        return !toRemove;
      });
      // newSelected = state.selected >= newDevices.length ? -1 : state.selected;
      log.warn("EXECUTED disconnect: ", state.deviceList, state.selected, action.payload, newDevices);
      log.warn("new disconnected device: ", newSelected);
      return {
        ...state,
        deviceList: newDevices,
        currentDevice: newSelected === -1 ? undefined : newDevices[newSelected],
        selected: newSelected,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

function DeviceProvider({ children }: CountProviderProps) {
  const [state, dispatch] = useReducer(deviceReducer, { currentDevice: undefined, selected: -1, deviceList: [] });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  // const value = { state, dispatch };
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}

// const isDeviceConnected = async (device: Device) => {
//   log.info(device);
//   return true;
// };

// const isDeviceSupported = async (device: Device) => {
//   log.info("going to check support: ", device.device, isSerialType(device));
//   return false;
// };

const list = async () => {
  // working with serial
  const serialDevs = await serial.find();
  const finalDevices: Array<Device> = [];
  for (const dev of serialDevs) {
    log.info("Checking connected & supported for Serial");
    finalDevices.push(new Device(dev, "serial"));
  }

  // working with hid
  const hidDevs = await HID.getDevices();
  for (const [index, device] of hidDevs.entries()) {
    log.verbose("Checking: ", device);
    const hid = new HID();
    const connected = await hid.isDeviceConnected(index);
    const supported = await hid.isDeviceSupported(index);
    log.info("Checking connected & supported for HID: ", connected, supported);
    if (connected && supported) finalDevices.push(new Device(hid, "hid"));
  }

  return finalDevices;
};

const enumerateSerial = async (bootloader: boolean) => {
  const dev = await serial.enumerate(bootloader);
  return dev;
};

const enumerateDevice = async (bootloader: boolean, device: USBDevice, existingIDs: string[]) => {
  const dev = (await serial.enumerate(bootloader, device, existingIDs)).foundDevices;
  // log.info("Data from enum dev:", dev, bootloader, existingIDs);
  const newDevice = dev.map(d => new Device(d, "serial"));

  // const hidDev = await HID.getDevices();
  // for (const [index, d] of hidDev.entries()) {
  //   if (!existingIDs.includes(d.productName)) {
  //     log.verbose("Checking: ", d, existingIDs);
  //     const hid = new HID();
  //     const connected = await hid.isDeviceConnected(index);
  //     const supported = await hid.isDeviceSupported(index);
  //     log.info("Checking connected & supported for HID: ", connected, supported);
  //     newDevice.push(new Device(hid, "hid"));
  //   }
  // }

  // log.info("Resp enum Dev HID!!", hidDev, newDevice);
  return newDevice;
};

/**
 * Lists the non connected devices, thus excluding from the search any that already figure as connected.
 * @param bootloader Boolean value that identifies the type of keyobard being searched for.
 * @param existingIDs The list of ID's that are already present on the device manager devices list and thus have to be avoided.
 */
const listNonConnected = async (bootloader: boolean, existingIDs: string[]) => {
  const finalDevices: Array<Device> = [];
  const devicesToRemove: Array<string> = [];
  const hidDevicesPresent: Array<string> = [];

  // Gathering SerialPort Devices
  const result = await serial.enumerate(bootloader, undefined, existingIDs);
  result.foundDevices.map(dev => finalDevices.push(new Device(dev, "serial")));
  // log.info("Data from enum dev:", dev, bootloader, existingIDs);

  // Gathering HID Devices
  const hidDevs = await HID.getDevices();
  for (const [index, device] of hidDevs.entries()) {
    log.verbose("Checking: ", device);
    if (existingIDs.includes((device as unknown as Device)?.device?.chipId)) {
      hidDevicesPresent.push((device as unknown as Device).device.chipId);
      break;
    }
    const hid = new HID();
    const connected = await hid.isDeviceConnected(index);
    const supported = await hid.isDeviceSupported(index);
    log.info("Checking connected & supported for HID: ", connected, supported);
    if (connected && supported && !existingIDs.includes(hid.serialNumber)) finalDevices.push(new Device(hid, "hid"));
  }

  existingIDs.forEach(d =>
    result.validDevices.includes(d) || hidDevicesPresent.includes(d) ? undefined : devicesToRemove.push(d),
  );

  return { finalDevices, devicesToRemove };
};

const currentSerialN = async (existingIDs: string[]) => {
  const result: string[] = [];
  const SN = (await serial.enumerate(false)).foundDevices.map(port => port?.serialNumber?.toLowerCase());
  existingIDs.forEach(id => {
    if (!SN.includes(id.toLowerCase())) result.push(id.toLowerCase());
  });
  return result;
};

const currentHIDN = async (existingPNs: string[]) => {
  const result: string[] = [];
  const SN = (await HID.getDevices()).map(hid => hid.productName);
  existingPNs.forEach(id => {
    if (!SN.includes(id)) result.push(id);
  });
  log.info("Parsing HID's: ", existingPNs, SN, result);
  return result;
};

const connect = async (device: Device | VirtualType) => {
  try {
    if (isVirtualType(device)) {
      const result = await new Device(device, "virtual");
      result.device.chipId = result.serialNumber;
      log.verbose(`the device is ${result.type} type, and connected as: `, result);
      return result;
    }
    if (Device.isDevice(device)) {
      if (device.type === "serial") {
        const result = await serial.connect(device);
        await device.addPort(result);
        log.verbose(`the device is ${device.type} type, and connected as:`, result);
        return device;
      }
      if (device.type === "hid") {
        log.verbose(device.port);
        const result = await (device.port as HID).connect();
        await device.addHID();
        log.verbose(`the device is ${device.type} type, and connected as: `, result);
        return device;
      }
      if (device.type === "virtual") {
        const result = device;
        result.isClosed = false;
        return result;
      }
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
  return undefined;
};

const disconnect = async (device: Device) => {
  if (!device) return false;
  try {
    if (!device?.isClosed) {
      await device.close();
    }
    log.verbose("device disconnected successfully");
    return true;
  } catch (error) {
    log.error(error);
    return false;
  }
};

const DeviceTools = {
  list,
  enumerateSerial,
  enumerateDevice,
  listNonConnected,
  currentSerialN,
  currentHIDN,
  connect,
  disconnect,
};

export { DeviceProvider, useDevice, DeviceTools };
