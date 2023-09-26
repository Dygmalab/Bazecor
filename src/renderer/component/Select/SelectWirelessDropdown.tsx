import React from "react";
import Styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

import i18n from "@Renderer/i18n";
import { SelectWirelessDropdownProps, WirelessButton } from "@Renderer/types/wireless";
import { BluetoothCodes } from "@Renderer/../hw/bluetooth";
import { BatteryCodes } from "@Renderer/../hw/battery";

const Style = Styled.div`
width: 100%;
.custom-dropdown {
  .dropdownItem {
    padding-left: 0;
    flex: 0 0 100%;
    text-align: left;
    text-transform: capitalize;
    font-size: inherit;
    line-height: 1em;
  }
  .dropdownItemSelected {
    color: ${({ theme }) => theme.styles.dropdown.textButtonColor};
    position: relative;
    .badge-circle {
      width: 8px;
      height: 8px; 
      border-radius: 50%;
      background-color: rgba(254,0,124,1);
      position: absolute;
      right: -26px;
      top: -13px;
      font-size: 11px;
    }
    &:hover {
      color: ${({ theme }) => theme.styles.dropdown.textButtonHover};
    }
  }
}
.active .dropdownItemSelected .badge-circle {
    opacity: 1;
  }
.disabled {
  pointer-events: none;
  opacity: 35%;
}
.dropdown-toggle.btn.btn-primary {
    margin-top: 0;
    padding: 12px 16px;
  }
  
  .dropdown-menu.large-dropdown {
      min-width: 214px;
      &.show {
        height: auto;
      }
  }
  .large-dropdown-inner {
    
  }
  .dropdownHeader {
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.styles.dropdown.largeDropdown.title};
    margin-top: 6px;
    span {
        font-weight: 600;
        color: ${({ theme }) => theme.styles.dropdown.largeDropdown.titleStrong};
    }
  }
.dropdown-group {
    background: ${({ theme }) => theme.styles.dropdown.largeDropdown.backgroundInner};
    padding: 8px;
    border-radius: 6px;
    border: ${({ theme }) => theme.styles.dropdown.largeDropdown.border};
}
.dropdown-group {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.dropdown-group + .dropdown-group {
    margin-top: 2px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.mouseMovement.dropdown-group {
    border-radius: 0;
}
.dropdown-group-buttons {
    display: grid;
    grid-gap: 3px;
    flex-wrap: nowrap;
    padding: 2px 4px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.styles.cardButtons.groupButtonsBackground}; 
}
.mouseClick .dropdown-group-buttons {
    grid-template-columns: repeat(5, 1fr);
}
.mouseMovement .dropdown-group-buttons, 
.mouseWheel .dropdown-group-buttons {
    grid-template-columns: repeat(4, 1fr);
}
.dropdown-item.dropdown-config-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 36px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.03em;
    padding: 8px 0;
    border: ${({ theme }) => theme.styles.button.config.border};
    color: ${({ theme }) => theme.styles.button.config.color}; 
    background: ${({ theme }) => theme.styles.button.config.background};
    border: none;
    border-radius: 6px;
    box-shadow: ${({ theme }) => theme.styles.button.config.boxShadow};
    transition-property: background, box-shadow, color
    transition: 300ms ease-in-out;
    .dropdownItem {
        text-align: center;
    }
    &:hover {
        cursor: pointer;
        color: ${({ theme }) => theme.styles.button.config.colorHover}; 
        background: ${({ theme }) => theme.styles.button.config.backgroundHover};
        box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowHover};
    }
    &.active {
        color: ${({ theme }) => theme.styles.button.config.colorActive}; 
        background: ${({ theme }) => theme.styles.button.config.backgroundActive};
        box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowActive};
    }
  }
`;

enum WirelessButtonOrder {
  BATTERY_LEVEL = 0,
  PAIRING_MODE = 1,
}

function SelectWirelessDropdown(props: SelectWirelessDropdownProps) {
  const { keyCode, onKeySelect } = props;
  const WirelessButtons: Array<WirelessButton> = [
    { name: i18n.editor.standardView.wireless.batteryLevel, keynum: BatteryCodes.STATUS },
    { name: i18n.wireless.bluetooth.pairingModeButton, keynum: BluetoothCodes.PAIRING },
  ];
  const KC: number = keyCode.base + keyCode.modified;
  // const verifiedKC = WirelessButtons.findIndex((param: WirelessButton) => param.keynum === KC);

  return (
    <Style>
      <Dropdown
        onSelect={value => onKeySelect(parseInt(value, 10))}
        className={`custom-dropdown  ${WirelessButtons.map(i => i.keynum).includes(KC) ? "active" : ""}`}
      >
        <Dropdown.Toggle id="dropdown-custom" className="button-config-style">
          <div className="dropdownItemSelected">
            <div className="dropdownItem">
              <div className="dropdownItem">{i18n.app.menu.wireless}</div>
              <div className="badge-circle" />
            </div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="large-dropdown">
          <div className="large-dropdown-inner">
            <div className="dropdown-group wirelessBattery">
              <div className="dropdownHeader">
                Wireless <span>Battery status</span>
              </div>
              <div className="dropdown-group-buttons">
                <Dropdown.Item
                  eventKey={String(WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].keynum)}
                  key={`wirelessButtons-${WirelessButtonOrder.BATTERY_LEVEL}`}
                  disabled={WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].keynum === -1}
                  className={`
                    ${
                      WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].keynum === keyCode.base + keyCode.modified
                        ? "active"
                        : ""
                    } dropdown-config-button`}
                >
                  <div className="dropdownItem">{WirelessButtons[WirelessButtonOrder.BATTERY_LEVEL].name}</div>
                </Dropdown.Item>
              </div>
            </div>
            <div className="dropdown-group wirelessPairing">
              <div className="dropdownHeader">
                Bluetooth <span>{i18n.wireless.bluetooth.pairingMode}</span>
              </div>
              <div className="dropdown-group-buttons">
                <Dropdown.Item
                  eventKey={String(WirelessButtons[WirelessButtonOrder.PAIRING_MODE].keynum)}
                  key={`wirelessButtons-${WirelessButtonOrder.PAIRING_MODE}`}
                  disabled={WirelessButtons[WirelessButtonOrder.PAIRING_MODE].keynum === -1}
                  className={`
                    ${
                      WirelessButtons[WirelessButtonOrder.PAIRING_MODE].keynum === keyCode.base + keyCode.modified ? "active" : ""
                    } dropdown-config-button`}
                >
                  <div className="dropdownItem">{WirelessButtons[WirelessButtonOrder.PAIRING_MODE].name}</div>
                </Dropdown.Item>
              </div>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </Style>
  );
}

export default SelectWirelessDropdown;
