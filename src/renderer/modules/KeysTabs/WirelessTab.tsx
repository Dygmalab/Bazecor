import React from "react";
import Styled from "styled-components";

import { TabLayoutEditorProps } from "@Renderer/types/pages";

import i18n from "@Renderer/i18n";

import Title from "@Renderer/component/Title";
import Callout from "@Renderer/component/Callout";
import { ButtonConfig } from "@Renderer/component/Button";

const Styles = Styled.div`
width: 100%;
h3 {
    margin-bottom: 16px;
}
h4 {
    font-size: 16px;
    flex: 0 0 100%;
    width: 100%;
    margin-top: 24px;
}
.description {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.macro.descriptionColor};
    font-weight: 500;
}
.keysButtonsList {
    margin-top: 8px;
}
.button-config {
    max-width: 116px;
    text-align: center;
}
`;

function WirelessTab(props: TabLayoutEditorProps) {
  const { keyCode, onKeySelect, isStandardView } = props;
  return (
    <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsWireless`}>
      <div className="tabContentWrapper">
        <div className="buttonsRow">
          <Title text={i18n.app.menu.wireless} headingLevel={3} />
          <Callout content={i18n.editor.standardView.wireless.callOut} size="sm" />
          <div className="keysButtonsList">
            <Title text={i18n.editor.standardView.wireless.batteryPowerStatus} headingLevel={4} />
            <p className="description">{i18n.editor.standardView.wireless.batteryLevelDescription}</p>
            <ButtonConfig
              buttonText={i18n.editor.standardView.wireless.batteryLevel}
              onClick={() => {
                onKeySelect(54108);
              }}
              selected={isStandardView ? keyCode === 54108 : false}
              size={undefined}
              tooltip={undefined}
              tooltipPlacement={undefined}
              tooltipClassName={undefined}
              style={undefined}
              icoSVG={undefined}
              icoPosition={undefined}
              tooltipDelay={undefined}
              disabled={undefined}
              dataAnimate={undefined}
            />
          </div>
          <div className="keysButtonsList">
            <Title text={i18n.wireless.energyManagement.savingMode} headingLevel={4} />
            <p className="description">{i18n.editor.standardView.wireless.savingModeDescription}</p>
            <ButtonConfig
              buttonText={i18n.general.onOff}
              onClick={() => {
                onKeySelect(54109);
              }}
              selected={isStandardView ? keyCode === 54109 : false}
              size={undefined}
              tooltip={undefined}
              tooltipPlacement={undefined}
              tooltipClassName={undefined}
              style={undefined}
              icoSVG={undefined}
              icoPosition={undefined}
              tooltipDelay={undefined}
              disabled={undefined}
              dataAnimate={undefined}
            />
          </div>
          <div className="keysButtonsList">
            <Title text={i18n.editor.standardView.wireless.pairingMode} headingLevel={4} />
            <p className="description">{i18n.editor.standardView.wireless.pairingModeDescription}</p>
            <ButtonConfig
              buttonText={i18n.editor.standardView.wireless.pair}
              onClick={() => {
                onKeySelect(54110);
              }}
              selected={isStandardView ? keyCode === 54110 : false}
              size={undefined}
              tooltip={undefined}
              tooltipPlacement={undefined}
              tooltipClassName={undefined}
              style={undefined}
              icoSVG={undefined}
              icoPosition={undefined}
              tooltipDelay={undefined}
              disabled={undefined}
              dataAnimate={undefined}
            />
          </div>
        </div>
      </div>
    </Styles>
  );
}

export default WirelessTab;
