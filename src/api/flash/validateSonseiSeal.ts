/* eslint-disable no-buffer-constructor */
import log from "electron-log/renderer";
import { crc32 } from "easy-crc";
import { parseSealFromBinary, validateSealCRC } from "./parseSeal";
import ihexDecode from "./ihexDecode";
import { HexType } from "./types";

const FIRST_SECTOR_SIZE = 4096;
const KEYSCANNER_SONSEI_DEVICE_ID = 0x4f53534b; // "KSSO" - Keyscanner Sonsei
// TODO: Define NEURON_SONSEI_DEVICE_ID when Neuron SEAL is implemented
// const NEURON_SONSEI_DEVICE_ID = 0x????????; // To be defined

const TYPE_DAT = 0x00;
const TYPE_ESA = 0x02;
const TYPE_ELA = 0x04;

export interface SealValidationResult {
  valid: boolean;
  error?: string;
  embeddedSeal?: any;
}

/**
 * Validates the SEAL of a Sonsei Keyscanner firmware from binary data (.bin format).
 * This function should be called BEFORE disconnecting the device or starting the flash process.
 * 
 * @param binaryData - Uint8Array containing the binary firmware data
 * @returns SealValidationResult with validation status and error message if invalid
 */
export function validateSonseiKeyscannerSeal(binaryData: Uint8Array): SealValidationResult {
  try {
    log.info("Starting Sonsei Keyscanner firmware SEAL validation...");

    // Validate minimum size
    if (binaryData.length < 32) {
      const error = "Firmware file too small to contain valid SEAL";
      log.error(error);
      return { valid: false, error };
    }

    // Parse SEAL from first 32 bytes
    const embeddedSeal = parseSealFromBinary(binaryData.slice(0, 32));
    log.info("Embedded SEAL:", embeddedSeal);

    // Validate SEAL version
    if (embeddedSeal.bldr_seal_header_t.version !== 2) {
      const error = `Wrong SEAL version. Expected: 2, Got: ${embeddedSeal.bldr_seal_header_t.version}`;
      log.error(error);
      return { valid: false, error: "Invalid SEAL version. Expected version 2 for Keyscanner Sonsei.", embeddedSeal };
    }

    // Validate device_id for Keyscanner Sonsei (0x4F53534B = "KSSO")
    if (embeddedSeal.device_id !== KEYSCANNER_SONSEI_DEVICE_ID) {
      const error = `Wrong device_id. Expected: 0x${KEYSCANNER_SONSEI_DEVICE_ID.toString(16).toUpperCase()} (KSSO), Got: 0x${(embeddedSeal.device_id || 0).toString(16).toUpperCase()}`;
      log.error(error);
      return { valid: false, error: "This firmware is not for Keyscanner Sonsei.", embeddedSeal };
    }

    // Validate SEAL CRC
    if (!validateSealCRC(embeddedSeal)) {
      const error = "SEAL CRC validation failed";
      log.error(error);
      return { valid: false, error, embeddedSeal };
    }

    // Validate program size - .bin file may have padding beyond program data due to sector alignment
    const availableDataSize = binaryData.length - FIRST_SECTOR_SIZE;
    if (availableDataSize < embeddedSeal.program_size) {
      const error = `Firmware file too small. SEAL says program_size: ${embeddedSeal.program_size}, Available: ${availableDataSize}`;
      log.error(error);
      return { valid: false, error, embeddedSeal };
    }

    // Validate program CRC over the exact program_size bytes declared in the SEAL
    const programData = binaryData.slice(FIRST_SECTOR_SIZE, FIRST_SECTOR_SIZE + embeddedSeal.program_size);
    const calculatedProgramCrc = crc32("CRC-32", new Buffer(programData));
    if (embeddedSeal.program_crc !== calculatedProgramCrc) {
      const error = `Program CRC mismatch. SEAL says: 0x${embeddedSeal.program_crc.toString(16)}, Calculated: 0x${calculatedProgramCrc.toString(16)}`;
      log.error(error);
      return { valid: false, error: "Program CRC validation failed.", embeddedSeal };
    }

    log.info("✓ Keyscanner firmware SEAL validation passed");
    return { valid: true, embeddedSeal };
  } catch (error) {
    log.error("Error during SEAL validation:", error);
    return { valid: false, error: `Validation error: ${error.message || error}` };
  }
}

