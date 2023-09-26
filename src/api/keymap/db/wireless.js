/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2023  DygmaLab SE
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
import { BatteryCodes } from "../../../hw/battery";
import { RFCodes } from "../../../hw/rf";
import { BluetoothCodes } from "../../../hw/bluetooth";
import { EnergyCodes } from "../../../hw/energy";

const Battery = {
  groupName: "Battery",
  keys: [
    {
      code: BatteryCodes.STATUS,
      labels: {
        top: "BATT.",
        primary: "LEVEL",
      },
    },
  ],
};
const Bluetooth = {
  groupName: "Bluetooth",
  keys: [
    {
      code: BluetoothCodes.PAIRING,
      labels: {
        top: "BLUET.",
        primary: "PAIR.",
      },
    },
  ],
};
const Energy = {
  groupName: "Energy",
  keys: [
    {
      code: EnergyCodes.STATUS,
      labels: {
        top: "ENERGY",
        primary: "STATUS",
      },
    },
  ],
};
const RF = {
  groupName: "RF",
  keys: [
    {
      code: RFCodes.STATUS,
      labels: {
        top: "RF",
        primary: "STATUS",
      },
    },
  ],
};

export { Battery, Bluetooth, Energy, RF };
