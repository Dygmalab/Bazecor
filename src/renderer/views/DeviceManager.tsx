import React, { useState, useEffect, useCallback, useRef } from "react";
import log from "electron-log/renderer";
import { toast } from "react-toastify";

import { PageHeader } from "@Renderer/modules/PageHeader";
import CardDevice from "@Renderer/modules/DeviceManager/CardDevice";
import NoDeviceFound from "@Renderer/modules/DeviceManager/noDeviceFound";

// import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";

import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

import { i18n } from "@Renderer/i18n";
// import { i18n, refreshHardware } from "@Renderer/i18n";
import { AnimatePresence, motion, useInView } from "framer-motion";
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
import VirtualSelector from "@Renderer/modules/VirtualKeyboards/VirtualSelector";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";
import { IconArrowDownWithLine } from "@Renderer/components/atoms/icons";
import { DeviceListType } from "@Renderer/types/DeviceManager";
import { Neuron } from "@Renderer/types/neurons";

import Store from "../utils/Store";
import Device from "../../api/comms/Device";

const store = Store.getStore();

interface DeviceManagerProps {
  onConnect: (...args: any[]) => any;
  onDisconnect: () => void;
  connected: boolean;
  device: Device;
  darkMode: boolean;
  setLoading: (loading: boolean) => void;
  restoredOk: boolean;
}

