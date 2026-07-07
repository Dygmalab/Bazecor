/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-buffer-constructor */
import log from "electron-log/renderer";
import { crc32 } from "easy-crc";
import { SealType } from "./types";

export default function SealWithCRC(seal: SealType) {
  const isVersion2 = seal.bldr_seal_header_t.version === 2;
  const sealSize = isVersion2 ? 32 : 28;
  const data = new Buffer(sealSize);

  const vals = [
    `0b${new Array(Math.clz32(seal.bldr_seal_header_t.version)).fill(0).join("") + seal.bldr_seal_header_t.version.toString(2)}`,
    `0b${new Array(Math.clz32(seal.bldr_seal_header_t.size)).fill(0).join("") + seal.bldr_seal_header_t.size.toString(2)}`,
    `0b${new Array(Math.clz32(seal.bldr_seal_header_t.crc) - 1).fill(0).join("") + seal.bldr_seal_header_t.crc.toString(2)}`,
  ];

  if (isVersion2) {
    vals.push(
      `0b${new Array(Math.clz32(seal.device_id || 0)).fill(0).join("") + (seal.device_id || 0).toString(2)}`,
    );
  }

  vals.push(
    `0b${new Array(Math.clz32(seal.program_start)).fill(0).join("") + seal.program_start.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_size)).fill(0).join("") + seal.program_size.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_crc)).fill(0).join("") + seal.program_crc.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_version)).fill(0).join("") + seal.program_version.toString(2)}`,
  );

  log.info("checking vals: ", vals);
  for (let i = 0; i < vals.length; i += 1) {
    // @ts-ignore
    data.writeUInt32LE(vals[i], i * 4);
  }
  const sealCrc = crc32("CRC-32", data);

  const bitSeal = `0b${new Array(Math.clz32(sealCrc)).fill(0).join("") + sealCrc.toString(2)}`;
  // @ts-ignore
  data.writeUInt32LE(bitSeal, 8);

  log.info("calculated CRC: ", sealCrc, bitSeal, data);
  return data;
}
