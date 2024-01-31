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

import ReactMarkdown from "react-markdown";

import Title from "@Renderer/component/Title";
import { Badge } from "@Renderer/components/ui/badge";
import { IconEye } from "@Renderer/component/Icon";

import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import { RegularButton } from "@Renderer/component/Button";

const Style = Styled.div`
margin-left:32px;
.versionsStatus {
    height: 116px;
    margin-bottom: 42px;
    background-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundStripeColor};
    border-bottom-left-radius: 16px;
    border-top-left-radius: 16px;
    // overflow: hidden;
}
.versionStatusInner {
  display: flex;
  flex-wrap: nowrap;
  height: inherit;
  .versionStatusInstalled,
  .versionStatusNext {
    padding: 24px;
    h6 {
      margin-top: 6px;
      margin-bottom: 10px;
    }
  }
  .versionStatusInstalled {
    flex: 1;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundStripeGradientColor};
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  .versionStatusNext {
    position: relative;
    flex: 1;
    .caret {
      position: absolute;
      top: 24px;
      left: -6px;
      color: ${({ theme }) => theme.styles.firmwareUpdatePanel.caretColor};
    }
  }
}
h6 {
  color: ${({ theme }) => theme.styles.firmwareUpdatePanel.versionInstalledTitle};
}
.badge {
  color: ${({ theme }) => theme.styles.firmwareUpdatePanel.versionInstalledTitle};
  border-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.badgeBorderColor};
}
.versionStatusNext {
  h6 {
    color: ${({ theme }) => theme.styles.firmwareUpdatePanel.nextVersionAvaliableTitle};
  }
  .badge {
    color: ${({ theme }) => theme.styles.firmwareUpdatePanel.nextVersionAvaliableBadge};
    border-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.badgeBorderColorActive};
  }
}
.isUpdated {
  .versionStatusNext {
    .badge {
      padding: 4px;
      color: ${({ theme }) => theme.styles.firmwareUpdatePanel.versionSuccessTitle};
      border-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.versionSuccessBadge};
    }
  }
}
.badge,
.dropdownItemSelected {
  font-size: 0.75rem;
}
.badge {
  padding: 8px;
}
.dropdown-toggle.btn.btn-primary {
  margin-top: 0;
  padding: 8px 12px;
  min-width: 142px;
  &:after {
    right: 8px;
  }
}
.firmwareVersionContainer {
  display: flex;
  align-items: center;
  grid-gap: 8px;
  .btn-link {
    padding: 4px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.purple300}
  }
}
.firmwareModalContent {
  color: ${({ theme }) => theme.colors.gray50}
  h2, h3, h4, h5, h6 {
    letter-spacing: -0.03em;
  }
  h2 {
    font-size: 1.8rem;
  }
  h3 {
    font-size: 1.4rem;
  }
  h4 {
    font-size: 1.2rem;
  }
  ul, p {
    font-size: 0.85rem;
  }
}
`;
const FirmwareVersionStatus = props => {
  const { currentlyVersionRunning, isUpdated, firmwareList, selectedFirmware, send } = props;
  const [modalFirmwareDetails, setModalFirmwareDetails] = useState(false);
  return (
    <Style>
      <div className={`versionsStatus ${isUpdated && "isUpdated"}`}>
        <div className="versionStatusInner">
          <div className="versionStatusInstalled">
            <Title text="Installed firmware version" headingLevel={6} />
            <Badge variant={isUpdated ? "success" : "default"} size="sm">
              {currentlyVersionRunning}
            </Badge>
          </div>
          <div className="versionStatusNext">
            <svg className="caret" width={18} height={27} viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.4222 12.0346C17.2741 12.8258 17.2741 14.1742 16.4222 14.9654L4.11106 26.3998C2.83142 27.5883 0.750001 26.6808 0.750001 24.9343L0.750002 2.06565C0.750002 0.319217 2.83142 -0.588284 4.11107 0.600225L16.4222 12.0346Z"
                fill="currentColor"
              />
            </svg>

            <Title text="Update to the version" headingLevel={6} />
            <div className="firmwareVersionContainer">
              <Dropdown
                onSelect={value => send("CHANGEFW", { selected: parseInt(value, 10) })}
                value={selectedFirmware}
                className="custom-dropdown sm"
              >
                <div>
                  <Dropdown.Toggle id="dropdown-custom">
                    <div className="dropdownItemSelected">
                      <div className="dropdownItem">{firmwareList[selectedFirmware].version}</div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {firmwareList.map((item, index) => (
                      <Dropdown.Item
                        eventKey={index}
                        key={`id-${index}`}
                        className={`${selectedFirmware === index ? "active" : ""}`}
                        disabled={item.disabled}
                      >
                        <div className="dropdownInner">
                          <div className="dropdownItem">{item.version}</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </div>
              </Dropdown>

              <RegularButton
                className="flashingbutton nooutlined"
                styles="btn-link transp-bg"
                icoSVG={<IconEye />}
                onClick={() => {
                  setModalFirmwareDetails(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={modalFirmwareDetails}
        onHide={() => setModalFirmwareDetails(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{firmwareList[selectedFirmware].version}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="firmwareModalContent">
            {firmwareList[selectedFirmware].body ? (
              <ReactMarkdown>{firmwareList[selectedFirmware].body}</ReactMarkdown>
            ) : (
              <div className="loading marginCenter">
                <Spinner className="spinner-border" role="status" />
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Style>
  );
};

FirmwareVersionStatus.propTypes = {
  currentlyVersionRunning: PropTypes.string,
  isUpdated: PropTypes.bool,
  firmwareList: PropTypes.any,
  selectedFirmware: PropTypes.number,
  send: PropTypes.func,
};

export default FirmwareVersionStatus;
