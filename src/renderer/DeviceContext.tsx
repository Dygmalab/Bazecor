/* eslint-disable no-await-in-loop */
import React, { useReducer, createContext, useContext, useMemo } from "react";
import { CountProviderProps, Action, State } from "./types/devices";
import serial, { isSerialType } from "../api/comms/serial";
import Device from "../api/comms/Device";
import hid from "../api/comms/hid";
import HID from "../api/hid/hid";

const DeviceContext = createContext(undefined);

function deviceReducer(state: State, action: Action) {
  console.log("Entering DeviceREDUCER!!!", state, action);
  switch (action.type) {
    case "changeCurrent": {
      if (action.payload.selected < state.deviceList.length && action.payload.selected >= 0) {
        const deviceList = [...state.deviceList];
        deviceList[action.payload.selected] = action.payload.device;
        return { ...state, selected: action.payload.selected, currentDevice: action.payload.device, deviceList };
      }
      return { ...state, selected: -1, currentDevice: undefined };
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
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DeviceProvider({ children }: CountProviderProps) {
  const [state, dispatch] = useReducer(deviceReducer, { currentDevice: undefined, selected: -1, deviceList: [] });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  // const value = { state, dispatch };
  const value = useMemo(() => [state, dispatch], [state, dispatch]);
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}

const isDeviceConnected = async (device: any) => {
  if (isSerialType(device)) {
    const result = await serial.isDeviceConnected(device);
    return result;
  }
  const result = await HID.isDeviceConnected(device);
  return result;
};

const isDeviceSupported = async (device: any) => {
  if (isSerialType(device)) {
    const result = await serial.isDeviceSupported(device);
    return result;
  }
  const result = await HID.isDeviceSupported(device);
  return result;
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

  // .map((sDevice: DeviceType) => new Device(sDevice));

  // working with hid
  const hidDevs = await HID.getDevices();
  console.log(hidDevs);
  for (const dev of hidDevs) {
    const connected = await isDeviceConnected(dev);
    const supported = await isDeviceSupported(dev);
    if (connected && supported) finalDevices.push(new Device(dev, "serial"));
  }

  // const finalDevices: Array<Device> = sDevices;
  return finalDevices;
};

const connect = async (device: Device) => {
  try {
    if (device.type === "serial") {
      const result = await serial.connect(device);
      device.addPort(result);
      console.log("the device is serial type: ", device, " and connected as: ", result);
      return device;
    }
    const result = hid.connect(device);
    console.log("the device is hid type: ", device, " and connected as: ", result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const DeviceTools: any = {};
DeviceTools.list = list;
DeviceTools.connect = connect;

export { DeviceProvider, useDevice, DeviceTools };
