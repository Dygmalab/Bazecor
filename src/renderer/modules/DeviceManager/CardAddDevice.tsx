import React from "react";

import Heading from "@Renderer/components/ui/heading";
import { IconPlus, IconRefresh, IconBluetooth } from "@Renderer/components/icons";
import { LargeButton } from "@Renderer/component/Button";

import { i18n } from "@Renderer/i18n";

const CardAddDevice = () => (
  <div className="card-device card-filter-on card-all select-none flex flex-col h-full relative p-0 rounded-[24px] border-2 border-solid border-gray-50 bg-gray-25/50 dark:border-gray-700 dark:bg-gray-700/50 overflow-hidden">
    <div className="card-header relative bg-transparent border-none pt-6 min-h-[140px]">
      <Heading headingLevel={3} renderAs="h3">
        Add keyboard
      </Heading>
      <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold tracking-tight">Start setting up your new keyboard</p>
      <div className="devices-buttons-group flex flex-col items-center justify-center gap-2 mt-6 pb-6 [&_button]:min-w-full">
        <LargeButton onClick={() => console.log("Add virtual keyboard")} icon={<IconPlus size="md" />}>
          <Heading headingLevel={4}>{i18n.deviceManager.addVirtualDevice}</Heading>
          <p>{i18n.deviceManager.useWithoutKeyboard}</p>
        </LargeButton>
        <LargeButton onClick={() => console.log("Scan devices")} icon={<IconRefresh />}>
          <Heading headingLevel={4}>{i18n.deviceManager.scanDevices}</Heading>
          <p>{i18n.deviceManager.checkForDevices}</p>
        </LargeButton>
      </div>
      <div className="card-alert mt-0 mb-3 flex gap-2">
        <div className="text-gray-500 dark:text-gray-100 flex-shrink-0 flex-grow-0 basis-[24px]">
          <IconBluetooth />
        </div>
        <p className="w-full text-xs text-gray-500 dark:text-gray-100">
          <strong>To use Bazecor on bluetooth</strong>, make sure the keyboard is connected via BT to the computer and{" "}
          <strong> click on scan keyboards once.</strong>
        </p>
      </div>
    </div>
  </div>
);

export default CardAddDevice;
