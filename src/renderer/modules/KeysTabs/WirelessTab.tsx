import React from "react";

import { TabLayoutEditorProps } from "@Renderer/types/pages";

import { i18n } from "@Renderer/i18n";

import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import { BatteryCodes } from "@Renderer/../hw/battery";
import { BluetoothCodes } from "@Renderer/../hw/bluetooth";

// const Styles = Styled.div`
// width: 100%;
// h4 {
//     font-size: 16px;
//     flex: 0 0 100%;
//     width: 100%;
//     margin-top: 24px;
// }
// `;

function WirelessTab(props: TabLayoutEditorProps) {
  const { keyCode, onKeySelect, isStandardView } = props;
  return (
    <div className={`${isStandardView ? "standardViewTab" : ""} tabsWireless w-full`}>
      <div className="tabContentWrapper">
        <div className="buttonsRow">
          <Heading renderAs="h3" headingLevel={3} className="mb-[16px]">
            {i18n.app.menu.wireless}
          </Heading>
          <Callout size="sm" className="mt-4">
            <p>{i18n.editor.standardView.wireless.callOut}</p>
          </Callout>
          <div className="keysButtonsList mt-1">
            <Heading renderAs="h4" headingLevel={4}>
              {i18n.editor.standardView.wireless.batteryPowerStatus}
            </Heading>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-200">
              {i18n.editor.standardView.wireless.batteryLevelDescription}
            </p>
            <Button
              variant="config"
              onClick={() => {
                onKeySelect(BatteryCodes.STATUS);
              }}
              selected={isStandardView ? keyCode === BatteryCodes.STATUS : false}
              className="w-max-[124px] w-[124px] text-center mt-2"
              size="sm"
            >
              {i18n.editor.standardView.wireless.batteryLevel}
            </Button>
          </div>
          <div className="keysButtonsList">
            <Heading renderAs="h4" headingLevel={4}>
              {i18n.wireless.bluetooth.pairingMode}
            </Heading>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-200">
              {i18n.wireless.bluetooth.pairingModeDescription}
            </p>
            <Button
              variant="config"
              onClick={() => {
                onKeySelect(BluetoothCodes.PAIRING);
              }}
              selected={isStandardView ? keyCode === BluetoothCodes.PAIRING : false}
              className="w-max-[124px] w-[124px] text-center mt-2"
              size="sm"
            >
              {i18n.wireless.bluetooth.pair}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WirelessTab;
