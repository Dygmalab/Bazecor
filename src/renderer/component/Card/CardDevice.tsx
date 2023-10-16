import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

import Heading from "@Renderer/component/Heading";
import { IconSettings } from "@Renderer/component/Icon";
import bgTexture from "@Assets/base/bg-texture-with-lines.jpg";

import { DevicePreview } from "@Renderer/modules/DevicePreview";

import Styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CardWrapper = Styled.div`
  display: flex;
  //width: clamp(340px, 60%, 520px);
  &.card {
    padding: 0;
    border-radius: 24px;
    border: 2px solid ${({ theme }) => theme.colors.gray600};
    background-position: right top;
    background-repeat: no-repeat;
    background-image: ${`url(${bgTexture})`};
    background-size: cover;
    overflow: hidden;
    transition: 300ms ease-in-out border-color;
  }
  &.card-connected {
    border: 2px solid ${({ theme }) => theme.colors.brandSuccess};
  }
  &.card-offline {
    position: relative;
    isolation: isolate;
    &:before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(48, 49, 73, 0.60) 1.33%, rgba(48, 57, 73, 0.00) 51.04%, rgba(48, 57, 73, 0.35) 100%), rgba(48, 51, 73, 0.60);
    }
    .device-preview {
      position: relative;
      z-index: -1;
    }
    .device-status {
      color: ${({ theme }) => theme.colors.brandDangerLighter};
      font-size: 0.8em;
    }
  }
  .card-header {
    position: relative;
    background: transparent;
    border: none;
    padding-top: 32px;
    min-height: 140px;
    h3 {
      font-size: 1.5em;
      margin: 0 0 0.5em 0;
    }
    h4 {
      font-size: 1em;
      color: ${({ theme }) => theme.colors.gray50};
    }
    h5 {
      font-size: 0.685em;
      color: ${({ theme }) => theme.colors.gray100};
      text-transform: none;
      letter-spacing: 0;
    }
    .bullet-connect {
      position: absolute;
      right: 24px;
      top: 24px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.colors.gray200};
      &.connected {
        background-color: ${({ theme }) => theme.colors.brandSuccess};
      }
    }
  }
  .device-preview {
    margin-bottom: -20%;
    margin-top: -14%;
    display: flex;
    justify-content: flex-end;
    canvas {
      transform: translateX(24%);
    }
  }
  .button {
    margin: 0;
    height: 52px;
    &:focus, &:focus-within {
      box-shadow: none;
    }
  }
  .card-footer {
    background: transparent;
    border: none;
    padding: 2px;
    margin-top: auto;
    .card-footer--inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 18px;
      padding: 16px;
      background: rgba(48, 51, 73, 0.60);
      backdrop-filter: blur(3px);
    }
  }
  .buttonToggler.dropdown-toggle.btn.btn-primary {
    width: 52px;
    height: 52px;
    &:hover {
      background-color: rgba(240, 242, 244, 0.05);
    }
  }
`;

const CardDevice = ({ device }) => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const handlePreferences = () => {
    if (isConnected) {
      navigate("/preferences");
    }
  };
  return (
    <CardWrapper
      className={`card card-device ${isConnected ? "card-connected" : "card-disconnected"} ${
        device.available ? "card-online" : "card-offline"
      }`}
    >
      <div className="card-header">
        {device.name ? (
          <>
            <Heading headingLevel={3}>{device.name}</Heading>
            <Heading headingLevel={4}>
              {device.device.info.displayName} {device.device.info.product === "Raise" ? device.device.info.keyboardType : null}
            </Heading>
          </>
        ) : (
          <Heading headingLevel={3}>
            {device.device.info.displayName} {device.device.info.product === "Raise" ? device.device.info.keyboardType : null}
          </Heading>
        )}
        <Heading headingLevel={5}>{device.path}</Heading>
        <span className={`bullet-connect ${isConnected ? "connected" : "disconnected"}`}>&nbsp;</span>
      </div>
      <DevicePreview deviceName={device.device.info.displayName} isConnected={isConnected} />
      <div className="card-footer">
        <div className="card-footer--inner">
          {device.available ? (
            <button
              type="button"
              onClick={() => setIsConnected(!isConnected)}
              className={`button ${isConnected ? "outline transp-bg" : "primary"}`}
            >
              {isConnected ? "Disconnect from Bazecor" : "Connect"}
            </button>
          ) : (
            <span className="device-status">Offline</span>
          )}
          <Dropdown>
            <Dropdown.Toggle className="buttonToggler">
              <div className="buttonTogglerInner">
                <IconSettings />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdownMenu">
              <div className="dropdownMenuPadding">
                <Dropdown.Item disabled={!isConnected} onClick={handlePreferences}>
                  <div className="dropdownItem">Settings</div>
                </Dropdown.Item>
                <Dropdown.Item disabled={isConnected}>
                  <div className="dropdownItem">Forget this device</div>
                </Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </CardWrapper>
  );
};

export default CardDevice;