const DeviceManager = (props: DeviceManagerProps) => {
  const { restoredOk, onConnect, onDisconnect, connected, device, darkMode, setLoading } = props;

  const { state, dispatch } = useDevice();
  const [scanned, setScanned] = useState(true);
  const [devicesList, setDevicesList] = useState<Array<DeviceListType>>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<"all" | boolean>("all");
  const [open, setOpen] = useState(false);
  const [openDialogVirtualKB, setOpenDialogVirtualKB] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(0);
  const [showMainButtons, setShowMainButtons] = useState(false);
  const [animationLoadingDevice, setAnimationLoadingDevice] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref);

  const delay = (ms: number) =>
    new Promise(res => {
      setTimeout(res, ms);
    });

  const onKeyboardConnect = async (selected: number) => {
    const { deviceList } = state;
    // log.info("trying to connect to:", deviceList, selectedDevice, deviceList[selectedDevice]);
    try {
      const response = await DeviceTools.connect(deviceList[selected]);
      log.info("GOING TO CONNECT TO!!", selected, response.device, device, darkMode);
      dispatch({ type: "changeCurrent", payload: { selected, device: response } });
      await onConnect(response);
    } catch (err) {
      const errorMessage = err.toString();
      toast.error(<ToastMessage title={errorMessage} />, { icon: "" });
    }
    // we use any because i18n indeed has that function defined
    // refreshHardware(devicesList[selectedDevice]);
  };

  const handleOnDisconnect = async () => {
    setScanned(false);
    const cID = state.currentDevice.serialNumber.toLowerCase();
    await DeviceTools.disconnect(state.currentDevice);
    dispatch({ type: "disconnect", payload: [cID] });
    setDevicesList([]);
    setSelectedDevice(-1);
    await onDisconnect();
  };

  const handleOnDisconnectConnect = async (deviceNumber: number) => {
    await DeviceTools.disconnect(state.currentDevice);
    await delay(500);
    await onKeyboardConnect(deviceNumber);
  };

  const findKeyboards = useCallback(async (): Promise<DeviceListType[]> => {
    setLoading(true);
    if (connected || state.deviceList?.length > 0) {
      const toShowDevs: DeviceListType[] = [];
      const existingIDs = state.deviceList.map(d => d.serialNumber.toLowerCase());
      const result = await DeviceTools.listNonConnected(false, existingIDs);
      let newDeviceList = state.deviceList.filter(
        x => !result.devicesToRemove.includes(x.serialNumber.toLowerCase()) || x.type === "virtual",
      );
      newDeviceList = newDeviceList.concat(result.finalDevices);
      dispatch({ type: "addDevicesList", payload: newDeviceList });
      log.info("Available Devices: ", newDeviceList);
      newDeviceList.forEach((item, index) => {
        const neurons = store.get("neurons") as Neuron[];
        const neuron = neurons.find(n => n.id.toLowerCase() === item.device?.chipId?.toLowerCase());
        toShowDevs.push({
          name: neuron?.name ? neuron.name : "",
          available: true,
          connected: state.selected === index,
          config: neuron,
          file: item.type === "virtual",
          device: item,
          serialNumber: item.device.chipId,
          index: toShowDevs.length,
        });
      });
      setLoading(false);
      setDevicesList(toShowDevs);
      if (toShowDevs.length > 0) setScanned(true);
      log.info("list of already connected devices: ", toShowDevs);
      return toShowDevs;
    }
    try {
      const list = (await DeviceTools.list()) as Device[];
      dispatch({ type: "addDevicesList", payload: list });
      log.info("Devices Available:", list);
      const newDev: DeviceListType[] = [];
      list.forEach(item => {
        const neuron = (store.get("neurons") as Neuron[]).find(n => n.id.toLowerCase() === item.device.chipId.toLowerCase());
        newDev.push({
          name: neuron?.name ? neuron.name : "",
          available: true,
          connected: false,
          config: neuron,
          file: item.type === "virtual",
          device: item,
          serialNumber: item.device.chipId,
          index: newDev.length,
        });
      });
      setDevicesList(newDev);
      setLoading(false);
      setScanned(true);
      return newDev;
    } catch (err) {
      log.info("Error while finding keyboards", err);
      setLoading(false);
      setDevicesList(undefined);
      return undefined;
    }
  }, [connected, dispatch, setLoading, state.deviceList, state.selected]);

  const handleConnection = async (deviceNumber: number, action: "connect" | "disconnect") => {
    // fijar el dispositivo seleccionado de la lista
    log.info("Handling on connect press", action, deviceNumber);

    switch (action) {
      case "connect":
        if (connected && deviceNumber !== state.selected) {
          setSelectedDevice(deviceNumber);
          await handleOnDisconnectConnect(deviceNumber);
        } else {
          setSelectedDevice(deviceNumber);
          await onKeyboardConnect(deviceNumber);
        }
        break;
      case "disconnect":
        await handleOnDisconnect();
        break;
      default:
        log.info("Wrong case", action);
        break;
    }
  };

  const addVirtualDevice = () => {
    log.info("Add virtual device!");
    setOpenDialogVirtualKB(true);
  };

  const scanDevices = () => {
    log.info("Scan devices!");
    setScanned(false);
    setAnimationLoadingDevice(true);
    setTimeout(() => setAnimationLoadingDevice(false), 800);
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

  const handleVirtualConnect = async (file: any) => {
    if (connected) {
      await handleOnDisconnect();
      await delay(500);
    }
    const response = await DeviceTools.connect(file);
    dispatch({ type: "changeCurrent", payload: { selected: -1, device: response } });
    await onConnect(response);
  };

  useEffect(() => {
    if (connected) {
      setSelectedDevice(state.selected);
      setScanned(false);
    } else {
      setScanned(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.deviceList?.length !== devicesList?.length) setScanned(false);
  }, [devicesList, state.deviceList]);

  useEffect(() => {
    if (!scanned) {
      const find = async () => {
        await findKeyboards();
      };
      find();
    }
  }, [findKeyboards, scanned]);

  useEffect(() => {
    // log.info("ref: ", ref.current);
    if (isInView) {
      setShowMainButtons(false);
    } else {
      setShowMainButtons(true);
    }
  }, [isInView, ref]);

  useEffect(() => {
    if (!restoredOk) {
      toast.error(
        <ToastMessage
          title="Oops! Layers not restored"
          content="There was an error loading your configuration. But worry not: reconnect your keyboard and the latest backup will be automatically restored."
          icon={<IconArrowDownWithLine />}
        />,
        { icon: "" },
      );
    }
  }, [restoredOk]);

  log.info("Current State: ", devicesList, selectedDevice);

  return (
    <div className="h-full relative flex flex-col justify-center">
      <div className="px-3 h-full">
        <div className="view-wrapper--devices flex h-[inherit] flex-col">
          <PageHeader
            text="Keyboard Manager"
            primaryButton={showMainButtons ? scanDevicesButton : null}
            secondaryButton={showMainButtons ? addVirtualDevicesButton : null}
            styles="pageHeaderFlatBottom"
          />
          {/* <div className="filterHeaderWrapper flex items-center justify-between pt-8 pb-3 mb-3 border-b-[1px] border-gray-100 dark:border-gray-600"> */}
          <div className="filterHeaderWrapper flex items-center justify-between pt-8 pb-3 mb-3">
            {/* // To be restored when we activate the persistence of the devices */}
            {/* <div className="filter-header flex items-center gap-4">
              <Heading headingLevel={3} renderAs="h3" className="ml-[2px]">
                {devicesList?.length > 1 ? i18n.deviceManager.myDevices : i18n.deviceManager.myDevice}
                <sup className="text-purple-300">{devicesList?.length}</sup>
              </Heading>
              {devicesList?.length > 0 ? (
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
            </div> */}
          </div>
          <div className="flex gap-4 relative h-full">
            {devicesList?.length > 0 ? (
              <div className="devices-container">
                <SortableList
                  onSortEnd={onSortEnd}
                  className="list devices-scroll relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 pb-4"
                  draggedItemClassName="dragged"
                >
                  {devicesList.map(item => (
                    <AnimatePresence mode="popLayout" key={item.serialNumber}>
                      {item.available === activeTab || activeTab === "all" ? (
                        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                          <SortableItem key={item.serialNumber}>
                            <CardDevice
                              device={item}
                              filterBy={activeTab}
                              openDialog={openDialog}
                              handleConnection={handleConnection}
                            />
                          </SortableItem>
                        </motion.div>
                      ) : (
                        ""
                      )}
                    </AnimatePresence>
                  ))}
                  <AnimatePresence mode="popLayout">
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                      <CardAddDevice
                        addVirtualDevice={addVirtualDevice}
                        scanDevices={scanDevices}
                        devicesNumber={devicesList?.length}
                        animationLoadingDevice={animationLoadingDevice}
                      />
                    </motion.div>
                  </AnimatePresence>
                </SortableList>
              </div>
            ) : (
              <div className="devices-container">
                <AnimatePresence mode="popLayout">
                  <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                    <div className="list devices-scroll relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 pb-4">
                      <NoDeviceFound />
                      <CardAddDevice
                        addVirtualDevice={addVirtualDevice}
                        scanDevices={scanDevices}
                        devicesNumber={devicesList?.length}
                        animationLoadingDevice={animationLoadingDevice}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
          <HelpSupportLink ref={ref} />
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

      <VirtualSelector
        handleVirtualConnect={handleVirtualConnect}
        openDialogVirtualKB={openDialogVirtualKB}
        setOpenDialogVirtualKB={setOpenDialogVirtualKB}
        showButton={false}
      />
    </div>
  );
};

export default DeviceManager;
