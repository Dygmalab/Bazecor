/* eslint-disable no-bitwise */
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

import log from "electron-log/renderer";
import { num2hexstr } from "../num2hexstr";
import { serialConnection, rawCommand, noWaitCommand } from "../serialConnection";
import { PACKET_SIZE, TYPE_DAT, TYPE_ELA } from "../flasherConstants";
import { HexType } from "../types";
import { decodeHexLine } from "../decodeHexLine";
import { str2ab } from "../str2ab";

let serialPort;

export const SAMDFlasher = {
  flash: async (
    lines: string[],
    stateUpdate: (arg0: string, arg1: number) => void,
    finished: (state: boolean, result: unknown) => void,
  ) => {
    const dataObjects: HexType[] = [];
    let total = 0;

    for (let i = 0; i < lines.length; i += 1) {
      const hex = decodeHexLine(lines[i]);

      if (hex.type === TYPE_DAT || hex.type === TYPE_ELA) {
        total += hex.len;
        dataObjects.push(hex);
      }
    }

    const totalSaved = total;
    let hexCount = 0;
    let { address } = dataObjects[0];

    if (address < 2000) {
      finished(true, `You're attempting to overwrite the bootloader... (0x${num2hexstr(dataObjects[0].address, 8)})`);
      return;
    }

    // Prepare connection
    serialPort = await serialConnection();
    let ans: Buffer;

    // CLEAR line
    ans = await rawCommand("N#", serialPort, 1000);
    log.info("Clear Line: ", ans.toString());

    // ERASE device
    log.info("Erasing...");
    ans = await rawCommand("X00002000#", serialPort, 20000);
    log.info("Erased", ans.toString());

    let state = 1;
    const stateT = totalSaved / 4096;

    while (total > 0) {
      let bufferSize = total < PACKET_SIZE ? total : PACKET_SIZE;

      let buffer = new ArrayBuffer(bufferSize);

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

        // check for Extended linear addressing...
        if (currentHex.type === TYPE_ELA) {
          if (bufferTotal > 0) {
            // break early, we're going to move to a different memory vector.
            bufferSize = bufferTotal;
            const t = buffer.slice(0, bufferTotal);
            buffer = t;
            break;
          }

          // set the address if applicable...
          address = currentHex.address << 16;
        }

        new Uint8Array(buffer, bufferTotal, currentHex.len).set(currentHex.data);

        hexCount += 1;
        bufferTotal += currentHex.len;
      }

      // Tell the arduino we are writing at memory 20005000, for N bytes.
      noWaitCommand(str2ab(`S20005000,${num2hexstr(bufferSize, 8)}#`), serialPort);

      // Write our data.
      noWaitCommand(buffer, serialPort);

      // Set our read pointer
      ans = await rawCommand("Y20005000,0#", serialPort, 1000);
      log.info("Y", ans.toString());

      // Copy N bytes to memory location Y.
      ans = await rawCommand(`Y${num2hexstr(address, 8)},${num2hexstr(bufferSize, 8)}#`, serialPort, 1000);
      log.info("Y2", ans.toString());

      // Update External State
      stateUpdate("neuron", (state / stateT) * 100);
      state += 1;
      total -= bufferSize;
      address += bufferSize;
    }

    // CLEANUP
    noWaitCommand(str2ab("WE000ED0C,05FA0004#"), serialPort);

    // DISCONNECT
    try {
      finished(undefined, true);
      await serialPort.close();
    } catch (error) {
      log.warn(error);
    }
  },
};
