import log from "electron-log/renderer";
import { crc32 } from "easy-crc";
import { BackupType } from "@Renderer/types/backups";
import { State } from "src/api/comms/Device";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { validateSonseiKeyscannerSeal } from "../../../api/flash/validateSonseiSeal";
import { parseSealFromBinary, validateSealCRC } from "../../../api/flash/parseSeal";
import type * as Context from "./context";

export interface InputType {
  readonly deviceState: State;
  readonly device: DygmaDeviceType;
  readonly firmwares: {
    fw: any;
    fwSides: any;
  };
  readonly backup: BackupType;
  readonly isUpdated: boolean;
  readonly RaiseBrightness: string;
  readonly sideLeftOk: boolean;
  readonly sideLeftBL: boolean;
  readonly sideRightOK: boolean;
  readonly sideRightBL: boolean;
  readonly stateUpdate: (data: {
    type: string;
    data: {
      globalProgress: number;
      leftProgress: number;
      rightProgress: number;
      resetProgress: number;
      neuronProgress: number;
      restoreProgress: number;
    };
  }) => void;
}

export const Input = async (input: InputType): Promise<Context.ContextType> => {
  // Validate Sonsei Keyscanner firmware SEAL BEFORE starting the flash process
  // This only applies to Sonsei keyboards - other keyboards (Raise, Raise2, Defy) don't use SEAL
  // The SEAL is in the Keyscanner firmware (fwSides), not the Neuron firmware (fw)
  if (input.device.info.product === "Sonsei") {
    log.info("Detected Sonsei keyboard - validating firmware SEALs before flashing...");

    // Validate Keyscanner firmware SEAL
    if (input.firmwares?.fwSides) {
      const ksValidation = validateSonseiKeyscannerSeal(input.firmwares.fwSides);
      if (!ksValidation.valid) {
        log.error("Sonsei Keyscanner firmware SEAL validation failed:", ksValidation.error);
        throw new Error(`Invalid Sonsei Keyscanner firmware: ${ksValidation.error}`);
      }
      log.info("✓ Sonsei Keyscanner firmware SEAL validation passed");
    }

    // Validate Neuron firmware SEAL (.bin - Uint8Array)
    if (input.firmwares?.fw && input.firmwares.fw instanceof Uint8Array) {
      log.info("Starting Sonsei Neuron firmware SEAL validation...");
      const neuronFw = input.firmwares.fw as Uint8Array;

      if (neuronFw.length < 32) {
        throw new Error("Invalid Sonsei Neuron firmware: Firmware file too small to contain valid SEAL");
      }

      const embeddedSeal = parseSealFromBinary(neuronFw.slice(0, 32));
      log.info("Neuron Embedded SEAL:", embeddedSeal);

      if (embeddedSeal.bldr_seal_header_t.version !== 2) {
        log.error(`Wrong SEAL version. Expected: 2, Got: ${embeddedSeal.bldr_seal_header_t.version}`);
        throw new Error("Invalid Sonsei Neuron firmware: Invalid SEAL version. Expected version 2.");
      }

      // TODO: Validate device_id when NEURON_SONSEI_DEVICE_ID is defined

      if (!validateSealCRC(embeddedSeal)) {
        log.error("Neuron SEAL CRC validation failed");
        throw new Error("Invalid Sonsei Neuron firmware: SEAL CRC validation failed.");
      }

      // The .bin file may have padding beyond the program data due to sector alignment
      const availableDataSize = neuronFw.length - 4096;
      if (availableDataSize < embeddedSeal.program_size) {
        log.error(`Firmware file too small. SEAL says program_size: ${embeddedSeal.program_size}, Available: ${availableDataSize}`);
        throw new Error("Invalid Sonsei Neuron firmware: Firmware file too small for declared program size.");
      }

      // Validate CRC only over the exact program_size bytes declared in the SEAL
      const programData = neuronFw.slice(4096, 4096 + embeddedSeal.program_size);
      const calculatedProgramCrc = crc32("CRC-32", Buffer.from(programData));
      if (embeddedSeal.program_crc !== calculatedProgramCrc) {
        log.error(`Program CRC mismatch. SEAL says: 0x${embeddedSeal.program_crc.toString(16)}, Calculated: 0x${calculatedProgramCrc.toString(16)}`);
        throw new Error("Invalid Sonsei Neuron firmware: Program CRC validation failed.");
      }

      log.info("✓ Sonsei Neuron firmware SEAL validation passed");
    }

    log.info("✓ All Sonsei firmware SEAL validations passed - safe to proceed with flashing");
  }

  const result: Context.ContextType = {
    stateblock: 0,
    deviceState: input.deviceState,
    device: input.device,
    originalDevice: input.deviceState.currentDevice,
    error: undefined,
    firmwares: input.firmwares,
    backup: input.backup,
    isUpdated: input.isUpdated,
    RaiseBrightness: input.RaiseBrightness,
    sideLeftOk: input.sideLeftOk,
    sideLeftBL: input.sideLeftBL,
    sideRightOK: input.sideRightOK,
    sideRightBL: input.sideRightBL,
    loadedComms: true,
    globalProgress: 0,
    leftProgress: 0,
    rightProgress: 0,
    resetProgress: 0,
    neuronProgress: 0,
    restoreProgress: 0,
    retriesRight: 0,
    retriesLeft: 0,
    retriesNeuron: 0,
    retriesDefyWired: 0,
    erasePairings: true,
    restoreResult: undefined,
    rightResult: undefined,
    leftResult: undefined,
    resetResult: undefined,
    flashResult: undefined,
    DeviceVariant: undefined,
    flashRaise: undefined,
    flashDefyWireless: undefined,
    flashSides: undefined,
    bootloader: undefined,
    comPath: undefined,
    stateUpdate: input.stateUpdate,
  };

  return result;
};
