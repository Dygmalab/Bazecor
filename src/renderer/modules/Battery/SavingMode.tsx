import React from "react";

// Internal components
import { Switch } from "@Renderer/components/atoms/Switch";
import { Label } from "@Renderer/components/atoms/Label";

import { EnergyManagementProps } from "@Renderer/types/wireless";
import { i18n } from "@Renderer/i18n";

function SavingMode({ wireless, changeWireless }: EnergyManagementProps) {
  const toggleSavingBatteryMode = () => {
    const newWireless = { ...wireless };
    newWireless.battery.savingMode = !wireless.battery.savingMode;
    changeWireless(newWireless);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-50 dark:border-gray-700">
        <div className="flex gap-1 justify-between items-center w-full">
          <Label htmlFor="settingSavingMode" className="m-0 text-sm font-semibold tracking-tight">
            Enable saving mode
          </Label>
          <Switch
            id="settingSavingMode"
            value={wireless.battery ? 1 : 0}
            checked={wireless.battery ? wireless.battery.savingMode : false}
            onCheckedChange={toggleSavingBatteryMode}
            variant="default"
            size="sm"
          />

          {/* <p className="text-sm text-gray-400 dark:text-gray-300">{i18n.wireless.energyManagement.savingModeDesc}</p> */}
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-300">{i18n.wireless.energyManagement.savingModeInfo}</p>
    </div>
  );
}

export default SavingMode;
