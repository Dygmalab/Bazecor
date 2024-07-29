/* bazecor-hardware-dygma-raise2 -- Bazecor support for Dygma Raise
 * Copyright (C) 2024 DygmaLab SE
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
 *
 * PID will be 0x0020, 0x0021, etc...
 * 0 = bootloader ANSI
 * 1 = ANSI
 * 2 = bootloader ISO
 * 3 = ISO
 *
 */

import log from "electron-log/renderer";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import KeymapISO from "./components/Keymap-ISO";
import aFN from "../arrayFillNum";

const Raise2ISO: DygmaDeviceType = {
  info: {
    vendor: "Dygma",
    product: "Raise2",
    keyboardType: "ISO",
    displayName: "Dygma Raise 2 ISO",
    urls: [
      {
        name: "Homepage",
        url: "https://www.dygma.com/raise/",
      },
    ],
  },
  usb: {
    vendorId: 0x35ef,
    productId: 0x0021,
  },
  keyboard: {
    rows: 5,
    columns: 16,
    left: [aFN(0, 7), aFN(16, 23), aFN(32, 39), aFN(48, 55), aFN(64, 72)],
    right: [aFN(9, 16), aFN(24, 32), aFN(41, 48), aFN(57, 64), aFN(72, 80)],
    ledsLeft: [...aFN(0, 33)],
    ledsRight: [...aFN(33, 69)],
  },
  keyboardUnderglow: {
    rows: 5,
    columns: 29,
    ledsLeft: [...aFN(69, 105)],
    ledsRight: [...aFN(105, 144)],
  },
  RGBWMode: true,
  bootloader: false,
  wireless: true,
  components: {
    keymap: KeymapISO,
  },

  instructions: {
    en: {
      updateInstructions: `To update the firmware, the keyboard needs a special reset. When the countdown starts, press and hold the Escape key. Soon after the countdown finished, the Neuron's light should start a blue pulsing pattern, and the flashing will proceed. At this point, you should release the Escape key.`,
    },
  },

  flash: async (
    filename: any,
    bootloader: any,
    flashDefyWireless: { updateFirmware: (arg0: any, arg1: any, arg2: any) => any },
    stateUpdate: any,
  ) => {
    try {
      await flashDefyWireless.updateFirmware(filename, bootloader, stateUpdate);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  },
};

const Raise2ISOBootloader: DygmaDeviceType = {
  info: {
    vendor: "Dygma",
    product: "Raise2",
    keyboardType: "ISO",
    displayName: "Dygma Raise2 ISO",
    urls: [
      {
        name: "Homepage",
        url: "https://www.dygma.com/raise/",
      },
    ],
  },
  usb: {
    vendorId: 0x35ef,
    productId: 0x0022,
  },
  bootloader: true,
  instructions: {
    en: {
      updateInstructions: `To update the firmware, press the button at the bottom. You must not hold any key on the keyboard while the countdown is in progress, nor afterwards, until the flashing is finished. When the countdown reaches zero, the Neuron's light should start a blue pulsing pattern, and flashing will then proceed. `,
    },
  },
  flash: async (
    filename: any,
    bootloader: any,
    flashDefyWireless: { updateFirmware: (arg0: any, arg1: any, arg2: any) => any },
    stateUpdate: any,
  ) => {
    try {
      await flashDefyWireless.updateFirmware(filename, bootloader, stateUpdate);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  },
};

export { Raise2ISO, Raise2ISOBootloader };
