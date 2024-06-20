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
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import { IconMoreVertical } from "@Renderer/components/atoms/icons";
import { Popover, PopoverContent, PopoverTrigger, PopoverButton } from "@Renderer/components/atoms/Popover";
import { Button } from "@Renderer/components/atoms/Button";

const Style = Styled.div`
.button.btn-block{
  text-align: center;
}
.buttonTogglerInner {
  position: relative;
}
.btn .badge {
  position: absolute;
  right: -8px;
  top: -20px;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 7px;
  background: rgba(254,0,124,1);
  border-radius: 16px;
}
.buttonToggler.dropdown-toggle.btn {
  border: 1px solid transparent;
}
.dropdown-menu {
  min-width: 14rem;
  max-width: 14rem;
}
.fileSelected {
  margin-top: 16px;
  padding: 8px;
  word-break: break-all;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.fileSelected};
}
`;

interface FirmwareAdvancedOptionsType {
  firmwareFilename: any;
  selectFirmware: any;
  selectExperimental: any;
}

function FirmwareAdvancedOptions(props: FirmwareAdvancedOptionsType) {
  const { firmwareFilename, selectFirmware, selectExperimental } = props;
  return (
    <Style>
      <Popover>
        <PopoverTrigger asChild>
          <PopoverButton>
            <div className="buttonTogglerInner">
              {firmwareFilename ? <div className="badge badge-primary animOpacity">1</div> : ""}
              <IconMoreVertical />
            </div>
          </PopoverButton>
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="dropdownMenuPadding">
            <div className="dropdownMenuContent" dangerouslySetInnerHTML={{ __html: i18n.firmwareUpdate.texts.advUsersHTML }} />
            <Button variant="outline" onClick={selectFirmware} size="sm">
              {firmwareFilename === "" ? i18n.firmwareUpdate.custom : i18n.firmwareUpdate.rcustom}
            </Button>
            <Button variant="secondary" size="sm" onClick={selectExperimental}>
              Use Experimental
            </Button>
            {firmwareFilename ? <div className="fileSelected animOpacity">{firmwareFilename}</div> : ""}
          </div>
        </PopoverContent>
      </Popover>
    </Style>
  );
}

export default FirmwareAdvancedOptions;
