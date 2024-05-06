import React, { useState } from "react";

import { PageHeader } from "@Renderer/modules/PageHeader";
import CardDevice from "@Renderer/modules/DeviceManager/CardDevice";
import NoDeviceFound from "@Renderer/modules/DeviceManager/noDeviceFound";

import Heading from "@Renderer/components/ui/Heading";
import { Button } from "@Renderer/components/ui/Button";

import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

import { i18n } from "@Renderer/i18n";
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
} from "@Renderer/components/ui/AlertDialog";
import CardAddDevice from "@Renderer/modules/DeviceManager/CardAddDevice";

const savedDevicesList = [
  {
    name: "Captain Pinky Killer",
    available: true,
    path: "/dev/tty.usbmodem1301",
    file: false,
    device: {
      info: {
        displayName: "Dygma Raise ANSI",
        keyboardType: "ANSI",
        product: "Raise",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ARaise",
  },
  {
    name: "Keeb/Office",
    available: true,
    path: "/dev/tty.usbmodem2201",
    file: false,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyA",
  },
  {
    name: "Keeb/Home",
    available: false,
    path: "/dev/tty.usbmodem2201",
    file: false,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyB",
  },
  {
    path: "/backup/Defy",
    available: true,
    file: true,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyVirtual",
  },
  {
    path: "/backup/Defy",
    available: true,
    file: true,
    device: {
      info: {
        displayName: "Dygma Defy",
        keyboardType: "Wireless",
        product: "Defy",
      },
    },
    serialNumber: "BDAA4DC750535254352E3120FF15122ADefyVirtual2",
  },
];
const DeviceManager = () => {
  const [listDevices, setListDevices] = useState(savedDevicesList);
  // const [listDevices, setListDevices] = useState([]);
  const [activeTab, setActiveTab] = useState<"all" | boolean>("all");
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const addVirtualDevice = () => {
    console.log("Add virtual device!");
  };
  const scanDevices = () => {
    console.log("Scan devices!");
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

  const openDialog = (device: any) => {
    console.log(device);
    setSelectedDevice(device);
    setOpen(true);
  };

  const forgetDevice = (device: any) => {
    console.log("remove device", device);
    const updatedDevices = listDevices.filter(item => item !== device);
    setListDevices(updatedDevices);
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setListDevices(array => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  return (
    <div className="h-full">
      <div className="px-3 h-full">
        <div className="view-wrapper--devices flex h-[inherit] flex-col">
          <PageHeader
            text={i18n.deviceManager.title}
            primaryButton={scanDevicesButton}
            secondaryButton={addVirtualDevicesButton}
          />
          <div className="filterHeaderWrapper flex items-center justify-between pt-8 pb-3 mb-3 border-b-[1px] border-gray-100 dark:border-gray-600">
            <div className="filter-header flex items-center gap-4">
              <Heading headingLevel={3} renderAs="h3" className="ml-[2px]">
                {listDevices.length > 1 ? i18n.deviceManager.myDevices : i18n.deviceManager.myDevice}{" "}
                <sup className="text-purple-300">{listDevices.length}</sup>
              </Heading>
              {listDevices.length > 0 ? (
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
          {/* <div className="card-alert mt-0 mb-3">
            <Banner icon={<IconBluetooth />} variant="warning">
              <Heading headingLevel={5} renderAs="h5">
                Defy owners!
              </Heading>
              <p className="max-w-5xl">
                To use Bazecor on bluetooth, make sure the keyboard is connected via BT to the computer and{" "}
                <strong> click on scan keyboards once.</strong> This is necessary due to Chrome&apos;s API restrictions.
              </p>
            </Banner>
          </div> */}
          <div className="flex gap-4 relative">
            {listDevices.length > 0 ? (
              <div className="devices-container">
                <SortableList
                  onSortEnd={onSortEnd}
                  className="list devices-scroll relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
                  draggedItemClassName="dragged"
                >
                  {listDevices.map(item => (
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
        onOpenChange={isOpen => {
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
            <AlertDialogAction onClick={() => forgetDevice(selectedDevice)} buttonVariant="destructive">
              {i18n.general.continue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeviceManager;
