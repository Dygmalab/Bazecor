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
  width: clamp(320px, 40%, 520px);
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
  .card-header {
    position: relative;
    background: transparent;
    border: none;
    padding-top: 32px;
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
    height: 58px;
    &:focus, &:focus-within {
      box-shadow: none;
    }
  }
  .card-footer {
    background: transparent;
    border: none;
    padding: 2px;
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
    width: 58px;
    height: 58px;
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
    <CardWrapper className={`card card-device ${isConnected ? "card-connected" : "card-disconnected"}`}>
      <div className="card-header">
        <Heading headingLevel={3}>Captain Pinky Killer</Heading>
        <Heading headingLevel={4}>Dygma Raise ANSI</Heading>
        <Heading headingLevel={5}>/dev/tty.usbmodem11301</Heading>
        <span className={`bullet-connect ${isConnected ? "connected" : "disconnected"}`}>&nbsp;</span>
      </div>
      <DevicePreview deviceName="Raise" isConnected={isConnected} />
      <div className="card-footer">
        <div className="card-footer--inner">
          <button
            type="button"
            onClick={() => setIsConnected(!isConnected)}
            className={`button ${isConnected ? "outline transp-bg" : "primary"}`}
          >
            {isConnected ? "Disconnect from Bazecor" : "Connect"}
          </button>
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
