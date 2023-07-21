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

const Battery = {
  groupName: "Battery",
  keys: [
    {
      code: 54108,
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
      code: 54109,
      labels: {
        top: "BLUET.",
        primary: "STAT.",
      },
    },
    {
      code: 54110,
      labels: {
        top: "BLUET.",
        primary: "DISC.",
      },
    },
  ],
};
const Energy = {
  groupName: "Energy",
  keys: [
    {
      code: 54111,
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
      code: 54112,
      labels: {
        top: "RF",
        primary: "STATUS",
      },
    },
  ],
};

export { Battery, Bluetooth, Energy, RF };
