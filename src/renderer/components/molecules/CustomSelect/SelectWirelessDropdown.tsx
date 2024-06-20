import React, { useMemo, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverButton } from "@Renderer/components/atoms/Popover";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { i18n } from "@Renderer/i18n";
import { SelectWirelessDropdownProps, WirelessButton } from "@Renderer/types/wireless";
import { BluetoothCodes } from "@Renderer/../hw/bluetooth";
import { BatteryCodes } from "@Renderer/../hw/battery";

enum WirelessButtonOrder {
  BATTERY_LEVEL = 0,
  PAIRING_MODE = 1,
}

const SelectWirelessDropdown: React.FC<SelectWirelessDropdownProps> = ({ keyCode, onKeySelect, disable }) => {
  const WirelessButtons: Array<WirelessButton> = useMemo(
    () => [
      { name: i18n.editor.standardView.wireless.batteryLevel, keynum: BatteryCodes.STATUS },
      { name: i18n.wireless.bluetooth.pairingModeButton, keynum: BluetoothCodes.PAIRING },
    ],
    [],
  );

  const KC: number = useMemo(() => keyCode.base + keyCode.modified, [keyCode.base, keyCode.modified]);

  const isActive = useMemo(() => WirelessButtons.some(i => i.keynum === KC), [KC, WirelessButtons]);

  const handleBatteryLevelClick = useCallback(() => {
    onKeySelect(WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].keynum);
  }, [onKeySelect, WirelessButtons]);

  const handlePairingModeClick = useCallback(() => {
    onKeySelect(WirelessButtons[WirelessButtonOrder.PAIRING_MODE].keynum);
  }, [onKeySelect, WirelessButtons]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <PopoverButton active={isActive} disabled={disable}>
          Wireless
        </PopoverButton>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="large-dropdown-inner p-2 rounded-sm bg-gray-25/40 dark:bg-gray-800">
          <div className="dropdown-group">
            <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
              Wireless <span className="text-gray-400 dark:text-gray-50">Battery status</span>
            </Heading>
            <div className="dropdown-group-buttons flex rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              <Button
                variant="config"
                size="sm"
                onClick={handleBatteryLevelClick}
                selected={WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].keynum === KC}
                disabled={WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].keynum === -1}
                key={`buttonWirelessSingleViewBattery-${WirelessButtonOrder.BATTERY_LEVEL}`}
                className="w-full text-center"
              >
                {WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].name}
              </Button>
            </div>
          </div>
          <div className="dropdown-group pt-2 mt-2 border-t border-gray-50 dark:border-gray-700">
            <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
              Bluetooth <span className="text-gray-400 dark:text-gray-50">{i18n.wireless.bluetooth.pairingMode}</span>
            </Heading>
            <div className="dropdown-group-buttons rounded-sm flex p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              <Button
                variant="config"
                size="sm"
                onClick={handlePairingModeClick}
                selected={WirelessButtons[WirelessButtonOrder.PAIRING_MODE].keynum === KC}
                disabled={WirelessButtons[WirelessButtonOrder.PAIRING_MODE].keynum === -1}
                key={`buttonWirelessSingleViewPair-${WirelessButtonOrder.PAIRING_MODE}`}
                className="w-full text-center"
              >
                {WirelessButtons[WirelessButtonOrder.PAIRING_MODE].name}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectWirelessDropdown;
