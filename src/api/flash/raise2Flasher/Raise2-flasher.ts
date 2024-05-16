/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-buffer-constructor */
/* eslint-disable no-await-in-loop */
/* bazecor-flash-raise -- Dygma Raise flash helper for Bazecor
 * Copyright (C) 2019, 2020  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { crc32 } from "easy-crc";
import log from "electron-log/renderer";
import { num2hexstr } from "../num2hexstr";
import { serialConnection, rawCommand, noWaitCommand } from "../serialConnection";
import { InfoType, SealType, HexType } from "../types";
import { ihexDecode } from "../ihexDecode";

const PACKET_SIZE = 4096;

const TYPE_DAT = 0x00;
const TYPE_ESA = 0x02;
const TYPE_ELA = 0x04;

let serialPort;

function SealWithCRC(seal: SealType) {
  // calculate CRC for the seal
  const data = new Buffer(28);
  const vals = [
    `0b${new Array(Math.clz32(seal.bldr_seal_header_t.version)).fill(0).join("") + seal.bldr_seal_header_t.version.toString(2)}`,
    `0b${new Array(Math.clz32(seal.bldr_seal_header_t.size)).fill(0).join("") + seal.bldr_seal_header_t.size.toString(2)}`,
    `0b${new Array(Math.clz32(seal.bldr_seal_header_t.crc) - 1).fill(0).join("") + seal.bldr_seal_header_t.crc.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_start)).fill(0).join("") + seal.program_start.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_size)).fill(0).join("") + seal.program_size.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_crc)).fill(0).join("") + seal.program_crc.toString(2)}`,
    `0b${new Array(Math.clz32(seal.program_version)).fill(0).join("") + seal.program_version.toString(2)}`,
  ];
  log.info("checking vals: ", vals);
  for (let i = 0; i < vals.length; i += 1) {
    // @ts-ignore
    data.writeUInt32LE(vals[i], i * 4);
  }
  const sealCrc = crc32("CRC-32", data);

  // send the Seal with the calculated CRC in place
  const bitSeal = `0b${new Array(Math.clz32(sealCrc)).fill(0).join("") + sealCrc.toString(2)}`;
  // @ts-ignore
  data.writeUInt32LE(bitSeal, 8);

  log.info("calculated CRC: ", sealCrc, bitSeal, data);
  return data;
}

/**
 * Object NRf52833 with flash method.
 *
 *
 * The new command structure developed y Ota fejfar for the NRf52833 Bootloader
 *
 * Erase 1:          E[addr]#   - Will erase the memory from the address to the end of the available memory
 * Erase 2:          E[addr],[size]#  - (optional) Will erase the size of the memory
 * Upload data:  U[size]#             - The size of incoming data to be stored in the internal temp buffer
 * Data:              [data]                 - The data of size specified in the previous 'S' command
 * Write data:    W[addr],[size]#  - Move the data in the flash memory
 * CRC check:   C[addr],[size],[crc]#  -  Check the uploaded firmware
 * Start app:       S#                       - Start the application
 *
 */
