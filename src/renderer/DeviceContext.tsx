import React, { useReducer, createContext, useContext, useMemo } from "react";
import { DeviceType } from "./types/devices";

type CountProviderProps = { children: React.ReactNode };
type Action =
  | { type: "changeCurrent"; payload: any }
  | { type: "addDevice"; payload: any }
  | { type: unknown; payload?: unknown };
type Dispatch = (action: Action) => void;
type State = {
  currentDevice: number;
  deviceList: Array<DeviceType>;
};

const DeviceContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function deviceReducer(state: State, action: Action) {
  switch (action.type) {
    case "changeCurrent": {
      if (action.payload < state.deviceList.length && action.payload >= 0) return { ...state, currentDevice: action.payload };
      return { ...state, currentDevice: 0 };
    }
    case "addDevice": {
      const newDevices = state.deviceList;
      newDevices.push(action.payload);
      return { ...state, deviceList: newDevices };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DeviceProvider({ children }: CountProviderProps) {
  const [state, dispatch] = useReducer(deviceReducer, { currentDevice: 0, deviceList: [] });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  // const value = { state, dispatch };
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}

export { DeviceProvider, useDevice };
