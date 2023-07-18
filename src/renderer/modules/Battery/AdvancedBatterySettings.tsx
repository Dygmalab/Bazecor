import React from "react";
import Styled from "styled-components";

import Title from "@Renderer/component/Title";
import { IconSettings } from "@Renderer/component/Icon";
import { RegularButton } from "@Renderer/component/Button";
import i18n from "../../i18n";

const Styles = Styled.div`

`;

function AdvancedBatterySettings() {
  return (
    <Styles>
      <div className="settingsWrapper">
        <div className="settingsContent">
          <Title text="Advanced settings" headingLevel={4} />
          <p>Settings applied when the low-power mode is off</p>
        </div>
        <div className="settingsActions">
          <RegularButton
            icoSVG={<IconSettings />}
            style="short danger"
            onClick={() => {console.log("clicked")}}
          />
        </div>
      </div>
    </Styles>
  );
}

export default AdvancedBatterySettings;
