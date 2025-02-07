/* bazecor-flash-defy-wired -- Dygma Defy wired flash helper for Bazecor
 * Copyright (C) 2019, 2022  DygmaLab SE
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

import { ipcRenderer } from "electron";
import log from "electron-log/renderer";
import fs from "fs";
import * as path from "path";
import SideFlaser from "./sideFlasher";
import { delay } from "../../../main/utils/delay";

/**
 * Object rp2040 with flash method.
 */
export default class Rp2040 {
  device: any;
  sideflash: any;
  constructor(device: any) {
    this.device = device;
    this.sideflash = null;
  }

  async flash(
    firmware: Buffer,
    stateUpdate: (arg0: number, arg1: number) => void,
    finished: (arg0: boolean, arg1: string) => void,
  ) {
    log.info("flashing rp2040 with rom bootloader", this.device);
    ipcRenderer.invoke("list-drives").then(result => {
      const finalPath = path.join(result, "default.uf2");
      // log.info("RESULTS!!!", result, "default.uf2", " to ", finalPath);
      fs.writeFileSync(finalPath, Buffer.from(new Uint8Array(firmware)));
      stateUpdate(3, 80);
      finished(false, "");
    });
  }

  async sideFlash(
    firmwareSides: any,
    stateUpdate: (arg0: number, arg1: number) => void,
    wiredOrWireless: boolean,
    finished: (arg0: boolean, arg1: string) => void,
  ) {
    // State update auxiliarly function
    let step = 0;

    // Flashing procedure for each side
    stateUpdate(3, step);
    this.sideflash = new SideFlaser(firmwareSides);
    let result = await this.sideflash.flashSide("right", stateUpdate, wiredOrWireless);
    if (result.error) finished(result.error, result.message);
    log.info("Right side flash has error? ", result.error);
    step += 25;
    stateUpdate(3, step);
    result = await this.sideflash.flashSide("left", stateUpdate, wiredOrWireless);
    if (result.error) finished(result.error, result.message);
    log.info("Left side flash has error? ", result.error);
    step += 25;
    stateUpdate(3, step);
    await delay(20);
    finished(false, "");
  }

  async prepareNeuron() {
    const result = await this.sideflash.prepareNeuron();
    return result;
  }
}
