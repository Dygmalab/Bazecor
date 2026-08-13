/* eslint-disable no-await-in-loop */
/* eslint-disable no-eval */
/* bazecor-side-flasher -- Dygma keyboards keyscanner updater module for Bazecor
 * Supported Commands in order of execution -->
 *
 * upgrade.start
 * upgrade.neuron
 * upgrade.end
 * upgrade.keyscanner.isConnected (0:Right / 1:Left)
 * upgrade.keyscanner.isBootloader (0:Right / 1:Left)
 * upgrade.keyscanner.begin (0:Right / 1:Left) // after this one, FW remembers the chosen side
 * upgrade.keyscanner.getInfo
 * upgrade.keyscanner.sendWrite
 * upgrade.keyscanner.validate
 * upgrade.keyscanner.finish
 * upgrade.keyscanner.sendStart
 *
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
import type { PortInfo } from "@serialport/bindings-cpp";
import { delay } from "../../../main/utils/delay";
import { parseSealFromBinary } from "../parseSeal";
import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";

export default class SideFlaser {
  firmwareSides: Buffer;
  serialport: SerialPort;
  constructor(firmwareSides: Buffer) {
    this.firmwareSides = firmwareSides;
    this.serialport = undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  async prepareNeuron() {
    // Auxiliary Functions

    let deviceList = await SerialPort.list();
    let retry = 5;
    let selectedDev = deviceList.find((dev: PortInfo) => parseInt(dev.vendorId as string, 16) === 0x35ef);
    while (selectedDev === undefined && retry > 0) {
      delay(500);
      deviceList = await SerialPort.list();
      selectedDev = deviceList.find((dev: PortInfo) => parseInt(dev.vendorId as string, 16) === 0x35ef);
      retry -= 1;
    }
    // log.info('Found this device:', deviceList, selectedDev);

    if (selectedDev === undefined) throw new Error("Flashable device not found");

    // Serial port instancing
    const serialport = new SerialPort({
      path: selectedDev.path,
      baudRate: 115200,
      lock: true,
    });
    const parser = serialport.pipe(new DelimiterParser({ delimiter: "\r\n" }));
    const receivedData = [];
    parser.on("data", (data: Buffer) => {
      receivedData.push(data.toString("utf-8"));
    });
    log.info("Upgrading the neuron...");
    try {
      await serialport.write("upgrade.neuron\n");
    } catch (error) {
      log.info("answer after shutdown not received");
    }
    await delay(10);
    await serialport.close((err: Error | null | undefined) => {
      if (err) log.warn("device already disconnected!! no need to close serialport");
      else log.info("port closed successfully");
    });
  }

  async flashSide(
    path: string,
    side: string,
    stateUpd: (arg0: string, arg1: number) => void,
    wiredOrWireless: string,
    forceFlashSides: boolean,
  ) {
    let receivedData: string[] = [];

    async function readLine() {
      while (receivedData.length === 0) await delay(1);
      return receivedData.pop();
    }
    try {
      // Update process
      // log.info(this.firmwareSides);
      const seal = parseSealFromBinary(new Uint8Array(this.firmwareSides.slice(0, 32)));
      // log.info("This is the seal from the FW file");
      // eslint-disable-next-line no-console
      console.info("This is the seal from the FW File");
      // eslint-disable-next-line no-console
      console.table(seal);

      // Serial port instancing
      if (this.serialport !== undefined) {
        try {
          log.info("closing serial port", this.serialport.isOpen);
          await this.serialport.close();
          await delay(500);
        } catch (error) {
          log.info("port already closed", error);
        }
      }

      let selectedDev: PortInfo;
      let deviceList: PortInfo[] = await SerialPort.list();
      let retry = 5;
      if (path !== undefined && path !== "") {
        selectedDev = deviceList.find((dev: PortInfo) => dev.path === path);
      } else {
        selectedDev = deviceList.find((dev: PortInfo) => parseInt(dev.vendorId as string, 16) === 0x35ef);
        if (selectedDev === undefined) {
          while (selectedDev === undefined && retry > 0) {
            await delay(500);
            deviceList = await SerialPort.list();
            selectedDev = deviceList.find((dev: PortInfo) => parseInt(dev.vendorId as string, 16) === 0x35ef);
            retry -= 1;
          }
        }
      }
      if (selectedDev === undefined) throw new Error("Flashable device not found");
      log.info("Found this device:", selectedDev);
      await delay(1000);

      this.serialport = new SerialPort({
        path: selectedDev?.path,
        baudRate: 115200,
        lock: true,
        endOnClose: true,
      });
      log.info("defined serialport");
      const parser = this.serialport.pipe(new DelimiterParser({ delimiter: "\r\n" }));
      receivedData = [];
      parser.on("data", (data: Buffer) => {
        receivedData.push(data.toString("utf-8"));
      });

      // Begin upgrade process for selected side
      let ans;
      const sideId = side === "right" ? 0 : 1;
      log.info(`going to start writing to the ${side} side`);
      this.serialport.write(`upgrade.keyscanner.isConnected ${sideId}\n`);
      const testRead = await readLine();
      log.info("testing after first read", testRead);
      let isConnected: string | boolean = (await readLine()) as string;

      isConnected = isConnected.includes("true");
      this.serialport.write(`upgrade.keyscanner.isBootloader ${sideId}\n`);
      await readLine();
      let isItBootloader: string | boolean = (await readLine()) as string;
      isItBootloader = isItBootloader.includes("true");
      log.info(`Checking ${sideId} side for isConnected: ${isConnected} and isBootloader: ${isItBootloader}`);
      if (!isConnected) {
        throw new Error("sides not connected to device");
      }

      // Starting flashing procedure
      this.serialport.write(`upgrade.keyscanner.begin ${sideId}\n`);
      await readLine();
      ans = await readLine();
      if ((ans as string).trim() !== "true") {
        log.error("not returned true when begin!!!", ans);
        return {
          error: true,
          message: `${side} side disconnected from keyboard\n`,
        };
      }

      log.info("Sending getInfo command...");
      this.serialport.write("upgrade.keyscanner.getInfo\n");
      log.info("Waiting for first getInfo response...");
      await readLine();
      log.info("Waiting for second getInfo response...");
      ans = await readLine();
      log.info("Received Info from Side: ", ans);
      ans = (ans as string).split(" ");
      const info = {
        hardwareVersion: parseInt(ans[0], 10),
        flashStart: parseInt(ans[1], 10),
        programVersion: parseInt(ans[2], 10),
        programCrc: parseInt(ans[3], 10),
        validation: parseInt(ans[4], 10),
      };

      // log.info("This is the seal from the Neuron");
      // eslint-disable-next-line no-console
      console.info("This is the seal from the Neuron");
      // eslint-disable-next-line no-console
      console.table(info);

      // Clear buffer before getWriteSize - read any residual data
      log.info("Clearing buffer before getWriteSize...");
      while (receivedData.length > 0) {
        const cleared = receivedData.shift();
        log.info("Cleared from buffer:", cleared);
      }
      
      // Get write size from keyscanner
      log.info("Sending getWriteSize command...");
      this.serialport.write("upgrade.keyscanner.getWriteSize\n");
      
      let PACKET_SIZE = 256; // Default size
      
      // Wait a bit for response
      await delay(50);
      
      // Check if we got a response
      if (receivedData.length > 0) {
        const firstLine = receivedData.shift();
        log.info("First line after getWriteSize:", firstLine);
        
        // Parse response - format is "2048 true " or just "." if command doesn't exist
        if (firstLine && firstLine.trim() !== ".") {
          const parts = firstLine.trim().split(" ");
          const parsedSize = parseInt(parts[0], 10);
          
          if (!isNaN(parsedSize) && parsedSize > 0) {
            PACKET_SIZE = parsedSize;
            log.info(`Using packet size ${PACKET_SIZE} from device`);
            
            // Read the "true" line if it's separate
            if (parts.length === 1 && receivedData.length > 0) {
              const trueLine = receivedData.shift();
              log.info("True line:", trueLine);
            }
          } else {
            log.info("Invalid response, using default 256");
          }
        } else {
          log.info("Command not supported (got '.'), using default 256");
        }
      } else {
        log.info("No response from getWriteSize, using default 256");
      }

      // Write Firmware FOR Loop
      let step = 0;
      const totalsteps = this.firmwareSides.length / PACKET_SIZE;
      log.info("CRC check is ", info.programCrc !== seal.program_crc, ", info:", info.programCrc, "seal:", seal.program_crc);
      log.info("isItBootloader:", isItBootloader, "forceFlashSides:", forceFlashSides);
      
      const needsUpdate = info.programCrc !== seal.program_crc || forceFlashSides;
      log.info("Condition check: needsUpdate?", needsUpdate);
      
      if (needsUpdate) {
        log.info("Starting flash loop. Total firmware size:", this.firmwareSides.length, "Total steps:", totalsteps);
        let validate = "false";
        log.info("Entering flash loop, firmware length:", this.firmwareSides.length, "packet size:", PACKET_SIZE);
        // while (validate !== "true" && retry < 3) {
        // log.info("retry count: ", retry);
        for (let i = 0; i < this.firmwareSides.length; i += PACKET_SIZE) {
          log.info(`Flashing chunk ${step + 1}/${Math.ceil(totalsteps)} - Address ${i} of ${this.firmwareSides.length}`);
          const chunkSize = Math.min(PACKET_SIZE, this.firmwareSides.length - i);
          const writeAction = new Uint8Array(new Uint32Array([info.flashStart + i, chunkSize]).buffer);
          const data = this.firmwareSides.slice(i, i + chunkSize);
          const crc = new Uint8Array(new Uint32Array([crc32("CRC-32", data)]).buffer);
          const blob = new Uint8Array(writeAction.length + data.length + crc.length);
          blob.set(writeAction);
          blob.set(data, writeAction.length);
          blob.set(crc, data.length + writeAction.length);
          const buffer = Buffer.from(blob);
          
          this.serialport.write("upgrade.keyscanner.sendWrite ");
          this.serialport.write(buffer);
          if (wiredOrWireless !== "wired") await delay(20);
          let ack = (await readLine()) as string;
          ack += (await readLine()) as string;
          if (!ack.includes("true") || ack.includes("false")) {
            let retries = 3;
            if (wiredOrWireless !== "wired") await delay(100);
            while (retries > 0 && (!ack.includes("true") || ack.includes("false"))) {
              this.serialport.write("upgrade.keyscanner.sendWrite ");
              if (wiredOrWireless !== "wired") await delay(10);
              this.serialport.write(buffer);
              if (wiredOrWireless !== "wired") await delay(10);
              ack = (await readLine()) as string;
              ack += (await readLine()) as string;
              // log.info(`received ${ack} after ${3 - retries} retires`);
              retries -= 1;
            }
            if (retries === 0 && (!ack.includes("true") || ack.includes("false"))) {
              throw new Error("NACK after third attempt");
            }
          }
          stateUpd(side, (step / totalsteps) * 100);
          step += 1;
          // }
        }
        this.serialport.write("upgrade.keyscanner.validate\n");
        validate = (await readLine()) as string;
        validate += (await readLine()) as string;
        log.info("result of validation", validate);
        // retry++;
      } else {
        log.info("Skipping flash - firmware already up to date (CRC matches)");
      }

      await this.serialport.write("upgrade.keyscanner.finish\n");
      await readLine();
      await readLine();

      if (sideId === 1) {
        log.info("Going to close Serialport!");
        let limit = 10;
        while (this.serialport?.isOpen && limit > 0) {
          await this.serialport.drain();
          await this.serialport.close();
          await this.serialport.removeAllListeners();
          await this.serialport.destroy();
          // this.serialport = undefined;
          delay(100);
          limit -= 1;
        }
        this.serialport = undefined;

        log.info("after serialport close");
      }
    } catch (error) {
      log.info("error when flashing side");
      log.info("Going to close Serialport! cause its: ", this.serialport?.isOpen);
      let limit = 10;
      while (this.serialport !== undefined && this.serialport.isOpen && limit > 0) {
        await this.serialport.close();
        await this.serialport.removeAllListeners();
        await this.serialport.destroy();
        this.serialport = undefined;
        delay(100);
        limit -= 1;
      }
      this.serialport = undefined;
      throw new Error(`Error when flashing: ${error}`);
    }
    return { error: false, message: "" };
  }
}