const Raise2Flash = {
  flash: async (
    lines: string[],
    stateUpdate: (arg0: string, arg1: number) => void,
    finished: (err: Error, result: unknown) => void,
  ) => {
    // let fileData = fs.readFileSync(firmware, { encoding: "utf8" });
    // fileData = fileData.replace(/(?:\r\n|\r|\n)/g, "");

    // var lines = fileData.split(":");
    // lines.splice(0, 1);

    const dataObjects: HexType[] = [];
    let total = 0;
    let segment = 0;
    let linear = 0;
    const auxData = [];

    for (let i = 0; i < lines.length; i += 1) {
      const hex = ihexDecode(lines[i]);

      if (hex.type === TYPE_ESA) {
        segment = parseInt(hex.str.substr(8, hex.len * 2), 16) * 16;
        linear = 0;
      }

      if (hex.type === TYPE_ELA) {
        linear = parseInt(hex.str.substr(8, hex.len * 2), 16) * 65536;
        segment = 0;
      }

      // let aux = hex.address;

      if (hex.type === TYPE_DAT) {
        total += hex.len;
        if (segment > 0) hex.address += segment;
        if (linear > 0) hex.address += linear;
        auxData.push(hex.data);
        dataObjects.push(hex);
      }
      //   log.info(num2hexstr(segment, 8), linear, num2hexstr(aux), num2hexstr(hex.address));
    }

    let ArrLenght = 0;
    auxData.forEach(item => {
      ArrLenght += item.length;
    });
    const mergedArray = new Uint8Array(ArrLenght);
    let offset = 0;
    auxData.forEach(item => {
      mergedArray.set(item, offset);
      offset += item.length;
    });

    const totalSaved = total;
    let hexCount = 0;
    let { address } = dataObjects[0];

    // Prepare connection
    serialPort = await serialConnection();

    // GET INFO from device
    const info: InfoType = await rawCommand("I#", serialPort);
    log.info("Result of sending I#: ", info);

    const sealData: SealType = {
      bldr_seal_header_t: {
        version: info.seal_version,
        size: 28,
        crc: 0, // this needs to change
      },
      program_start: info.program_space_start,
      program_size: totalSaved,
      program_crc: crc32("CRC-32", new Buffer(mergedArray)),
      program_version: 1,
    };

    const newSeal = SealWithCRC(sealData);

    // SEAL to device
    log.info("sending SEAL");
    let ans: Buffer = await rawCommand(`S${num2hexstr(28, 8)}#`, serialPort);
    if (ans[0] !== 65) {
      log.info("answer to Seal size: ", String.fromCharCode.apply(null, ans));
      log.info(`RAW Command: S${num2hexstr(28, 8)}#`);
      throw Error("error when sending SEAL size");
    }
    ans = await rawCommand(newSeal, serialPort);
    if (ans[0] !== 65) {
      log.info("answer to Seal data: ", String.fromCharCode.apply(null, ans));
      log.info(`RAW Command: ${newSeal}`);
      throw Error("error when sending SEAL data");
    }

    // ERASE device
    log.info("Erasing...");
    ans = await rawCommand(`E${num2hexstr(dataObjects[0].address, 8)}#`, serialPort);
    if (ans[0] !== 65) {
      log.info("answer to Erase command: ", String.fromCharCode.apply(null, ans));
      log.info(`RAW Command: ${`E${num2hexstr(dataObjects[0].address, 8)}#`}`);
      throw Error("error when Erasing");
    }

    let state = 1;
    const stateT = totalSaved / 4096;

    log.info("Starting flashing procedure", totalSaved, stateT);
    while (total > 0) {
      let bufferSize = total < PACKET_SIZE ? total : PACKET_SIZE;

      let buffer = new Buffer(bufferSize);

      let bufferTotal = 0;

      while (bufferTotal < bufferSize) {
        const currentHex = dataObjects[hexCount];

        if (bufferSize - currentHex.len < bufferTotal) {
          // break early, we cannot completely fill the buffer.
          bufferSize = bufferTotal;
          const t = buffer.slice(0, bufferTotal);
          buffer = t;
          break;
        }

        // log.info(buffer, bufferTotal, currentHex);
        for (let i = 0; i < currentHex.data.length; i += 1) {
          buffer.writeUInt8(currentHex.data[i], bufferTotal + i);
        }
        // new Uint8Array(buffer, bufferTotal, currentHex.len).set(
        //   currentHex.data
        // );

        hexCount += 1;
        bufferTotal += currentHex.len;
      }

      // tell the NRf52833 the size of data being sent.
      ans = await rawCommand(`U${num2hexstr(bufferSize, 8)}#`, serialPort);

      // write our data.
      noWaitCommand(buffer, serialPort);

      // copy N bytes to memory location Y -> W function.
      ans = await rawCommand(`W${num2hexstr(address, 8)},${num2hexstr(bufferSize, 8)}#`, serialPort);

      // Update External State
      stateUpdate("neuron", (state / stateT) * 100);
      state += 1;
      total -= bufferSize;
      address += bufferSize;
    }

    log.info("Validating...");
    ans = await rawCommand("V#", serialPort);
    if (ans[0] !== 65) throw Error("error when Validating");

    // START APPLICATION
    ans = await rawCommand("F#", serialPort);
    if (ans[0] !== 65) log.warn("error when disconnecting");

    // DISCONNECT
    finished(undefined, true);
    serialPort.close();
  },
};

export default Raise2Flash;
