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

import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import Title from "@Renderer/component/Title";

import videoDefyCablesDisconnect from "@Assets/videos/connectCablesDefy.mp4";

const Style = Styled.div`
.errorListWrapper {
  padding-top: 16px;
  display: flex;
  grid-gap: 16px;
  align-items: center;
  .errorListItem {
      display: flex;
      grid-gap: 24px;
      align-items: center;
  }
  .errorListImage {
      video {
          aspect-ratio: 1 /1;
          object-fit: cover;
          width: 162px;
          border-radius: 16px;
          border: 3px solid ${({ theme }) => theme.colors.brandWarning};
      }
  }
  .errorListContent {
      max-width: 200px;
      color: ${({ theme }) => theme.styles.firmwareErrorPanel.textColor}
  }
  .errorListDescription {
    margin-top: 0.5rem;
  }
}
.label {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  color: ${({ theme }) => theme.colors.brandSuccess};
  background-color: rgba(0,206,201,0.1);
  border-radius: 3px;
  &.label-warning {
    color: ${({ theme }) => theme.colors.brandWarning};
    background-color: rgba(255,159,67,0.1);
  }
  &.label-error {
    color: ${({ theme }) => theme.colors.brandPrimary};
    background-color: rgba(254,0,124,0.1);
  }
}
.warningListWrapper {
  margin-top: 1.5rem;
}
.warningListItem {
  border-radius: 6px;
  padding: 16px 32px;
  color: ${({ theme }) => theme.styles.callout.calloutColor};
  background: ${({ theme }) => theme.styles.callout.calloutBackground};
  border: 1px solid ${({ theme }) => theme.styles.callout.calloutBorderColor};
  font-size: 13px;
  font-weight: 395;
  line-height: 1.35em;

  .warningListHeader {
    display: flex;
    grid-gap: 8px;
    align-items: center;
    margin-bottom: 0.5rem;
    h4 {
      margin: 0;
      font-size: 14px;
    }
  }
}
`;

const FirmwareWarningList = props => {
  const { leftSideOK, rightSideOK, leftSideBL } = props;
  return (
    <Style>
      <>
        {!leftSideOK || !rightSideOK ? (
          <div className="errorListWrapper">
            <div className="errorListItem">
              <div className="errorListImage">
                <video width={162} height={162} autoPlay loop className="img-center img-fluid">
                  <track kind="captions" />
                  <source src={videoDefyCablesDisconnect} type="video/mp4" />
                </video>
              </div>
              <div className="errorListContent">
                <span className="label label-error">{i18n.general.actionRequired}</span>
                <div className="errorListDescription">{i18n.firmwareUpdate.texts.errorMissingCables}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {leftSideBL ? (
          <div className="warningListWrapper">
            <div className="warningListItem">
              <div className="warningListHeader">
                <Title text={i18n.firmwareUpdate.texts.bootloaderWarningTitle} headingLevel={4} />{" "}
                <span className="label label-warning">{i18n.general.noActionRequired}</span>
              </div>
              <div className="errorListContent">{i18n.firmwareUpdate.texts.bootloaderWarningMessage}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    </Style>
  );
};

FirmwareWarningList.propTypes = {
  leftSideOK: PropTypes.bool,
  rightSideOK: PropTypes.bool,
  leftSideBL: PropTypes.bool,
};

export default FirmwareWarningList;
