import React, { useState } from "react";
import Styled from "styled-components";

import Title from "@Renderer/component/Title";
import { IconSettings } from "@Renderer/component/Icon";
import { RegularButton } from "@Renderer/component/Button";
import { AdvancedBatterySettingsModal } from "@Renderer/component/Modal";
import i18n from "../../i18n";

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
  const [showModal, setShowModal] = useState(false);
  return (
    <Styles>
      <div className="settingsWrapper">
        <div className="settingsContent">
          <Title text={i18n.wireless.energyManagement.advancedSettings} headingLevel={4} />
          <p>{i18n.wireless.energyManagement.advancedSettingsDesc}</p>
        </div>
        <div className="settingsActions">
          <RegularButton icoSVG={<IconSettings />} styles="short" onClick={() => setShowModal(true)} />
        </div>
      </div>
      <AdvancedBatterySettingsModal showModal={showModal} setShowModal={setShowModal} />
    </Styles>
  );
}

export default AdvancedBatterySettings;
