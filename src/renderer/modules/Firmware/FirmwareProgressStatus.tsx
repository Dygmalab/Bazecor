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
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import StepsProgressBar from "@Renderer/components/atoms/stepsBar/StepsProgressBar";
import { Progress } from "@Renderer/components/atoms/Progress";
import CircleLoader from "@Renderer/components/atoms/loader/CircleLoader";
import Heading from "@Renderer/components/atoms/Heading";
import FirmwareImageHelp from "./FirmwareImageHelp";

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
  .circle-loader {
    position: absolute;
    display: block;
    transform: translate(-50%, -50%);
    left: 0.5px;
    top: -4px;
    opacity: 0;
    transition: opacity 250ms ease-in-out;
    &.active {
      opacity: 0.4;
    }
  }
}
.progress {
  margin-left: 32px;
}
`;

interface FirmwareProgressStatusType {
  countdown: number;
  flashProgress: number;
  leftProgress: any;
  retriesLeft: any;
  rightProgress: any;
  retriesRight: any;
  resetProgress: any;
  neuronProgress: any;
  retriesNeuron: any;
  retriesDefyWired: any;
  restoreProgress: any;
  deviceProduct: any;
  keyboardType: any;
  steps: any;
}

const FirmwareProgressStatus = (props: FirmwareProgressStatusType) => {
  const {
    countdown,
    flashProgress,
    leftProgress,
    retriesLeft,
    rightProgress,
    retriesRight,
    resetProgress,
    neuronProgress,
    retriesNeuron,
    retriesDefyWired,
    restoreProgress,
    deviceProduct,
    keyboardType,
    steps,
  } = props;
  const [stepsPosition, setStepsPosition] = useState(0);
  useEffect(() => {
    setStepsPosition(steps.findIndex((x: { step: number }) => x.step === countdown));
  }, [countdown, steps]);
  return (
    <Style>
      <div className="mainProcessWrapper">
        <FirmwareImageHelp
          countdown={stepsPosition}
          steps={steps}
          error={stepsPosition === steps.length - 1}
          deviceProduct={deviceProduct}
          keyboardType={keyboardType}
          retriesLeft={retriesLeft}
          retriesRight={retriesRight}
          retriesNeuron={retriesNeuron}
          retriesDefyWired={retriesDefyWired}
        />
        <div className="process-row">
          <StepsProgressBar steps={steps} stepActive={stepsPosition} />
          <Progress variant="animated" value={flashProgress} className="mt-[-6px]" />
          {/* <ProgressBar>
            <ProgressBar striped animated now={flashProgress} />
          </ProgressBar> */}
          <div
            className={`partialLoader partialLoader--${deviceProduct}`}
            style={{ gridTemplateColumns: `repeat(${steps.length - 3}, 1fr)` }}
          >
            {deviceProduct !== "Raise" ? (
              <>
                <CircleLoader radius={13} percentage={rightProgress} active={stepsPosition === 1} />
                <CircleLoader radius={13} percentage={leftProgress} active={stepsPosition === 2} />
              </>
            ) : (
              ""
            )}
            <CircleLoader
              radius={13}
              percentage={resetProgress}
              active={
                !!((deviceProduct === "Raise" && stepsPosition === 1) || (deviceProduct !== "Raise" && stepsPosition === 3))
              }
            />
            <CircleLoader
              radius={13}
              percentage={neuronProgress}
              active={
                !!((deviceProduct === "Raise" && stepsPosition === 2) || (deviceProduct !== "Raise" && stepsPosition === 4))
              }
            />
            <CircleLoader
              radius={13}
              percentage={restoreProgress}
              active={
                !!((deviceProduct === "Raise" && stepsPosition === 3) || (deviceProduct !== "Raise" && stepsPosition === 5))
              }
            />
          </div>
        </div>
        <div className="process-row process-footer">
          {stepsPosition === 0 ? (
            <Heading headingLevel={3} renderAs="h4" variant="success">
              {deviceProduct === "Raise"
                ? i18n.firmwareUpdate.texts.flashCardTitle1
                : i18n.firmwareUpdate.texts.flashCardTitleDefy1}
            </Heading>
          ) : (
            <Heading headingLevel={3} renderAs="h4" variant={stepsPosition === steps.length - 1 ? "warning" : "success"}>
              {steps[stepsPosition].title}
            </Heading>
          )}
          {stepsPosition === 0 ? (
            <Heading headingLevel={4} renderAs="paragraph-sm">
              {deviceProduct === "Raise"
                ? i18n.firmwareUpdate.texts.flashCardTitle2
                : i18n.firmwareUpdate.texts.progressCardTitleDefy2}
            </Heading>
          ) : (
            <Heading headingLevel={4} renderAs="paragraph-sm">
              {steps[stepsPosition].description}
            </Heading>
          )}
        </div>
      </div>
    </Style>
  );
};

export default FirmwareProgressStatus;
