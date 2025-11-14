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
import log from "electron-log/renderer";
import { useMachine } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import { i18n } from "@Renderer/i18n";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";
import { toast } from "react-toastify";

// State machine
import FlashDevice from "@Renderer/controller/FlashingProcedure/machine";

// Visual components
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { IconInformation } from "@Renderer/components/atoms/icons";

// types
import { ContextType } from "@Renderer/controller/FlashManager/context";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { BackupType } from "@Renderer/types/backups";

// Visual modules
import FirmwareProgressStatus from "./FirmwareProgressStatus";
import Store from "@Renderer/utils/Store";
import Backup from "../../../api/backup";
import WaitForRestoreDialog from "@Renderer/components/molecules/CustomModal/WaitForRestoreDialog";
import RestorePromptDialog from "@Renderer/components/molecules/CustomModal/RestorePromptDialog";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import { IconArrowDownWithLine } from "@Renderer/components/atoms/icons";
import { Neuron } from "@Renderer/types/neurons";
import Device from "../../../api/comms/Device";

const Style = Styled.div`
width: 100%;
height: inherit;
.firmware-wrapper {
  max-width: 680px;
  width: 100%;
  margin: auto;
  .firmware-row {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
  }
  .firmware-content {
    flex: 0 0 66%;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundContent};
  }
  .firmware-sidebar {
    flex: 0 0 34%;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundSidebar};
  }
  .firmware-content--inner {
    padding: 32px;
  }
  .borderLeftTopRadius {
    border-top-left-radius: 14px;
  }
  .borderRightTopRadius {
    border-top-right-radius: 14px;
  }
  .borderLeftBottomRadius {
    border-bottom-left-radius: 14px;
  }
  .borderRightBottomRadius {
    border-bottom-right-radius: 14px;
  }
}
.firmware-footer {
  width: 100%;
  margin-top: 62px;
}
.holdButton {
  margin-bottom: 32px;
  display: flex;
  grid-gap: 8px;
}
.holdTootip {
  h6 {
    font-size: 13px;
    font-weight: 395;
    letter-spacing: 0;
    color:  ${({ theme }) => theme.colors.gray300};
  }
}
.progress-visualizer {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
`;

interface FirmwareUpdateProcessProps {
  nextBlock: (context: any) => void;
  retryBlock: (context: any) => void;
  context: ContextType;
  toggleFlashing: () => void;
  toggleFwUpdate: (value: boolean) => void;
  onDisconnect: () => void;
  setRestoredOk: (value: boolean) => void;
}

