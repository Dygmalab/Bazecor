/* eslint-disable jsx-a11y/media-has-caption */
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

import React, { useRef, useEffect } from "react";
import Styled from "styled-components";

import videoFirmwareUpdate from "@Assets/videos/update-firmware.mp4";
import videoFirmwareUpdateReleaseKey from "@Assets/videos/release-key.mp4";
import videoFirmwareUpdateDefySRC from "@Assets/videos/update-firmware-defy.mp4";
import videoFirmwareUpdateDefyReleaseSRC from "@Assets/videos/release-key-defy.mp4";

import { FirmwareNeuronHelp, FirmwareDefyUpdatingStatus } from "@Renderer/modules/Firmware";

import { IconCheckmarkSm } from "../../component/Icon";

const Style = Styled.div`   
.updatingRaise {
  margin:auto;
  align-self: center;
  justify-content: center;
}
.blob {
  background: #33d9b2;
  box-shadow: 0 0 0 0 #33d9b2;
  border-radius: 50%;
  margin: 10px;
  height: 8px;
  width: 8px;
  transform: scale(1);

  // animation: pulse-green 2s infinite;
  transform: scale(1);
  box-shadow: 0 0 0 32px rgba(51, 217, 178, 0.15);
}

.key-badge {
  position: absolute;
  z-index: 2;
  color: ${({ theme }) => theme.colors.gray700};
  background-color: rgb(0,205,200);
  padding: 2px 4px;
  bottom: -12px;
  left: 50%;
  margin-left: -63px;
  white-space: nowrap;
  width: 126px;
  border-radius: 18px;
  text-align: center;
  font-size: 0.825rem;
  transition: 300ms color ease-in-out, 300ms background-color ease-in-out, 300ms opacity ease-in-out;
  transform-origin: center center;
  opacity: 0;
  &.key-badge__add {
    opacity: 1;
  }
  &.key-badge__release {
    color: ${({ theme }) => theme.colors.gray25};
    background-color: ${({ theme }) => theme.colors.brandDangerLighter};
    animation: pulse-orange 0.3s alternate infinite;
  }
  &.key-badge__add.key-badge__remove {
    opacity: 0;
  }
}

@keyframes pulse-green {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 42px rgba(51, 217, 178, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 0);
  }
}
@keyframes pulse- {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255,107,107, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 42px rgba(255,107,107, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255,107,107, 0);
  }
}

.processCanvas {
  position: relative;
  canvas {
    max-width: 100%; 
  }
  .status-icon {
    position: absolute;
  }
  &.processRaise .status-icon {
    top: 62px;
    left: 85px;
  }
  &.processDefy .status-icon {
    top: 73px;
    left: 72px;
  }
}
.process-raise,
.process-Raise {
  background-position: left bottom;
  background-repeat: no-repeat;
  background-image: url(${({ theme }) => theme.styles.firmwareUpdateProcess.raiseSVG});
}
.process-defy,
.process-Defy {
  background-position: left bottom;
  background-repeat: no-repeat;
  background-image: url(${({ theme }) => theme.styles.firmwareUpdateProcess.defySVG});
}

`;
/**
 * This FirmwareImageHelp function returns a video that reacts according the firmware update status
 * The object will accept the following parameters
 *
 * @param {number} countdown - Number representing the position during the update process
 * @returns {<FirmwareImageHelp>} FirmwareImageHelp component.
 */
interface FirmwareImageHelpProps {
  countdown: number;
  deviceProduct: string;
  keyboardType: string;
  steps: Array<string | number>;
  error: boolean;
  retriesLeft: number | undefined;
  retriesRight: number | undefined;
  retriesDefyWired: number | undefined;
}

