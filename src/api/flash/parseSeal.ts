/* eslint-disable no-buffer-constructor */
import log from "electron-log/renderer";
import { crc32 } from "easy-crc";
import { SealType } from "./types";

export function parseSealFromBinary(data: Uint8Array): SealType {
  const buffer = new Buffer(data);

  const version = buffer.readUInt32LE(0);
  const size = buffer.readUInt32LE(4);
  const sealCrc = buffer.readUInt32LE(8);

  const seal: SealType = {
    bldr_seal_header_t: {
      version,
      size,
      crc: sealCrc,
    },
    program_start: 0,
    program_size: 0,
    program_crc: 0,
    program_version: 0,
  };

  if (version === 2) {
    seal.device_id = buffer.readUInt32LE(12);
    seal.program_start = buffer.readUInt32LE(16);
    seal.program_size = buffer.readUInt32LE(20);
    seal.program_crc = buffer.readUInt32LE(24);
    seal.program_version = buffer.readUInt32LE(28);
  } else {
    seal.program_start = buffer.readUInt32LE(12);
    seal.program_size = buffer.readUInt32LE(16);
    seal.program_crc = buffer.readUInt32LE(20);
    seal.program_version = buffer.readUInt32LE(24);
  }

  return seal;
}

export function validateSealCRC(seal: SealType): boolean {
  const size = seal.bldr_seal_header_t.version === 2 ? 32 : 28;
  const data = new Buffer(size);

  data.writeUInt32LE(seal.bldr_seal_header_t.version, 0);
  data.writeUInt32LE(seal.bldr_seal_header_t.size, 4);
  data.writeUInt32LE(0, 8);

  if (seal.bldr_seal_header_t.version === 2) {
    data.writeUInt32LE(seal.device_id || 0, 12);
    data.writeUInt32LE(seal.program_start, 16);
    data.writeUInt32LE(seal.program_size, 20);
    data.writeUInt32LE(seal.program_crc, 24);
    data.writeUInt32LE(seal.program_version, 28);
  } else {
    data.writeUInt32LE(seal.program_start, 12);
    data.writeUInt32LE(seal.program_size, 16);
    data.writeUInt32LE(seal.program_crc, 20);
    data.writeUInt32LE(seal.program_version, 24);
  }

  const calculatedCrc = crc32("CRC-32", data);
  const isValid = calculatedCrc === seal.bldr_seal_header_t.crc;

  log.info("SEAL CRC validation:", {
    expected: seal.bldr_seal_header_t.crc,
    calculated: calculatedCrc,
    valid: isValid,
  });

  return isValid;
}