function FirmwareUpdateProcess(props: FirmwareUpdateProcessProps) {
  const { nextBlock, retryBlock, context, toggleFlashing, toggleFwUpdate, onDisconnect, setRestoredOk } = props;
  const { state: deviceState, dispatch } = useDevice();
  const navigate = useNavigate();
  const [toggledFlashing, sendToggledFlashing] = useState(false);
  const [performingRestore, setPerformingRestore] = useState(false);
  const [readyForRestore, setReadyForRestore] = useState(false);
  const [checkingReconnect, setCheckingReconnect] = useState(false);

  // keypress handler to handle keyboard actions.
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 27:
        log.info("esc key logged");
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        send({ type: "escpressed-event" });
        break;
      default:
        break;
    }
  };

  interface INCtype {
    type: string;
    data: {
      globalProgress: number;
      leftProgress: number;
      rightProgress: number;
      resetProgress: number;
      neuronProgress: number;
      restoreProgress: number;
    };
  }

  const stateUpdate = (data: INCtype) => {
    send({
      type: "increment-event",
      globalProgress: data.data.globalProgress,
      leftProgress: data.data.leftProgress,
      rightProgress: data.data.rightProgress,
      resetProgress: data.data.resetProgress,
      neuronProgress: data.data.neuronProgress,
      restoreProgress: data.data.restoreProgress,
    });
  };

  const [state, send] = useMachine(
    FlashDevice.provide({
      actions: {
        addEscListener: () => {
          log.info("added event listener");
          document.addEventListener("keydown", handleKeyDown);
        },
        removeEscListener: () => {
          log.info("removed event listener");
          document.removeEventListener("keydown", handleKeyDown);
        },
        toggleFlashing: async () => {
          if (toggledFlashing) return;
          log.info("starting flashing indicators");
          toggleFlashing();
          toggleFwUpdate(true);
          sendToggledFlashing(true);
        },
        finishFlashing: async ({ context }) => {
          if (!toggledFlashing) return;
          // Use machine context provided to the action to avoid stale state
          setRestoredOk(!!(context as any).restoreResult);
          sendToggledFlashing(false);
          log.info("closing flashin process");
          toggleFlashing();
          toggleFwUpdate(false);
          navigate("/editor");
        },
      },
    }),
    {
      input: {
        deviceState,
        device: deviceState.currentDevice.device as DygmaDeviceType,
        backup: context.backup as BackupType,
        firmwares: context.firmwares,
        isUpdated: context.isUpdated as boolean,
        RaiseBrightness: context.RaiseBrightness as string,
        sideLeftOk: context.sideLeftOk,
        sideLeftBL: context.sideLeftBL,
        sideRightOK: context.sideRightOK,
        sideRightBL: context.sideRightBL,
        stateUpdate,
      },
    },
  );

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (state.context.stateblock > 0) {
      setLoading(false);
    }
    if (state.value === "success") nextBlock(state.context);
  }, [nextBlock, state]);

  // Ensure serial reconnection is ready before showing the Restore popup
  useEffect(() => {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const checkReconnect = async () => {
      try {
        setCheckingReconnect(true);
        setReadyForRestore(false);
        // If the currentDevice is already a ready Serial Neuron, we can proceed immediately
        if (
          deviceState.currentDevice &&
          deviceState.currentDevice.type === "serial" &&
          !deviceState.currentDevice?.device?.bootloader &&
          !deviceState.currentDevice.isClosed
        ) {
          setReadyForRestore(true);
          return;
        }
        // Try up to 10 times with backoff to allow OS to enumerate ports and device to be responsive
        for (let i = 0; i < 10; i += 1) {
          try {
            const list = await DeviceTools.list();
            const target = list.find(
              (d: any) => d.type === "serial" && d.device?.info?.product === state.context.device?.info?.product,
            );
            if (target) {
              setReadyForRestore(true);
              break;
            }
          } catch (e) {
            // ignore and retry
          }
          await sleep(750);
        }
      } finally {
        setCheckingReconnect(false);
      }
    };

    if (state.context.stateblock === 7) {
      checkReconnect();
    } else {
      setReadyForRestore(false);
      setCheckingReconnect(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.context.stateblock]);

  const stepsDefy = [
    { step: 1, title: i18n.firmwareUpdate.texts.flashCardTitle1, description: i18n.firmwareUpdate.texts.flashCardTitleDefy2 },
    {
      step: 2,
      title: i18n.firmwareUpdate.texts.progressCardStatusDefy1,
      description: i18n.firmwareUpdate.texts.progressCardBarDefy1,
    },
    {
      step: 3,
      title: i18n.firmwareUpdate.texts.progressCardStatusDefy2,
      description: i18n.firmwareUpdate.texts.progressCardBarDefy2,
    },
    {
      step: 4,
      title: i18n.firmwareUpdate.texts.progressCardStatusDefy3,
      description: i18n.firmwareUpdate.texts.progressCardBarDefy3,
    },
    {
      step: 5,
      title: i18n.firmwareUpdate.texts.progressCardStatusDefy4,
      description: i18n.firmwareUpdate.texts.progressCardBarDefy4,
    },
    {
      step: 6,
      title: i18n.firmwareUpdate.texts.progressCardStatusDefy5,
      description: i18n.firmwareUpdate.texts.progressCardBarDefy5,
    },
    {
      step: 7,
      title: i18n.firmwareUpdate.texts.progressCardStatusDefy6,
      description: i18n.firmwareUpdate.texts.progressCardBarSuccess,
    },
    {
      step: 8,
      title: i18n.firmwareUpdate.texts.errorDuringProcessTitle,
      description: i18n.firmwareUpdate.texts.errorDuringProcessDescription,
    },
  ];
  const stepsRaise = [
    { step: 1, title: i18n.firmwareUpdate.texts.flashCardTitle1, description: i18n.firmwareUpdate.texts.flashCardTitle2 },
    { step: 4, title: i18n.firmwareUpdate.texts.progressCardStatus1, description: i18n.firmwareUpdate.texts.progressCardBar1 },
    { step: 5, title: i18n.firmwareUpdate.texts.progressCardStatus2, description: i18n.firmwareUpdate.texts.progressCardBar2 },
    { step: 6, title: i18n.firmwareUpdate.texts.progressCardStatus3, description: i18n.firmwareUpdate.texts.progressCardBar3 },
    {
      step: 7,
      title: i18n.firmwareUpdate.texts.progressCardStatus4,
      description: i18n.firmwareUpdate.texts.progressCardBarSuccess,
    },
    {
      step: 8,
      title: i18n.firmwareUpdate.texts.errorDuringProcessTitle,
      description: i18n.firmwareUpdate.texts.errorDuringProcessDescription,
    },
  ];

  return (
    <Style>
      {loading ? (
        <LogoLoader firmwareLoader />
      ) : (
        <div className="firmware-wrapper upgrade-firmware">
          <div className="firmware-row progress-visualizer">
            <FirmwareProgressStatus
              flashProgress={state.context.globalProgress}
              leftProgress={state.context.leftProgress}
              retriesLeft={state.context.retriesLeft}
              rightProgress={state.context.rightProgress}
              retriesRight={state.context.retriesRight}
              resetProgress={state.context.resetProgress}
              neuronProgress={state.context.neuronProgress}
              retriesNeuron={state.context.retriesNeuron}
              retriesDefyWired={state.context.retriesDefyWired}
              restoreProgress={state.context.restoreProgress}
              countdown={state.context.stateblock}
              deviceProduct={state.context.device?.info.product}
              keyboardType={state.context.device?.info.keyboardType}
              steps={state.context.device?.info.product === "Raise" ? stepsRaise : stepsDefy}
            />
          </div>
          {state.context.stateblock === 1 ? (
            <div className="firmware-footer">
              <div className="holdButton">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    retryBlock(state.context);
                  }}
                >
                  {i18n.firmwareUpdate.texts.cancelButton}
                </Button>
              </div>
              <div className="holdTootip">
                <Heading headingLevel={6} className="flex items-center gap-2">
                  {state.context.device?.info.product === "Raise"
                    ? i18n.firmwareUpdate.texts.flashCardHelp
                    : i18n.firmwareUpdate.texts.flashCardHelpDefy}
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                        <IconInformation />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {state.context.device?.info.product === "Raise" ? (
                          <>
                            <div className="text-left [&_p]:text-ssm">
                              <Heading headingLevel={4} renderAs="h4">
                                Why do I need to press and hold the key?
                              </Heading>
                              <p>
                                When updating the firmware, we require the user to physically press and hold a key in order for
                                the Firmware to be loaded. This is for security reasons.
                              </p>
                              <p>
                                The update process is designed so that it will never be triggered accidentally.{" "}
                                <strong>This makes the keyboard secure against undesired firmware modifications.</strong>
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-left [&_p]:text-ssm">
                            <Heading headingLevel={4} renderAs="h4">
                              Why do I need to press the key?
                            </Heading>
                            <p>
                              When updating the firmware, we require the user to physically press a key in order for the Firmware
                              to be loaded. This is for security reasons.
                            </p>
                            <p>
                              The update process is designed so that it will never be triggered accidentally.{" "}
                              <strong>This makes the keyboard secure against undesired firmware modifications.</strong>
                            </p>
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Heading>
              </div>
            </div>
          ) : (
            ""
          )}
          {state.context.stateblock === 8 ? (
            <div className="firmware-footer">
              <div className="holdButton">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    send({ type: "cancel-event" });
                    retryBlock(state.context);
                  }}
                >
                  {i18n.firmwareUpdate.texts.cancelButton}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    send({ type: "retry-event" });
                  }}
                >
                  Retry the flashing procedure
                </Button>
              </div>
              <div className="holdTootip">
                <Heading headingLevel={6} className="flex items-center gap-2">
                  {state.context.device?.info.product === "Raise"
                    ? i18n.firmwareUpdate.texts.flashCardHelp
                    : i18n.firmwareUpdate.texts.flashCardHelpDefy}
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                        <IconInformation />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {state.context.device?.info.product === "Raise"
                          ? i18n.firmwareUpdate.texts.flashCardHelpTooltip
                          : i18n.firmwareUpdate.texts.flashCardHelpTooltipDefy}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Heading>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Manual Restore Prompt after flashing completes, only after reconnection ready */}
          <RestorePromptDialog
            open={state.value === "reportSucess" && readyForRestore}
            disabled={performingRestore}
            onRestore={async () => {
              try {
                setPerformingRestore(true);
                const store = Store.getStore();
                const backupFolder = store.get("settings.backupFolder") as string;
                let connected: Device | undefined;
                let connectedWasNew = false;
                let ok = false;
                try {
                  // Prefer reusing currentDevice if it's a live serial connection matching product
                  if (
                    deviceState.currentDevice &&
                    deviceState.currentDevice.type === "serial" &&
                    !deviceState.currentDevice.isClosed &&
                    (deviceState.currentDevice.device?.info?.product === context.device?.info?.product)
                  ) {
                    connected = deviceState.currentDevice as Device;
                  } else {
                    // Find and connect to the updated device over Serial
                    const list = await DeviceTools.list();
                    const target = list.find(
                      d => d.type === "serial" && d.device?.info?.product === context.device?.info?.product,
                    );
                    if (!target) throw new Error("Keyboard not found after update");
                    // If a different serial device connection is still open, close it first to free the COM port
                    try {
                      if (
                        deviceState.currentDevice &&
                        deviceState.currentDevice.type === "serial" &&
                        !deviceState.currentDevice.isClosed
                      ) {
                        const currPath = (deviceState.currentDevice.port as any)?.path || deviceState.currentDevice.device?.path;
                        const tgtPath = (target as any)?.device?.path;
                        if (currPath && tgtPath && currPath !== tgtPath) {
                          await DeviceTools.disconnect(deviceState.currentDevice as Device);
                        }
                      }
                    } catch (e) {
                      // ignore disconnect errors
                    }
                    // Connect with retry to avoid transient EACCES/EBUSY after device reboot
                    const maxTries = 6;
                    let lastErr: any;
                    for (let i = 0; i < maxTries; i += 1) {
                      try {
                        connected = (await DeviceTools.connect(target)) as Device;
                        lastErr = undefined;
                        break;
                      } catch (err: any) {
                        lastErr = err;
                        const msg = String(err?.message || err);
                        if (/denied|busy|EBUSY|EACCES/i.test(msg)) {
                          await new Promise(r => setTimeout(r, 800));
                          continue;
                        }
                        throw err;
                      }
                    }
                    if (!connected) throw lastErr || new Error("Could not open serial port");
                    connectedWasNew = true;
                  }
                  let chipID = await connected.command("hardware.chip_id");
                  chipID = (chipID as string).replace(/\s/g, "");
                  const neurons = store.get("neurons") as Neuron[];
                  const loadedFile = await Backup.getLatestBackup(backupFolder, chipID, connected);
                  ok = await Backup.restoreBackup(neurons, chipID, loadedFile, connected);
                  if (ok) {
                    toast.success(
                      <ToastMessage title="Backup restored successfully" content="Your backup was restored successfully to the device!" icon={<IconArrowDownWithLine />} />,
                      { autoClose: 2000, icon: "" },
                    );
                  } else {
                    toast.warn(
                      <ToastMessage title="Could not restore backup" content="Could not restore latest backup" icon={<IconArrowDownWithLine />} />,
                      { autoClose: 2500, icon: "" },
                    );
                  }
                } finally {
                  // If we opened a new connection, adopt it into DeviceContext as the current device
                  if (connected && connectedWasNew) {
                    try {
                      dispatch({ type: "addDevice", payload: connected });
                      dispatch({ type: "changeCurrent", payload: { selected: deviceState.deviceList.length, device: connected } });
                    } catch (e) {
                      // if context update fails, we still keep the port open to avoid COM conflicts
                    }
                  }
                }
                setPerformingRestore(false);
                if (ok) {
                  setReadyForRestore(false);
                  send({ type: "finish-event", restoreResult: true } as any);
                }
              } catch (e) {
                log.error(e);
                setPerformingRestore(false);
                toast.warn(
                  <ToastMessage title="Could not restore backup" content={`Error: ${e}`} icon={<IconArrowDownWithLine />} />,
                  { autoClose: 2500, icon: "" },
                );
                // Do not finish on error; keep popup open to allow retry
              }
            }}
          />
          <WaitForRestoreDialog title="Restoring Backup" open={performingRestore} />
        </div>
      )}
    </Style>
  );
}

export default FirmwareUpdateProcess;