const FirmwareImageHelp: React.FC<FirmwareImageHelpProps> = ({
  countdown,
  deviceProduct,
  keyboardType,
  steps,
  error,
  retriesLeft,
  retriesRight,
  retriesDefyWired,
}) => {
  const videoIntro = useRef<HTMLVideoElement | null>(null);
  const videoIntroDefy = useRef<HTMLVideoElement | null>(null);
  const videoReleaseDefy = useRef<HTMLVideoElement | null>(null);
  const videoRelease = useRef<HTMLVideoElement | null>(null);
  const checkSuccess = useRef(null);

  const playVideo = () => {
    if (deviceProduct === "Raise" && videoIntro.current) {
      videoIntro.current.currentTime = 3;
      videoIntro.current.play();
    } else if (deviceProduct === "Defy" && videoIntroDefy.current) {
      videoIntroDefy.current.currentTime = 3;
      videoIntroDefy.current.play();
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      if (deviceProduct === "Raise") {
        videoIntro.current.addEventListener("ended", playVideo, false);
        videoRelease.current.pause();
      } else {
        videoIntroDefy.current.addEventListener("ended", playVideo, false);
        videoReleaseDefy.current.pause();
      }
      checkSuccess.current.classList.remove("animInCheck");
    }
    if (countdown === 1) {
      if (deviceProduct === "Raise") {
        videoIntro.current.classList.add("animOut");
        videoRelease.current.classList.add("animPressDown");
      } else {
        videoIntroDefy.current.classList.add("animOut");
        videoReleaseDefy.current.classList.add("animIn");
        videoReleaseDefy.current.play();
      }
      checkSuccess.current.classList.remove("animInCheck");
    }
    if (countdown === 2) {
      if (deviceProduct === "Raise") {
        videoRelease.current.play();
      }
      checkSuccess.current.classList.remove("animInCheck");
    }
    if (countdown === steps.length - 2) {
      checkSuccess.current.classList.add("animInCheck");
    }
    return () => {
      if (videoIntro.current && countdown === 0 && deviceProduct === "Raise") {
        videoIntro.current.removeEventListener("ended", playVideo, false);
      } else if (videoIntroDefy.current && countdown === 0 && deviceProduct === "Defy") {
        videoIntroDefy.current.removeEventListener("ended", playVideo, false);
      }
    };
  }, [countdown, deviceProduct, steps]);

  return (
    <Style>
      <div className="process-row process-header">
        <div className="process-col process-image">
          <div className="videoWrapper">
            <div className="videoInner">
              <div className="firmwareCheck animWaiting" ref={checkSuccess}>
                <IconCheckmarkSm />
              </div>
              {deviceProduct === "Raise" ? (
                <>
                  <video ref={videoIntro} width={520} height={520} autoPlay className="img-center img-fluid">
                    <source src={videoFirmwareUpdate} type="video/mp4" />
                  </video>
                  <video
                    ref={videoRelease}
                    width={520}
                    height={520}
                    autoPlay={false}
                    className={`img-center img-fluid animWaiting ${countdown >= 2 ? "animaReleaseKey" : null}`}
                  >
                    <source src={videoFirmwareUpdateReleaseKey} type="video/mp4" />
                  </video>
                  <div
                    className={`key-badge ${countdown >= 1 ? "key-badge__add" : null} ${
                      countdown === 2 || countdown === 3 ? "key-badge__release" : null
                    } ${countdown > 4 ? "key-badge__remove" : null}`}
                  >
                    {countdown === 1 ? "Keep holding" : null} {countdown === 2 || countdown === 3 ? "Release key" : null}
                  </div>
                </>
              ) : (
                <>
                  <video ref={videoIntroDefy} width={520} height={520} autoPlay className="img-center img-fluid animIn">
                    <source src={videoFirmwareUpdateDefySRC} type="video/mp4" />
                  </video>
                  <video
                    ref={videoReleaseDefy}
                    width={520}
                    height={520}
                    autoPlay={false}
                    className="img-center img-fluid animWaiting"
                  >
                    <source src={videoFirmwareUpdateDefyReleaseSRC} type="video/mp4" />
                  </video>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={`process-col process-neuron ${countdown === 0 ? `process-${deviceProduct}` : ""}`}>
          {countdown === 0 ? (
            <div className={`processCanvas process${deviceProduct}`}>
              <div className="status-icon">
                <div className="blob green pulse-green" />
              </div>
              <canvas className="" width={340} height={259} />
            </div>
          ) : (
            <div className={`${deviceProduct === "Defy" ? "updatingDefy" : ""} updatingRaise`}>
              {deviceProduct === "Defy" ? (
                <FirmwareDefyUpdatingStatus
                  countdown={countdown}
                  keyboardType={keyboardType}
                  retriesLeft={retriesLeft}
                  retriesRight={retriesRight}
                  retriesDefyWired={retriesDefyWired}
                />
              ) : (
                <FirmwareNeuronHelp countdown={countdown} deviceProduct={deviceProduct} steps={steps} error={error} />
              )}
            </div>
          )}
        </div>
      </div>
    </Style>
  );
};

export default FirmwareImageHelp;
