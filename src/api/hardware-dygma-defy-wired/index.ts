/* bazecor-hardware-dygma-defy-wired -- Bazecor support for Dygma Defy wired
 * Copyright (C) 2019-2022 DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import log from "electron-log/renderer";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import KeymapDEFY from "./components/Keymap";
import aFN from "../arrayFillNum";

const DefyWired: DygmaDeviceType = {
  info: {
    vendor: "Dygma",
    product: "Defy",
    keyboardType: "wired",
    displayName: "Dygma Defy wired",
    urls: [
      {
        name: "Homepage",
        url: "https://www.dygma.com/defy/",
      },
    ],
  },
  usb: {
    vendorId: 0x35ef,
    productId: 0x0010,
  },
  keyboard: {
    rows: 5,
    columns: 16,
    left: [aFN(0, 7), aFN(16, 23), aFN(32, 39), aFN(48, 54), aFN(64, 72)],
    right: [aFN(9, 16), aFN(25, 32), aFN(41, 48), aFN(57, 64), aFN(72, 80)],
    ledsLeft: [...aFN(0, 35)],
    ledsRight: [...aFN(35, 70)],
  },
  keyboardUnderglow: {
    rows: 2,
    columns: 89,
    ledsLeft: [...aFN(70, 123)],
    ledsRight: [...aFN(123, 176)],
  },
  RGBWMode: true,
  components: {
    keymap: KeymapDEFY,
  },

  instructions: {
    en: {
      updateInstructions: `To update the firmware, the keyboard needs a special reset. When the countdown starts, press and hold the Escape key. Soon after the countdown finished, the Neuron's light should start a blue pulsing pattern, and the flashing will proceed. At this point, you should release the Escape key.`,
    },
  },

  flash: async (filename, filenameSides, flashDefy, stateUpdate) => {
    try {
      await flashDefy.updateFirmware(filename, filenameSides, stateUpdate);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  },

  isDeviceSupported: async () => true,
};

const DefyWiredBootloader: DygmaDeviceType = {
  info: {
    vendor: "Dygma",
    product: "Defy",
    keyboardType: "wired",
    displayName: "Dygma Defy wired",
    urls: [
      {
        name: "Homepage",
        url: "https://www.dygma.com/defy/",
      },
    ],
  },
  usb: {
    vendorId: 0x35ef,
    productId: 0x0011,
  },
  bootloader: true,
  instructions: {
    en: {
      updateInstructions: `To update the firmware, press the button at the bottom. You must not hold any key on the keyboard while the countdown is in progress, nor afterwards, until the flashing is finished. When the countdown reaches zero, the Neuron's light should start a blue pulsing pattern, and flashing will then proceed. `,
    },
  },
  flash: async (filename, filenameSides, flashDefy, stateUpdate) => {
    try {
      await flashDefy.updateFirmware(filename, filenameSides, stateUpdate);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  },
};

export { DefyWired, DefyWiredBootloader };
