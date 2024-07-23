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
import Styled from "styled-components";

import ReactMarkdown from "react-markdown";

import Heading from "@Renderer/components/atoms/Heading";
import { Badge } from "@Renderer/components/atoms/Badge";
import { IconEye, IconLoader, IconMemoryUpload } from "@Renderer/components/atoms/icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";

import { ReleaseType } from "@Renderer/types/releases";
import FirmwareCustomModal from "./FirmwareCustomModal";

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

interface FirmwareVersionStatusProps {
  device: {
    info: {
      vendor: string;
      product: string;
      keyboardType: string;
      displayName: string;
    };
    bootloader: boolean;
    version: string;
    chipID: string;
  };
  isUpdated: boolean;
  firmwareList: ReleaseType[];
  selectedFirmware: any;
  send: (value: unknown) => void;
  typeSelected: string;
}

const FirmwareVersionStatus = (props: FirmwareVersionStatusProps) => {
  const { device, isUpdated, firmwareList, selectedFirmware, send, typeSelected } = props;
  const [modalFirmwareDetails, setModalFirmwareDetails] = useState(false);
  const [showCustomFWModal, setShowCustomFWModal] = useState(false);

  return (
    <Style>
      <div className={`versionsStatus ${isUpdated && "isUpdated"}`}>
        <div className="versionStatusInner">
          <div className="versionStatusInstalled">
            <Heading headingLevel={6} className="text-base mb-1">
              Installed firmware version
            </Heading>
            <Badge variant="outline" size="xs">
              {device.version}
            </Badge>
          </div>
          <div className="versionStatusNext">
            <svg className="caret" width={18} height={27} viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.4222 12.0346C17.2741 12.8258 17.2741 14.1742 16.4222 14.9654L4.11106 26.3998C2.83142 27.5883 0.750001 26.6808 0.750001 24.9343L0.750002 2.06565C0.750002 0.319217 2.83142 -0.588284 4.11107 0.600225L16.4222 12.0346Z"
                fill="currentColor"
              />
            </svg>

            <Heading headingLevel={6} className="text-base mb-1">
              Update to the version
            </Heading>
            <div className="firmwareVersionContainer">
              <Select
                value={String(selectedFirmware)}
                onValueChange={(value: string) => send({ type: "changeFW-event", selected: parseInt(value, 10) })}
              >
                <SelectTrigger className="w-full" size="sm">
                  {typeSelected === "default" ? <SelectValue placeholder="Select firmware version" /> : "Custom firmware"}
                </SelectTrigger>
                <SelectContent>
                  {firmwareList && firmwareList.length > 0
                    ? firmwareList.map((item, index: number) => (
                        <SelectItem
                          value={index.toString(10)}
                          key={`id-${item.name}-${item.version}`}
                          disabled={item === undefined}
                        >
                          {item.version}
                        </SelectItem>
                      ))
                    : "No version Available"}
                </SelectContent>
              </Select>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="link"
                        size="iconXS"
                        onClick={() => {
                          setModalFirmwareDetails(true);
                        }}
                        disabled={typeSelected !== "default"}
                        className="rounded-full hover:bg-purple-300 dark:hover:bg-purple-200 hover:text-gray-25"
                      >
                        <IconEye />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    What&apos;s new
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="link"
                        size="iconXS"
                        onClick={() => setShowCustomFWModal(true)}
                        className="rounded-full hover:bg-purple-300 dark:hover:bg-purple-200 hover:text-gray-25"
                      >
                        <IconMemoryUpload />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    Install a custom firmware
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={modalFirmwareDetails} onOpenChange={() => setModalFirmwareDetails(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{firmwareList[selectedFirmware]?.version}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 mt-2">
            {firmwareList[selectedFirmware]?.body ? (
              <ReactMarkdown>{firmwareList[selectedFirmware]?.body}</ReactMarkdown>
            ) : (
              <div className="loading marginCenter flex text-center justify-center">
                <IconLoader />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <FirmwareCustomModal
        device={device}
        showCustomFWModal={showCustomFWModal}
        setShowCustomFWModal={setShowCustomFWModal}
        send={send}
      />
    </Style>
  );
};

export default FirmwareVersionStatus;
