import React from "react";

import Heading from "@Renderer/components/atoms/Heading";
import { IconPlus, IconRefresh, IconBluetooth } from "@Renderer/components/atoms/icons";
import { Button } from "@Renderer/components/atoms/Button";

import { i18n } from "@Renderer/i18n";

interface CardAddDeviceProps {
  addVirtualDevice: () => void;
  scanDevices: () => void;
  devicesNumber: number;
  animationLoadingDevice: boolean;
}

const CardAddDevice = React.forwardRef<HTMLDivElement, CardAddDeviceProps>(
  ({ addVirtualDevice, scanDevices, devicesNumber, animationLoadingDevice }, ref) => (
    <div
      ref={ref}
      className="card-device card-filter-on card-all select-none flex flex-col h-full relative p-0 rounded-[24px] border-2 border-solid border-gray-50 bg-gray-25/50 dark:border-gray-700 dark:bg-gray-700/50 overflow-hidden"
    >
      <div className="card-header relative bg-transparent border-none pt-6 px-6 min-h-min h-full flex flex-col justify-between gap-4">
        <div className="card-header-wrapper flex flex-col">
          <Heading headingLevel={3} renderAs="h3">
            Add keyboard
          </Heading>
          <p className="text-gray-600 dark:text-gray-300 text-base font-semibold tracking-tight pt-2 pb-4">
            Start setting up your new keyboard
          </p>
          <div className="card-alert mt-3 mb-3 flex gap-2">
            <div className="text-gray-500 dark:text-gray-100 flex-shrink-0 flex-grow-0 basis-[24px]">
              <IconBluetooth />
            </div>
            <p className="w-full text-xs text-gray-500 dark:text-gray-100">
              <strong>To use Bazecor on bluetooth</strong>, make sure the keyboard is connected via BT to the computer and{" "}
              <strong> click on scan keyboards once.</strong>
            </p>
          </div>
        </div>
        <div className="devices-buttons-group flex flex-col items-center justify-center gap-2 mt-6 pb-6 [&_button]:min-w-full">
          <Button
            variant={`${devicesNumber > 0 ? "supportive" : "primaryIcon"}`}
            size="md"
            icon={<IconRefresh />}
            onClick={scanDevices}
            className={`${animationLoadingDevice ? "[&_.buttonIcon]:animate-spin-fast" : ""}`}
          >
            <div className="button-content">
              <Heading
                headingLevel={4}
                className={`text-[1.125rem] ${devicesNumber > 0 ? "" : "text-gray-25 dark:text-gray-25"}`}
              >
                {i18n.deviceManager.scanDevices}
              </Heading>
              <p className={`${devicesNumber > 0 ? "" : "!text-gray-25 !dark:text-gray-25"}`}>
                {i18n.deviceManager.checkForDevices}
              </p>
            </div>
          </Button>
          <Button variant="supportive" size="md" icon={<IconPlus size="md" />} onClick={addVirtualDevice}>
            <div className="button-content">
              <Heading headingLevel={4} className="text-[1.125rem]">
                {i18n.deviceManager.addVirtualDevice}
              </Heading>
              <p>{i18n.deviceManager.useWithoutKeyboard}</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  ),
);

export default CardAddDevice;
