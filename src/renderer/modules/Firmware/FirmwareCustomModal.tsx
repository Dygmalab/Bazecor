import React, { useState } from "react";
import { ipcRenderer } from "electron";

import log from "electron-log";
import { motion, AnimatePresence } from "framer-motion";

import Heading from "@Renderer/components/atoms/Heading";
import { IconFolder, IconDocumentWithLines, IconCheckmark } from "@Renderer/components/atoms/icons";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import fs from "fs";

interface FirmwareCustomModalProps {
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
  showCustomFWModal: boolean;
  setShowCustomFWModal: (value: boolean) => void;
  send: (value: unknown) => void;
}

export default function FirmwareCustomModal(props: FirmwareCustomModalProps) {
  const { device, showCustomFWModal, setShowCustomFWModal, send } = props;

  const [customFolder, setCustomFolder] = useState<string>(undefined);
  const [customFWCheck, setCustomFWCheck] = useState<boolean>(undefined);
  const [validatorResults, setValidatorResutls] = useState<Array<{ file: string; valid: boolean }>>([]);

  const fwFiles: { [key: string]: string[] } = {
    Raise: ["firmware.hex"],
    Defy: ["Wireless_neuron.hex", "Wired_neuron.uf2", "keyscanner.bin"],
    Raise2: ["Wireless_neuron.hex", "keyscanner.bin"],
  };

  const validator = (folder: string) => {
    let allValid = true;
    const result = [] as typeof validatorResults;

    // Get the list of files in the directory
    const files = fs.readdirSync(folder);
    log.info("found files: ", files);

    // Get the files required for the current keyboard
    const filesToCheck = fwFiles[device.info.product];

    // Check for each requied file, if it does exist or not in the folder
    filesToCheck.forEach(FTC => {
      const check = files.includes(FTC);
      allValid = allValid && check;

      if (check) {
        result.push({ file: FTC, valid: true });
      } else {
        result.push({ file: FTC, valid: false });
      }
    });

    if (allValid) setCustomFWCheck(true);

    setValidatorResutls(result);
  };

  const cancelProcess = () => {
    setShowCustomFWModal(false);
  };

  const finishProcess = () => {
    setShowCustomFWModal(false);
    send({ type: "customFW-event", selected: customFolder });
  };

  const checkState = (file: string, valid: boolean) => (
    <li className="flex items-center gap-2 justify-between">
      <div
        className={`flex gap-2 transition-all duration-500 items-center ${valid === false && "text-red-100"} ${valid === true && "text-green-200"} ${valid === undefined ? "text-gray-100" : ""}`}
      >
        <IconDocumentWithLines size="sm" /> {file}
      </div>
      <div className={`rounded-full transition-all duration-500 ${valid ? "opacity-100 text-green-200" : "opacity-0"}`}>
        <IconCheckmark size="sm" />
      </div>
    </li>
  );

  return (
    <Dialog open={showCustomFWModal} onOpenChange={() => setShowCustomFWModal(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install a custom firmware</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 mt-2">
          <Heading
            headingLevel={4}
            renderAs="h4"
            className="tracking-tight leading-[1.5em] mb-2 text-gray-500 dark:text-gray-100 flex gap-2 items-center text-md"
          >
            <IconFolder /> Firmware folder
          </Heading>
          <div className="containerInfo flex w-full rounded-regular py-0.5 pl-4 pr-0.5 border-[1px] border-gray-100/60 dark:border-gray-600 bg-white/40 dark:bg-gray-900/20">
            <div className="containerInfoInner flex w-full justify-between gap-4">
              <div className="flex items-center bg-transparent border-none font-semibold text-base text-gray-300 dark:text-gray-50 whitespace-nowrap text-ellipsis overflow-hidden">
                {customFolder || "..."}
              </div>
              <Button
                variant="short"
                onClick={async () => {
                  // Read a file that is a backup
                  const options = {
                    title: "Select folder with custom firmware",
                    buttonLabel: "Select",
                    properties: ["openDirectory"],
                  };
                  const folder = (await ipcRenderer.invoke("open-dialog", options)) as Electron.OpenDialogReturnValue;
                  log.info("received folder: ", folder);
                  if (!folder.canceled) {
                    setCustomFolder(folder.filePaths[0]);
                    validator(folder.filePaths[0]);
                  }
                }}
              >
                Select folder
              </Button>
            </div>
          </div>
          <div className="w-full mt-4 p-6 bg-gray-600/25 rounded-sm">
            <p className="font-semibold tracking-tight mb-2 text-ssm">
              To successfully install the custom firmware on your device, you must ensure that it contains the file.
            </p>
            <ul className="text-ssm">{customFolder && validatorResults.map(({ file, valid }) => checkState(file, valid))}</ul>
            <AnimatePresence>
              {customFWCheck !== undefined && customFWCheck ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6 }}
                  className="flex w-full text-center justify-center p-2 mt-6 rounded-lg font-semibold tracking-tight bg-green-200 text-ssm"
                >
                  Ready for installation
                </motion.div>
              ) : (
                ""
              )}
            </AnimatePresence>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={cancelProcess}>
            Cancel
          </Button>
          <Button variant="secondary" size="md" onClick={finishProcess}>
            Add custom firmware
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
