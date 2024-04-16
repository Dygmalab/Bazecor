import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

import Heading from "@Renderer/components/ui/heading";
import { IconSettings } from "@Renderer/component/Icon";

import { DevicePreview } from "@Renderer/modules/DevicePreview";

import Styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CardWrapper = Styled.div`
  
  &.card-offline {
    &:before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.styles.card.cardDevice.cardOverlayOffline};
    }
    .device-preview {
      position: relative;
      z-index: -1;
      canvas {
        opacity: ${({ theme }) => theme.styles.card.cardDevice.canvasOpacity};
      }
    }
    .device-status {
      color: ${({ theme }) => theme.colors.brandDangerLighter};
      font-size: 0.8em;
    }
  }
  .card-header {
    
    h3 {
      font-size: 1.5em;
      margin: 0 0 0.5em 0;
      color: ${({ theme }) => theme.styles.card.cardDevice.cardTitleColor};
    }
    h4 {
      font-size: 1em;
      color: ${({ theme }) => theme.styles.card.cardDevice.cardSubTitleColor};
    }
    h5 {
      font-size: 0.685em;
      color: ${({ theme }) => theme.styles.card.cardDevice.cardPathColor};
      text-transform: none;
      letter-spacing: 0;
    }
    
  }
  .device-preview {
    margin-bottom: -20%;
    margin-top: -14%;
    display: flex;
    justify-content: flex-end;
    canvas {
      transform: translateX(24%);
      transition: 300ms ease-in-out opacity;
    }
  }
  .button {
    margin: 0;
    height: 52px;
    &:focus, &:focus-within {
      box-shadow: none;
    }
  }
  // .card-footer {
  //   background: transparent;
  //   border: none;
  //   padding: 2px;
  //   margin-top: auto;
  //   .card-footer--inner {
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     border-radius: 18px;
  //     padding: 16px;
  //     background: ${({ theme }) => theme.styles.card.cardDevice.cardFooterBg};
  //     backdrop-filter: blur(3px);
  //   }
  // }
  .buttonToggler.dropdown-toggle.btn.btn-primary {
    width: 52px;
    height: 52px;
    &:hover {
      background-color: ${({ theme }) => theme.styles.card.cardDevice.dropdownBgColor};
    }
  }
  .dropdown-item.disabled {
    color: ${({ theme }) => theme.styles.card.cardDevice.dropdownDisabledColor};
  }

`;

const CardDevice = (props: any) => {
  const { device, filterBy } = props;
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();

  const handlePreferences = () => {
    if (isConnected) {
      navigate("/preferences");
    }
  };

  const filterAttribute = (filter: any) => {
    switch (filter) {
      case true:
        return "show-online";
        break;
      case false:
        return "show-offline";
        break;
      default:
        return "all";
    }
  };
  return (
    <CardWrapper
      className={`card-device flex flex-col relative p-0 rounded-[24px] border-2 border-solid bg-cardDeviceTextureLight dark:bg-cardDeviceTextureDark  bg-no-repeat bg-right-top bg-cover transition-all overflow-hidden ${
        isConnected
          ? "card-connected border-purple-300 dark:border-green-200"
          : "card-disconnected border-gray-100 dark:border-gray-600"
      } ${device.available ? "card-online" : "card-offline relative isolate"} ${
        filterBy !== "all" ? `card-filter-on ${filterAttribute(filterBy)}` : "card-all"
      }`}
    >
      <div className="card-header relative bg-transparent border-none pt-6 min-h-[140px]">
        {device.name ? (
          <>
            <Heading headingLevel={3} renderAs="h3">
              {device.name}
            </Heading>
            <Heading headingLevel={4} renderAs="h4">
              {device.device.info.displayName} {device.device.info.product === "Raise" ? device.device.info.keyboardType : null}
            </Heading>
          </>
        ) : (
          <Heading headingLevel={3} renderAs="h3">
            {device.device.info.displayName} {device.device.info.product === "Raise" ? device.device.info.keyboardType : null}
          </Heading>
        )}
        <Heading headingLevel={5} renderAs="h5">
          {device.path}
        </Heading>
        <span
          className={`bullet-connect absolute right-6 top-6 w-2 h-2 rounded-full  ${
            isConnected ? "connected bg-purple-300 dark:bg-green-200" : "disconnected bg-gray-200"
          }`}
        >
          &nbsp;
        </span>
      </div>
      <DevicePreview deviceName={device.device.info.displayName} isConnected={isConnected} />
      <div className="card-footer bg-transparent border-none p-0.5 mt-auto">
        <div className="card-footer--inner flex justify-between items-center rounded-[18px] p-4 bg-gray-25/80 dark:bg-gray-700/70 backdrop-blur-sm">
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
