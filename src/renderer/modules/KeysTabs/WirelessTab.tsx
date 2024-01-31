import React from "react";
import Styled from "styled-components";

import { TabLayoutEditorProps } from "@Renderer/types/pages";

import { i18n } from "@Renderer/i18n";

import Title from "@Renderer/component/Title";
import { Alert, AlertDescription } from "@Renderer/components/ui/alert";
import { ButtonConfig } from "@Renderer/component/Button";
import { BatteryCodes } from "@Renderer/../hw/battery";
import { BluetoothCodes } from "@Renderer/../hw/bluetooth";

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
          <Alert size="sm">
            <AlertDescription>
              <p>{i18n.editor.standardView.wireless.callOut}</p>
            </AlertDescription>
          </Alert>
          <div className="keysButtonsList">
            <Title text={i18n.editor.standardView.wireless.batteryPowerStatus} headingLevel={4} />
            <p className="description">{i18n.editor.standardView.wireless.batteryLevelDescription}</p>
            <ButtonConfig
              buttonText={i18n.editor.standardView.wireless.batteryLevel}
              onClick={() => {
                onKeySelect(BatteryCodes.STATUS);
              }}
              selected={isStandardView ? keyCode === BatteryCodes.STATUS : false}
              size={undefined}
              tooltip={undefined}
              tooltipPlacement={undefined}
              tooltipClassName={undefined}
              variation={undefined}
              icoSVG={undefined}
              icoPosition={undefined}
              tooltipDelay={undefined}
              disabled={undefined}
              dataAnimate={undefined}
            />
          </div>
          <div className="keysButtonsList">
            <Title text={i18n.wireless.bluetooth.pairingMode} headingLevel={4} />
            <p className="description">{i18n.wireless.bluetooth.pairingModeDescription}</p>
            <ButtonConfig
              buttonText={i18n.wireless.bluetooth.pair}
              onClick={() => {
                onKeySelect(BluetoothCodes.PAIRING);
              }}
              selected={isStandardView ? keyCode === BluetoothCodes.PAIRING : false}
              size={undefined}
              tooltip={undefined}
              tooltipPlacement={undefined}
              tooltipClassName={undefined}
              variation={undefined}
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
