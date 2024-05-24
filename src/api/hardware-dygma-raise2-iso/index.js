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

import KeymapISO from "./components/Keymap-ISO";

const Raise2ISO = {
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
    productId: 0x0023,
  },
  keyboard: {
    rows: 5,
    columns: 16,
  },
  keyboardUnderglow: {
    rows: 5,
    columns: 29,
  },
  RGBWMode: true,
  components: {
    keymap: KeymapISO,
  },

  instructions: {
    en: {
      updateInstructions: `To update the firmware, the keyboard needs a special reset. When the countdown starts, press and hold the Escape key. Soon after the countdown finished, the Neuron's light should start a blue pulsing pattern, and the flashing will proceed. At this point, you should release the Escape key.`,
    },
  },

  flash: async (_, filename, bootloader, flashDefyWireless, stateUpdate) => {
    try {
      await flashDefyWireless.updateFirmware(filename, bootloader, stateUpdate);
      return true;
    } catch (e) {
      return false;
    }
  },

  isDeviceSupported: () => "ISO",
};

const Raise2ISOBootloader = {
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
  flash: async (_, filename, bootloader, flashDefyWireless, stateUpdate) => {
    try {
      await flashDefyWireless.updateFirmware(filename, bootloader, stateUpdate);
      return true;
    } catch (e) {
      return false;
    }
  },
};

export { Raise2ISO, Raise2ISOBootloader };