/**
 * Validates the SEAL of a Sonsei Neuron firmware from hex format (.hex format).
 * This function should be called BEFORE disconnecting the device or starting the flash process.
 * 
 * @param lines - Array of hex file lines (firmware data)
 * @returns SealValidationResult with validation status and error message if invalid
 */
export function validateSonseiNeuronSeal(lines: string[]): SealValidationResult {
  try {
    log.info("Starting Sonsei firmware SEAL validation...");

    // Parse hex file to get binary data
    const dataObjects: HexType[] = [];
    let total = 0;
    let segment = 0;
    let linear = 0;
    const auxData = [];

    for (let i = 0; i < lines.length; i += 1) {
      const hex = ihexDecode(lines[i]);

      if (hex.type === TYPE_ESA) {
        segment = parseInt(hex.str.substring(8, 8 + hex.len * 2), 16) * 16;
        linear = 0;
      }

      if (hex.type === TYPE_ELA) {
        linear = parseInt(hex.str.substring(8, 8 + hex.len * 2), 16) * 65536;
        segment = 0;
      }

      if (hex.type === TYPE_DAT) {
        total += hex.len;
        if (segment > 0) hex.address += segment;
        if (linear > 0) hex.address += linear;
        auxData.push(hex.data);
        dataObjects.push(hex);
      }
    }

    // Merge all data into single array
    let arrLength = 0;
    auxData.forEach(item => {
      arrLength += item.length;
    });
    const mergedArray = new Uint8Array(arrLength);
    let offset = 0;
    auxData.forEach(item => {
      mergedArray.set(item, offset);
      offset += item.length;
    });

    // Validate minimum size
    if (mergedArray.length < 32) {
      const error = "Firmware file too small to contain valid SEAL";
      log.error(error);
      return { valid: false, error };
    }

    // Parse SEAL from first 32 bytes
    const embeddedSeal = parseSealFromBinary(mergedArray.slice(0, 32));
    log.info("Embedded SEAL:", embeddedSeal);

    // Validate SEAL version
    if (embeddedSeal.bldr_seal_header_t.version !== 2) {
      const error = `Wrong SEAL version. Expected: 2, Got: ${embeddedSeal.bldr_seal_header_t.version}`;
      log.error(error);
      return { valid: false, error: "Invalid SEAL version. Expected version 2 for Keyscanner Sonsei.", embeddedSeal };
    }

    // Validate device_id for Keyscanner Sonsei (0x4F53534B = "KSSO")
    if (embeddedSeal.device_id !== KEYSCANNER_SONSEI_DEVICE_ID) {
      const error = `Wrong device_id. Expected: 0x${KEYSCANNER_SONSEI_DEVICE_ID.toString(16).toUpperCase()} (KSSO), Got: 0x${(embeddedSeal.device_id || 0).toString(16).toUpperCase()}`;
      log.error(error);
      return { valid: false, error: "This firmware is not for Keyscanner Sonsei.", embeddedSeal };
    }

    // Validate SEAL CRC
    if (!validateSealCRC(embeddedSeal)) {
      const error = "SEAL CRC validation failed";
      log.error(error);
      return { valid: false, error, embeddedSeal };
    }

    // Validate program size
    const programDataSize = total - FIRST_SECTOR_SIZE;
    if (embeddedSeal.program_size !== programDataSize) {
      const error = `Program size mismatch. SEAL says: ${embeddedSeal.program_size}, Actual: ${programDataSize}`;
      log.error(error);
      return { valid: false, error, embeddedSeal };
    }

    // Validate program CRC (skip first 4kB sector which contains the SEAL)
    const programData = mergedArray.slice(FIRST_SECTOR_SIZE);
    const calculatedProgramCrc = crc32("CRC-32", new Buffer(programData));
    if (embeddedSeal.program_crc !== calculatedProgramCrc) {
      const error = `Program CRC mismatch. SEAL says: 0x${embeddedSeal.program_crc.toString(16)}, Calculated: 0x${calculatedProgramCrc.toString(16)}`;
      log.error(error);
      return { valid: false, error: "Program CRC validation failed.", embeddedSeal };
    }

    log.info("✓ Firmware SEAL validation passed");
    return { valid: true, embeddedSeal };
  } catch (error) {
    log.error("Error during SEAL validation:", error);
    return { valid: false, error: `Validation error: ${error.message || error}` };
  }
}
