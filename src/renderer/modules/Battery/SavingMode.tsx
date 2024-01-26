import React from "react";
import Styled from "styled-components";

import Form from "react-bootstrap/Form";

// Internal components
import { Switch } from "@Renderer/components/ui/switch";
import Title from "@Renderer/component/Title";

import { EnergyManagementProps } from "@Renderer/types/wireless";
import i18n from "../../i18n";

const Styles = Styled.div`
h5 {
  font-size: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.styles.energyManagement.borderColor};
  color: ${({ theme }) => theme.styles.energyManagement.lowPowerModeTitleColor};
  padding-bottom: 0.5rem;
  margin: 1.5rem 0 0 0;
}
.settingsWrapper {
  display: flex;
  align-items: center;
  grid-gap: 1rem; 
  justify-content: space-between;
  padding: 1rem 0;
}
.settingsContent {
  h4 {
    font-size: 0.915rem;
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.styles.energyManagement.titleColor};
  }
  p {
    font-size: 0.815rem;
    font-weight: 401;
    margin: 0;
    color: ${({ theme }) => theme.styles.energyManagement.descriptionColor};
    small {
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 401;
      opacity: 0.8;
    }
  }
  p + p {
    margin-top: 0.25rem;
  }
}
.settingsActions {
  .custom-switch {
    width: 60px;
  }
}
`;

function SavingMode({ wireless, changeWireless }: EnergyManagementProps) {
  const toggleSavingBatteryMode = () => {
    const newWireless = { ...wireless };
    newWireless.battery.savingMode = !wireless.battery.savingMode;
    changeWireless(newWireless);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-50 dark:border-gray-700">
        <div className="flex flex-col gap-1">
          <label htmlFor="settingSavingMode" className="m-0 text-sm font-semibold tracking-tight">
            Enable saving mode
          </label>
          {/* <p className="text-sm text-gray-400 dark:text-gray-300">{i18n.wireless.energyManagement.savingModeDesc}</p> */}
        </div>
        <Switch
          id="settingSavingMode"
          value={wireless.battery ? 1 : 0}
          checked={wireless.battery ? wireless.battery.savingMode : false}
          onCheckedChange={toggleSavingBatteryMode}
          variant="default"
          size="sm"
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-300">{i18n.wireless.energyManagement.savingModeInfo}</p>
    </div>
  );
}

export default SavingMode;
