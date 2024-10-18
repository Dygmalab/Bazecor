import React, { useMemo } from "react";

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
  const { keyCode, onKeySelect, disabled } = props;

  const KC = useMemo(() => {
    if (typeof keyCode === "number") {
      return keyCode;
    }
    // eslint-disable-next-line
    if (typeof keyCode !== "number" && keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      // eslint-disable-next-line
      return keyCode.base + keyCode.modified;
    }

    return undefined;
  }, [keyCode]);

  return (
    <div className={`tabsWireless w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper">
        <div className="buttonsRow">
          {/* <Heading renderAs="h3" headingLevel={3} className="mb-[16px]">
            {i18n.app.menu.wireless}
          </Heading> */}
          <Callout size="sm" className="mt-0">
            <p>{i18n.editor.standardView.wireless.callOut}</p>
          </Callout>
          <div className="flex flex-wrap gap-1 py-2">
            <div className="flex-1 py-2">
              <Heading renderAs="h4" headingLevel={4} className="text-base">
                {i18n.editor.standardView.wireless.batteryLevel}
              </Heading>
              <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                {i18n.editor.standardView.wireless.batteryLevelDescription}
              </p>
              <Button
                variant="config"
                onClick={() => {
                  onKeySelect(BatteryCodes.STATUS);
                }}
                selected={KC === BatteryCodes.STATUS}
                className="w-max-[124px] w-[124px] text-center mt-2"
                size="sm"
              >
                {i18n.editor.standardView.wireless.batteryLevel}
              </Button>
            </div>
            <div className="flex-1 py-2">
              <Heading renderAs="h4" headingLevel={4} className="text-base">
                {i18n.wireless.bluetooth.pairingMode}
              </Heading>
              <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                {i18n.wireless.bluetooth.pairingModeDescription}
              </p>
              <Button
                variant="config"
                onClick={() => {
                  onKeySelect(BluetoothCodes.PAIRING);
                }}
                selected={KC === BluetoothCodes.PAIRING}
                className="w-max-[124px] w-[124px] text-center mt-2"
                size="sm"
              >
                {i18n.wireless.bluetooth.pair}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WirelessTab;
