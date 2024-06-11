import React, { useState, useEffect, useCallback } from "react";
import { ipcRenderer } from "electron";
import log from "electron-log/renderer";
import { toast } from "react-toastify";

import { PageHeader } from "@Renderer/modules/PageHeader";
import CardDevice from "@Renderer/modules/DeviceManager/CardDevice";
import NoDeviceFound from "@Renderer/modules/DeviceManager/noDeviceFound";

import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";

import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

import { i18n, refreshHardware } from "@Renderer/i18n";
import { AnimatePresence, motion } from "framer-motion";
import HelpSupportLink from "@Renderer/modules/DeviceManager/HelpSupportLink";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Renderer/components/atoms/AlertDialog";
import CardAddDevice from "@Renderer/modules/DeviceManager/CardAddDevice";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import { DeviceClass } from "@Renderer/types/devices";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";
import { DeviceListType } from "@Renderer/types/DeviceManager";
import { Neuron } from "@Renderer/types/neurons";

import Store from "../utils/Store";
import Device from "../../api/comms/Device";
import { delay } from "../../api/flash/delay";

const store = Store.getStore();

interface DeviceManagerProps {
  onConnect: (...args: any[]) => any;
  onDisconnect: () => void;
  connected: boolean;
  device: Device;
  darkMode: boolean;
  setLoading: (loading: boolean) => void;
}

