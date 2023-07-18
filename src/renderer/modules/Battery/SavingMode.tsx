import React from "react";

import Form from "react-bootstrap/Form";
import i18n from "../../i18n";

interface SavingModeProps {
  wireless: {
    battery: {
      LeftLevel?: number;
      LeftState?: number;
      RightLevel?: number;
      RightState?: number;
      savingMode?: boolean;
    };
  };
  toggleSavingMode: Promise<void>;
}

function SavingMode({ wireless, toggleSavingMode }: SavingModeProps) {
  return (
    <div>
      <Form className="batterySettingItem batterySetSavingMode">
        <div className="batterySettingLabel">Saving Mode</div>
        <Form.Check
          type="switch"
          id="settingSavingMode"
          checked={wireless.battery ? wireless.battery.savingMode : false}
          onChange={() => toggleSavingMode}
        />
      </Form>
      <div
        className="savingModedescription"
        dangerouslySetInnerHTML={{ __html: i18n.wireless.batteryPreferences.savingModeDescription }}
      />
    </div>
  );
}

export default SavingMode;
