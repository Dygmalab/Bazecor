/* bazecor-hardware-dygma-sonsei-wireless -- Bazecor support for Dygma Sonsei wireless
 * Copyright (C) 2019-2025 DygmaLab SE
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
import KeymapSONSEI from "./components/Keymap";
import aFN from "../arrayFillNum";

const sonseiKeyboard = {
  rows: 5,
  columns: 12,
  left: [aFN(0, 12), aFN(12, 24), aFN(24, 36), aFN(36, 48), aFN(48, 56)],
  right: [] as number[][],
  ledsLeft: [...aFN(0, 56)],
  ledsRight: [] as number[],
};

const sonseiUnderglow = {
  rows: 0,
  columns: 0,
  ledsLeft: [] as number[],
  ledsRight: [] as number[],
};

const updateInstructions = `To update the firmware, the keyboard needs a special reset. When the countdown starts, press and hold the Escape key. Soon after the countdown finished, the Neuron's light should start a blue pulsing pattern, and the flashing will proceed. At this point, you should release the Escape key.`;

const SonseiWireless: DygmaDeviceType = {
  info: {
    vendor: "Dygma",
    product: "Sonsei",
    keyboardType: "wireless",
    displayName: "Dygma Sonsei",
    urls: [
      {
        name: "Homepage",
        url: "https://www.dygma.com/sonsei/",
      },
    ],
  },
  usb: {
    vendorId: 0x35ef,
    productId: 0x0031,
  },
  keyboard: sonseiKeyboard,
  keyboardUnderglow: sonseiUnderglow,
  RGBWMode: false,
  hasRF: false,
  sides: 1,
  components: {
    keymap: KeymapSONSEI,
  },
  instructions: {
    en: {
      updateInstructions,
    },
  },

  flash: async (filename, bootloader, flashDefyWireless, stateUpdate) => {
    try {
      await flashDefyWireless.updateFirmware(filename, bootloader, stateUpdate);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  },
  isDeviceSupported: async () => true,
};

const SonseiWirelessBootloader: DygmaDeviceType = {
  info: {
    vendor: "Dygma",
    product: "Sonsei",
    keyboardType: "wireless",
    displayName: "Dygma Sonsei (bootloader)",
    urls: [
      {
        name: "Homepage",
        url: "https://www.dygma.com/sonsei/",
      },
    ],
  },
  usb: {
    vendorId: 0x35ef,
    productId: 0x0030,
  },
  bootloader: true,
  sides: 1,
  instructions: {
    en: {
      updateInstructions:
        "To update the firmware, press the button at the bottom. You must not hold any key on the keyboard while the countdown is in progress, nor afterwards, until the flashing is finished. When the countdown reaches zero, the Neuron's light should start a blue pulsing pattern, and flashing will then proceed.",
    },
  },
  flash: async (filename, bootloader, flashDefyWireless, stateUpdate) => {
    try {
      await flashDefyWireless.updateFirmware(filename, bootloader, stateUpdate);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  },
};

export { SonseiWireless, SonseiWirelessBootloader };
