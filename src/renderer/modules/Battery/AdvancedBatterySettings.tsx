import React from "react";
import Styled from "styled-components";

import Heading from "@Renderer/components/atoms/Heading";
import { IconSettings } from "@Renderer/components/atoms/icons";
import { RegularButton } from "@Renderer/component/Button";
import { i18n } from "@Renderer/i18n";

const Styles = Styled.div`
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
  }
}
.settingsActions {
  button.short {
    width: 40px;
    padding: 0;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.styles.energyManagement.shortButtonColor};
  }
}
`;

function AdvancedBatterySettings() {
  return (
    <Styles>
      <div className="settingsWrapper">
        <div className="settingsContent">
          <Heading headingLevel={4}>{i18n.wireless.energyManagement.advancedSettings}</Heading>
          <p>{i18n.wireless.energyManagement.advancedSettingsDesc}</p>
        </div>
        <div className="settingsActions">
          <RegularButton icoSVG={<IconSettings />} styles="short" />
        </div>
      </div>
    </Styles>
  );
}

export default AdvancedBatterySettings;
