import React from "react";

import Heading from "@Renderer/components/atoms/Heading";
import { IconRobotOffline } from "@Renderer/components/atoms/icons";

import { i18n } from "@Renderer/i18n";

const NoDeviceFound = () => (
  <div className="devices-container devices-container--no-devices w-full flex rounded-md px-6 py-8 bg-gray-25/25 dark:bg-gray-700/50">
    <div className="devices-inner w-full flex justify-center flex-col text-center pb-2">
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
    </div>
  </div>
);

export default NoDeviceFound;
