import React from "react";

import Heading from "@Renderer/components/ui/heading";
import { IconPlus, IconRefresh, IconRobotOffline } from "@Renderer/components/icons";
import { LargeButton } from "@Renderer/component/Button";

import { i18n } from "@Renderer/i18n";

const NoDeviceFound = () => (
  <div className="devices-container devices-container--no-devices w-full rounded-md px-6 py-8 bg-gray-25/25 dark:bg-gray-700/50">
    <div className="devices-inner w-full flex justify-center flex-col text-center">
      <div className="devices-icon mt-0 mb-2 mx-auto">
        <IconRobotOffline />
      </div>
      <div className="devices-title-group">
        <Heading headingLevel={3} renderAs="h3" variant="warning">
          {i18n.deviceManager.noDevicesFound}
        </Heading>
        <Heading headingLevel={4} renderAs="h4" className="text-base text-gray-400 dark:text-gray-200">
          {i18n.deviceManager.noDevicesFoundDescription}
        </Heading>
      </div>
      <div className="devices-buttons-group flex items-center justify-center gap-4 mt-6 pb-6 [&_button]:min-w-[280px]">
        <LargeButton onClick={() => console.log("Add virtual keyboard")} icon={<IconPlus size="md" />}>
          <Heading headingLevel={4}>{i18n.deviceManager.addVirtualDevice}</Heading>
          <p>{i18n.deviceManager.useWithoutKeyboard}</p>
        </LargeButton>
        <LargeButton onClick={() => console.log("Scan devices")} icon={<IconRefresh />}>
          <Heading headingLevel={4}>{i18n.deviceManager.scanDevices}</Heading>
          <p>{i18n.deviceManager.checkForDevices}</p>
        </LargeButton>
      </div>
    </div>
  </div>
);

export default NoDeviceFound;
