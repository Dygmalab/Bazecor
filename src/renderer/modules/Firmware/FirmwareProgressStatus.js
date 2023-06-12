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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import i18n from "../../i18n";
import ProgressBar from "react-bootstrap/ProgressBar";

import Title from "../../component/Title";
import { StepsProgressBar } from "../../component/StepsBar";
import { FirmwareImageHelp } from "../Firmware";
import { CircleLoader } from "../../component/Loader";

const Style = Styled.div`     
width: 100%;
.process-header {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  height: 260px;
  .img-center {
    margin: auto;
    max-width: 162px;
    border-radius:16px;
    display: block;
    align-self: center;
  } 
  .process-image {
    display: flex;
    flex: 0 0 50%;
    height: inherit;
    background-color: ${({ theme }) => theme.styles.firmwareUpdateProcess.processImageBackground};
    border-top-left-radius: 16px;
    position: relative; 
    .img-center {
      width: 162px;     
      position: absolute;
    }
  }
  .process-neuron {
    display: flex;
    flex: 0 0 50%;
    height: inherit;
    background-color: ${({ theme }) => theme.styles.firmwareUpdateProcess.processNeuronBackground};
    border-top-right-radius: 16px;
  }
  .videoWrapper{
    position: relative;
    left: 50%;
    top: 50%;
    width: 162px; 
    height: 162px;
    transform: translate3d(-50%, -50%, 0);
  }
  .videoInner{
    position: relative;
    width: 162px; 
    height: 162px;
  } 
  .firmwareCheck {  
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    width: 74px;
    height: 74px;
    line-height: 69px;
    text-align: center;
    border-radius: 50%;
    background-color: rgba(0, 206, 201, 0.8);   
    transform-origin: center center;
    transform: scale(0) translate3d(-50%, -50%, 0);
    opacity: 0;
    color: white;
    svg {
      transform: scale(1.5);
    }
  }
}
.process-footer {
  width: 100%;
  padding: 24px;
  background-color: ${({ theme }) => theme.styles.firmwareUpdateProcess.processFooterBackground}; 
  border-radius: 0px 0px 16px 16px;
  text-align: center;
  h6 {
    font-weight: 395;
    letter-spacing:0;
    font-size: 15px;
  }
}
.partialLoader {
  display: grid;
  padding: 0 39px;
  z-index: 2;
  position: relative;
  > div {
    height: 0;
    position: relative;
    width: 24px;
  }
  &.partialLoader--Raise {
    grid-template-columns: repeat(3, 1fr);
  }
  .circle-loader {
    position: absolute;
    display: block;
    transform: translate(-50%, -50%);
    left: 0;
    top: -4px;
    opacity: 0;
    transition: opacity 250ms ease-in-out;
    &.active {
      opacity: 0.4;
    }
  }
}
`;

/**
 * This FirmwareProgressStatus function returns a card with text and images that reacts according the process update
 * The object will accept the following parameters
 *
 * @param {number} countdown - A number that represents the actual step on the firmware update process.
 * @param {number} flashProgress - The value used to render the progress bar.
 * @returns {<FirmwareProgressStatus>} FirmwareProgressStatus component.
 */

const FirmwareProgressStatus = ({
  countdown,
  flashProgress,
  leftProgress,
  rightProgress,
  resetProgress,
  neuronProgress,
  restoreProgress,
  deviceProduct,
  keyboardType,
  steps
}) => {
  let [stepsPosition, setStepsPosition] = useState(0);
  useEffect(() => {
    setStepsPosition(steps.findIndex(x => x.step === countdown));
  }, [countdown]);
  return (
    <Style>
      <div className="mainProcessWrapper">
        <FirmwareImageHelp
          countdown={stepsPosition}
          steps={steps}
          error={stepsPosition == steps.length - 1 ? true : false}
          deviceProduct={deviceProduct}
          keyboardType={keyboardType}
        />
        <div className="process-row">
          <StepsProgressBar steps={steps} stepActive={stepsPosition} />
          <ProgressBar>
            <ProgressBar striped animated now={flashProgress} />
          </ProgressBar>
          <div className={`partialLoader partialLoader--${deviceProduct}`}>
            {deviceProduct == "Defy" ? (
              <>
                <CircleLoader radius={13} percentage={leftProgress} active={stepsPosition == 1 ? true : false} />
                <CircleLoader radius={13} percentage={rightProgress} active={stepsPosition == 2 ? true : false} />
              </>
            ) : (
              <>
                <CircleLoader
                  radius={13}
                  percentage={resetProgress}
                  active={
                    (deviceProduct == "Raise" && stepsPosition == 1) || (deviceProduct == "Defy" && stepsPosition == 3)
                      ? true
                      : false
                  }
                />
                <CircleLoader
                  radius={13}
                  percentage={neuronProgress}
                  active={
                    (deviceProduct == "Raise" && stepsPosition == 2) || (deviceProduct == "Defy" && stepsPosition == 4)
                      ? true
                      : false
                  }
                />
                <CircleLoader
                  radius={13}
                  percentage={restoreProgress}
                  active={
                    (deviceProduct == "Raise" && stepsPosition == 3) || (deviceProduct == "Defy" && stepsPosition == 5)
                      ? true
                      : false
                  }
                />
              </>
            )}
          </div>
        </div>
        <div className="process-row process-footer">
          {stepsPosition == 0 ? (
            <Title text={i18n.firmwareUpdate.texts.flashCardTitle1} headingLevel={3} color="success" />
          ) : (
            <Title
              text={steps[stepsPosition].title}
              headingLevel={3}
              color={stepsPosition == steps.length - 1 ? "warning" : "success"}
            />
          )}

          {stepsPosition == 0 ? (
            <Title text={i18n.firmwareUpdate.texts.flashCardTitle2} headingLevel={6} />
          ) : (
            <Title text={steps[stepsPosition].description} headingLevel={6} />
          )}
        </div>
      </div>
    </Style>
  );
};

export default FirmwareProgressStatus;
