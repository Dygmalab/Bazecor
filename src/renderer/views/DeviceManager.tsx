import React, { useState } from "react";

import { IconDragDots, IconPlus, IconRefresh, IconRobotOffline } from "@Renderer/components/icons";
import { PageHeader } from "@Renderer/modules/PageHeader";
import CardDevice from "@Renderer/modules/DeviceManager/CardDevice";
import { Container } from "react-bootstrap";

import { ReOrderDevicesModal } from "@Renderer/component/Modal";
import Heading from "@Renderer/components/ui/heading";
import { LargeButton } from "@Renderer/component/Button";

import { i18n } from "@Renderer/i18n";
import { AnimatePresence, motion } from "framer-motion";
import HelpSupportLink from "@Renderer/modules/DeviceManager/HelpSupportLink";

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
  // const [listDevices, setListDevices] = useState(savedDevicesList);
  const [listDevices, setListDevices] = useState([]);
  const [activeTab, setActiveTab] = useState<"all" | boolean>("all");
  const [showModal, setShowModal] = useState(false);

  const addVirtualDevices = (
    <button className="sm button outline transp-bg iconOnNone" type="button" onClick={() => console.log("Add virtual device")}>
      Add virtual device
    </button>
  );
  const scanDevices = (
    <button className="sm button primary iconOnNone" type="button" onClick={() => console.log("Scan devices")}>
      Scan devices
    </button>
  );

  const reOrderList = (newList: any) => {
    setListDevices(newList);
    setActiveTab("all");
    setShowModal(false);
  };

  return (
    <div className="h-full">
      <Container fluid className="h-full">
        <div className="view-wrapper--devices flex h-[inherit] flex-col">
          <PageHeader text="Device Manager" primaryButton={scanDevices} secondaryButton={addVirtualDevices} />
          <div className="filterHeaderWrapper flex items-center justify-between pt-6 pb-3 mb-6 border-b-[1px] border-gray-100 dark:border-gray-600">
            <div className="filter-header flex items-center gap-4">
              <Heading headingLevel={3} renderAs="h3" className="ml-[2px]">
                {i18n.deviceManager.myDevices} <sup className="text-purple-300">{listDevices.length}</sup>
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

            {listDevices.length > 0 ? (
              <div className="filter-header--actions">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="modal-button--trigger flex items-center text-sm gap-2 transition-all p-0 bg-transparent text-gray-500 dark:text-gray-25 hover:text-purple-300 dark:hover:text-purple-100"
                >
                  <IconDragDots />
                  {i18n.general.reorderList}
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex gap-4 relative">
            {listDevices.length > 0 ? (
              <div className="devices-container">
                <div className="devices-scroll w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listDevices.map(item => (
                    <AnimatePresence mode="popLayout" key={item.serialNumber}>
                      {item.available === activeTab || activeTab === "all" ? (
                        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                          <CardDevice device={item} filterBy={activeTab} />
                        </motion.div>
                      ) : (
                        ""
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </div>
            ) : (
              <div className="devices-container devices-container--no-devices w-full rounded-md px-6 py-8 bg-gray-25/25 dark:bg-gray-700/50">
                <div className="devices-inner w-full flex justify-center flex-col text-center">
                  <div className="devices-icon mt-0 mb-2 mx-auto">
                    <IconRobotOffline />
                  </div>
                  <div className="devices-title-group">
                    <Heading headingLevel={3} renderAs="h3" variant="warning">
                      No devices found!
                    </Heading>
                    <Heading headingLevel={4} renderAs="h4" className="text-base">
                      [Black metal plays in background]
                    </Heading>
                  </div>
                  <div className="devices-buttons-group flex items-center justify-center gap-4 mt-6 pb-6 [&_button]:min-w-[280px]">
                    <LargeButton onClick={() => console.log("Add virtual keyboard")} icon={<IconPlus size="md" />}>
                      <Heading headingLevel={4}>Add virtual device</Heading>
                      <p>Use without a keyboard</p>
                    </LargeButton>
                    <LargeButton onClick={() => console.log("Scan devices")} icon={<IconRefresh />}>
                      <Heading headingLevel={4}>Scan devices</Heading>
                      <p>Check for nearby devices</p>
                    </LargeButton>
                  </div>
                </div>
              </div>
            )}
          </div>
          <HelpSupportLink />
        </div>
      </Container>

      <ReOrderDevicesModal
        show={showModal}
        toggleShow={() => setShowModal(false)}
        devices={listDevices}
        handleSave={reOrderList}
      />
    </div>
  );
};

export default DeviceManager;
