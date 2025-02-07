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
import { PACKET_SIZE, TYPE_DAT, TYPE_ELA, TYPE_ESA } from "../flasherConstants";
import { HexType } from "../types";
import ihexDecode from "../ihexDecode";
import { delay } from "../../../main/utils/delay";

let serialPort;

const NRf52833 = {
  flash: async (
    lines: string[],
    stateUpdate: (arg0: string, arg1: number) => void,
    finished: (err: Error, result: unknown) => void,
    erasePairings: boolean,
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
        segment = parseInt(hex.str.substring(8, 8 + hex.len * 2), 16) * 16;
        linear = 0;
      }

      if (hex.type === TYPE_ELA) {
        linear = parseInt(hex.str.substring(8, 8 + hex.len * 2), 16) * 65536;
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
    let ans: Buffer;

    // ERASE device
    log.info("Erasing...");
    if (erasePairings) {
      ans = await rawCommand(`E${num2hexstr(dataObjects[0].address, 8)}#`, serialPort, 20000);
    } else {
      ans = await rawCommand(
        `E${num2hexstr(dataObjects[0].address, 8)},${num2hexstr(0x00072000 - dataObjects[0].address, 8)}#`,
        serialPort,
        20000,
      );
    }
    // if (ans[0] !== 65) {
    //   log.info("answer to Erase command: ", String.fromCharCode.apply(null, ans));
    //   log.info(
    //     `RAW Command: ${`E${num2hexstr(dataObjects[0].address, 8)},${num2hexstr(0x00072000 - dataObjects[0].address, 8)}#`}`,
    //   );
    //   throw Error("error when Erasing");
    // }

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

        hexCount += 1;
        bufferTotal += currentHex.len;
      }

      // tell the NRf52833 the size of data being sent.
      ans = await rawCommand(`U${num2hexstr(bufferSize, 8)}#`, serialPort, 1000);

      // write our data.
      noWaitCommand(buffer, serialPort);

      // copy N bytes to memory location Y -> W function.
      ans = await rawCommand(`W${num2hexstr(address, 8)},${num2hexstr(bufferSize, 8)}#`, serialPort, 1000);

      // Update External State
      stateUpdate("neuron", (state / stateT) * 100);
      state += 1;
      total -= bufferSize;
      address += bufferSize;
    }

    // log.info("Validating...");
    // ans = await rawCommand("V#", serialPort);
    // if (ans[0] !== 65) throw Error("error when Validating");

    try {
      // START APPLICATION
      await delay(300);
      noWaitCommand("S#", serialPort);
      await delay(300);
      if (ans[0] !== 65) log.warn("warning when disconnecting");
    } catch (error) {
      log.warn(error);
    }

    try {
      // DISCONNECT
      finished(undefined, true);
      serialPort.close();
    } catch (error) {
      log.warn(error);
    }
  },
};

export default NRf52833;
