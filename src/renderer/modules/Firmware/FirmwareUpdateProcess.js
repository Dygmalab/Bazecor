// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import i18n from "../../i18n";

import Title from "../../component/Title";
import { RegularButton } from "../../component/Button";

import { FirmwareProgressStatus } from "../Firmware";
import StepsBar from "../../component/StepsBar";

import { IconInformationBubbleSm, IconCheckmarkSm, IconKeysPress, IconKeysRelease } from "../../component/Icon";

const Style = Styled.div`   
width: 100%;  
height:inherit;
.firmware-wrapper {
  max-width: 680px;   
  width: 100%;
  margin: auto;
  .firmware-row {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
  }
  .firmware-content {
    flex: 0 0 66%;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundContent}; 
  }
  .firmware-sidebar {
    flex: 0 0 34%;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundSidebar}; 
  }
  .firmware-content--inner {
    padding: 32px;
  }
  .borderLeftTopRadius {
    border-top-left-radius: 14px;
  } 
  .borderRightTopRadius {
    border-top-right-radius: 14px;
  }
  .borderLeftBottomRadius {
    border-bottom-left-radius: 14px;
  } 
  .borderRightBottomRadius {
    border-bottom-right-radius: 14px;
  }
}
.firmware-footer {
  width: 100%;
  margin-top: 62px;
}
.holdButton { 
  margin-bottom: 32px;
}
.holdTootip {
  h6 {
    font-size: 13px;  
    font-weight: 395;
    letter-spacing: 0;
    color:  ${({ theme }) => theme.colors.gray300}; 
  }
}
.progress-visualizer {
  margin-top: 162px;
}
`;

/**
 * This FirmwareUpdateProcess function returns a card with text and images that reacts according the process update
 * The object will accept the following parameters
 *
 * @param {function} onCancelDialog - The function used to cancel the update process.
 * @param {number} flashProgress - The value used to render the progress bar.
 * @param {number} countdown - A number that represents the actual step on the firmware update process.
 * @returns {<FirmwareUpdateProcess>} FirmwareUpdateProcess component.
 */

const FirmwareUpdateProcess = ({ onCancelDialog, flashProgress, countdown }) => {
  const [simulateCountdown, setSimulateCountdown] = useState(1);
  // used to set the stepbar position
  // const steps = [
  //   {
  //     icon: <IconInformationBubbleSm />
  //   },
  //   {
  //     icon: <IconKeysPress />
  //   },
  //   {
  //     icon: <IconKeysRelease />
  //   },
  //   {
  //     icon: <IconCheckmarkSm />
  //   }
  // ];

  return (
    <Style>
      <div className="firmware-wrapper upgrade-firmware">
        <div className="firmware-row">{/* <StepsBar steps={steps} stepActive={countdown - 1} /> */}</div>
        <div className="firmware-row progress-visualizer">
          <FirmwareProgressStatus
            flashProgress={flashProgress}
            countdown={simulateCountdown}
            deviceProduct="Defy"
            keyboardType="wireless"
          />
        </div>
        {simulateCountdown <= 1 ? (
          <div className="firmware-footer">
            <div className="holdButton">
              <RegularButton
                className="flashingbutton nooutlined"
                style="outline"
                size="sm"
                buttonText={i18n.firmwareUpdate.texts.cancelButton}
                onClick={onCancelDialog}
              />
            </div>
            <div className="holdTootip">
              <Title
                text={i18n.firmwareUpdate.texts.flashCardHelp}
                headingLevel={6}
                tooltip={i18n.firmwareUpdate.texts.flashCardHelpTooltip}
                tooltipSize="wide"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <RegularButton
        onClick={() => setSimulateCountdown(simulateCountdown + 1)}
        style="primary"
        buttonText="Simulate next step"
      />
      {simulateCountdown}
    </Style>
  );
};

export default FirmwareUpdateProcess;
