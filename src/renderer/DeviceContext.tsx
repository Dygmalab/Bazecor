/* eslint-disable no-await-in-loop */
import React, { useReducer, createContext, useContext, useMemo } from "react";
import log from "electron-log/renderer";
import { CountProviderProps, Action, State, DeviceClass, VirtualType } from "./types/devices";
import serial, { isSerialType } from "../api/comms/serial";
import Device from "../api/comms/Device";
import HID from "../api/hid/hid";
import { isVirtualType } from "../api/comms/virtual";

type ContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const DeviceContext = createContext<ContextType>(undefined);

function deviceReducer(state: State, action: Action) {
  // log.verbose("Entering DeviceREDUCER!!!", state, action);
  switch (action.type) {
    case "changeCurrent": {
      if (action.payload.selected < state.deviceList.length && action.payload.selected >= 0) {
        const deviceList = [...state.deviceList];
        deviceList[action.payload.selected] = action.payload.device;
        return { ...state, selected: action.payload.selected, currentDevice: action.payload.device, deviceList };
      }
      const deviceList = [...state.deviceList];
      deviceList.push(action.payload.device);
      return { ...state, selected: deviceList.length - 1, currentDevice: action.payload.device, deviceList };
    }
    case "addDevice": {
      const newDevices = state.deviceList;
      newDevices.push(action.payload);
      return { ...state, deviceList: newDevices };
    }
    case "addDevicesList": {
      const newDevices = action.payload;
      return { ...state, deviceList: newDevices };
    }
    case "disconnect": {
      const newDevices = state.deviceList.filter(device => device.type !== "virtual");
      return { ...state, deviceList: newDevices, currentDevice: undefined, selected: -1 };
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

const isDeviceConnected = async (device: Device) => {
  if (isSerialType(device)) {
    const result = await serial.isDeviceConnected(device);
    return result;
  }
  // const result = await HID.isDeviceConnected(device);
  // return result;
  return false;
};

const isDeviceSupported = async (device: Device) => {
  if (isSerialType(device)) {
    const result = await serial.isDeviceSupported(device);
    return result;
  }
  // const result = await HID.isDeviceSupported(device);
  // return result;
  return false;
};

const list = async () => {
  // working with serial
  const serialDevs = await serial.find();
  const finalDevices: Array<Device> = [];
  for (const dev of serialDevs) {
    const connected = await isDeviceConnected(dev);
    const supported = await isDeviceSupported(dev);
    if (connected && supported) finalDevices.push(new Device(dev, "serial"));
  }

  // working with hid
  const hidDevs = await HID.getDevices();
  for (const [index, device] of hidDevs.entries()) {
    log.verbose("Checking: ", device);
    const hid = new HID();
    const connected = await hid.isDeviceConnected(index);
    const supported = await hid.isDeviceSupported(index);
    log.verbose("Checking connected & supported: ", connected, supported);
    if (connected && supported) finalDevices.push(new Device(hid, "hid"));
  }

  return finalDevices;
};

const connect = async (device: DeviceClass | VirtualType) => {
  try {
    if (isVirtualType(device)) {
      const result = await new Device(device, "virtual");
      log.verbose("the device is virtual type: ", device, " and connected as: ", result);
      return result;
    }
    if (Device.isDevice(device)) {
      if (device.type === "serial") {
        const result = await serial.connect(device);
        device.addPort(result);
        log.verbose("the device is serial type: ", device, " and connected as: ", result);
        return device;
      }
      log.verbose(device.port);
      const result = await (device.port as HID).connect();
      await device.addHID();
      log.verbose("the device is hid type: ", device, " and connected as: ", result);
      return device;
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
  return undefined;
};

const disconnect = async (device: DeviceClass) => {
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
  connect,
  disconnect,
};

export { DeviceProvider, useDevice, DeviceTools };