const DeviceManager = (props: DeviceManagerProps) => {
  const { onConnect, onDisconnect, connected, device, darkMode, setLoading } = props;

  const { state, dispatch } = useDevice();
  const [devicesList, setDevicesList] = useState<Array<DeviceListType>>([]);
  const [activeTab, setActiveTab] = useState<"all" | boolean>("all");
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(0);

  const onKeyboardConnect = async () => {
    const { deviceList } = state;
    // log.info("trying to connect to:", deviceList, selectedDevice, deviceList[selectedDevice]);
    try {
      const response = await DeviceTools.connect(deviceList[selectedDevice]);
      log.info("GOING TO CONNECT TO!!", selectedDevice, response.device);
      dispatch({ type: "changeCurrent", payload: { selected: selectedDevice, device: response } });
      await onConnect(response);
    } catch (err) {
      const errorMessage = err.toString();
      toast.error(<ToastMessage title={errorMessage} />, { icon: "" });
    }
    // we use any because i18n indeed has that function defined
    // refreshHardware(devicesList[selectedDevice]);
  };

  const handleOnDisconnect = async () => {
    const newDevices = devicesList.filter(dev => dev.path !== "virtual");
    setDevicesList(newDevices);
    setSelectedDevice(0);
    await DeviceTools.disconnect(state.currentDevice);
    dispatch({ type: "disconnect", payload: selectedDevice });
    await onDisconnect();
  };

  const handleOnDisconnectConnect = async () => {
    await handleOnDisconnect();
    await delay(500);
    await onKeyboardConnect();
  };

  const findKeyboards = useCallback(async (): Promise<DeviceClass[]> => {
    setLoading(true);
    if (state.currentDevice !== undefined && connected) {
      setLoading(false);
      const newDev: DeviceListType[] = [];
      state.deviceList.forEach(item => {
        newDev.push({
          name: "",
          available: false,
          path: "",
          file: false,
          device: item,
          serialNumber: "",
        });
      });
      setDevicesList(newDev);
      return state.deviceList;
    }
    try {
      const list = (await DeviceTools.list()) as Device[];
      dispatch({ type: "addDevicesList", payload: list });
      log.info("Devices Available:", list);
      setLoading(false);
      const newDev: DeviceListType[] = [];
      list.forEach(item => {
        newDev.push({
          name: "",
          available: false,
          path: "",
          file: false,
          device: item,
          serialNumber: "",
        });
      });
      setDevicesList(newDev);
      return list;
    } catch (err) {
      log.info("Error while finding keyboards", err);
      setLoading(false);
      setDevicesList(undefined);
      return undefined;
    }
  }, [connected, dispatch, setLoading, state.currentDevice, state.deviceList]);

  // const getdevicesList: () => Array<DeviceListType> = useCallback(() => {
  //   const neurons = store.get("neurons") as Neuron[];
  //   const result = devicesList?.map((dev, index) => {
  //     // log.info("checking device :", device);
  //     const devName = dev.device.type === "hid" ? "Bluetooth" : dev.device.type;
  //     if (dev.device.device.bootloader)
  //       return {
  //         index,
  //         displayName: dev?.device?.device?.info?.displayName as string,
  //         userName: "",
  //         path: (dev.path || devName) as string,
  //       };
  //     const preparedSN = dev.device.productId === "2201" ? dev.serialNumber.slice(0, 32) : dev.serialNumber;
  //     const neuron = neurons.find(n => n.id.toLowerCase() === preparedSN.toLowerCase());

  //     return {
  //       index,
  //       displayName: dev?.device?.device?.info?.displayName as string,
  //       userName: neuron ? neuron.name : "",
  //       path: (dev.path || devName) as string,
  //     };
  //   });
  //   return result;
  // }, [devicesList]);

  const addVirtualDevice = () => {
    log.info("Add virtual device!");
  };

  const scanDevices = () => {
    log.info("Scan devices!");
    findKeyboards();
  };

  const addVirtualDevicesButton = (
    // <button className="sm button outline transp-bg iconOnNone" type="button" onClick={addVirtualDevice}>
    //   {i18n.deviceManager.addVirtualDevice}
    // </button>
    <Button variant="outline" size="sm" onClick={addVirtualDevice}>
      {i18n.deviceManager.addVirtualDevice}
    </Button>
  );
  const scanDevicesButton = (
    <Button variant="primary" size="sm" className="ml-3" onClick={scanDevices}>
      {i18n.deviceManager.scanDevices}
    </Button>
  );

  const openDialog = (dev: Device) => {
    log.info(dev);
    setSelectedDevice(devicesList.findIndex((item: DeviceListType) => item.device === dev));
    setOpen(true);
  };

  const forgetDevice = (dev: Device) => {
    log.info("remove device", dev);
    const updatedDevices = devicesList.filter(item => item.device !== dev);
    setDevicesList(updatedDevices);
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setDevicesList(array => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  useEffect(() => {
    const finder = () => findKeyboards();

    const disconnectedfinder = (event: unknown, DygmaDev: string) => {
      log.info("Disconnected: ", DygmaDev);
      setSelectedDevice(0);
      findKeyboards();
      if (state.currentDevice) {
        state.currentDevice.close();
      }
    };

    ipcRenderer.on("usb-connected", finder);
    ipcRenderer.on("usb-disconnected", disconnectedfinder);
    ipcRenderer.on("hid-connected", finder);
    ipcRenderer.on("hid-disconnected", disconnectedfinder);

    if (!connected) {
      findKeyboards();
    } else {
      setSelectedDevice(state.selected);
    }

    return () => {
      ipcRenderer.off("usb-connected", finder);
      ipcRenderer.off("usb-disconnected", disconnectedfinder);
      ipcRenderer.off("hid-connected", finder);
      ipcRenderer.off("hid-disconnected", disconnectedfinder);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connected && state.currentDevice) {
      findKeyboards();
    }
  }, [connected, findKeyboards, state.currentDevice]);

  log.info("Current State: ", devicesList, selectedDevice);

  return (
    <div className="h-full">
      <div className="px-3 h-full">
        <div className="view-wrapper--devices flex h-[inherit] flex-col">
          <PageHeader text="Device Manager" primaryButton={scanDevicesButton} secondaryButton={addVirtualDevicesButton} />
          <div className="filterHeaderWrapper flex items-center justify-between pt-8 pb-3 mb-3 border-b-[1px] border-gray-100 dark:border-gray-600">
            <div className="filter-header flex items-center gap-4">
              <Heading headingLevel={3} renderAs="h3" className="ml-[2px]">
                {devicesList.length > 1 ? i18n.deviceManager.myDevices : i18n.deviceManager.myDevice}{" "}
                <sup className="text-purple-300">{devicesList.length}</sup>
              </Heading>
              {devicesList.length > 0 ? (
                <div className="filter-header--tabs">
                  <ul className="list-none p-0 m-0 flex gap-1">
                    <li>
                      <button
                        type="button"
                        className={`tab text-gray-25 rounded-[16px] py-1 px-3 m-0 font-semibold tracking-tight text-sm transition-all ${
                          activeTab === "all"
                            ? "tab-active bg-purple-300"
                            : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                        }`}
                        onClick={() => setActiveTab("all")}
                      >
                        {i18n.general.all}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className={`tab text-gray-25 rounded-[16px] py-1 px-3 m-0 font-semibold tracking-tight text-sm transition-all ${
                          activeTab === true
                            ? "tab-active bg-purple-300"
                            : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                        }`}
                        onClick={() => setActiveTab(true)}
                      >
                        {i18n.general.online}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className={`tab text-gray-25 rounded-[16px] py-1 px-3 m-0 font-semibold tracking-tight text-sm transition-all ${
                          activeTab === false
                            ? "tab-active bg-purple-300"
                            : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                        }`}
                        onClick={() => setActiveTab(false)}
                      >
                        {i18n.general.offline}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex gap-4 relative">
            {devicesList.length > 0 ? (
              <div className="devices-container">
                <SortableList
                  onSortEnd={onSortEnd}
                  className="list devices-scroll relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
                  draggedItemClassName="dragged"
                >
                  {devicesList.map(item => (
                    <AnimatePresence mode="popLayout" key={item.serialNumber}>
                      {item.available === activeTab || activeTab === "all" ? (
                        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                          <SortableItem key={item.serialNumber}>
                            <CardDevice device={item} filterBy={activeTab} openDialog={openDialog} />
                          </SortableItem>
                        </motion.div>
                      ) : (
                        ""
                      )}
                    </AnimatePresence>
                  ))}
                  <AnimatePresence mode="popLayout">
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                      <CardAddDevice addVirtualDevice={addVirtualDevice} scanDevices={scanDevices} />
                    </motion.div>
                  </AnimatePresence>
                </SortableList>
              </div>
            ) : (
              <div className="devices-container">
                <AnimatePresence mode="popLayout">
                  <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                    <div className="list devices-scroll relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                      <NoDeviceFound />
                      <CardAddDevice addVirtualDevice={addVirtualDevice} scanDevices={scanDevices} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
          <HelpSupportLink />
        </div>
      </div>

      <AlertDialog
        open={open}
        onOpenChange={(isOpen: boolean) => {
          if (isOpen === true) return;
          setOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{i18n.deviceManager.dialogDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{i18n.deviceManager.dialogDeleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel buttonVariant="outline">{i18n.dialog.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => forgetDevice(devicesList[selectedDevice].device)} buttonVariant="destructive">
              {i18n.general.continue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeviceManager;
