/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018  Keyboardio, Inc.
 * Copyright (C) 2019  DygmaLab SE
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

const LEDEffectsTable = {
  groupName: "LED Effect",
  keys: [
    {
      code: 17152,
      labels: {
        primary: "+",
        top: "✨",
        verbose: "Next LED"
      }
    },
    {
      code: 17153,
      labels: {
        primary: "-",
        top: "✨",
        verbose: "Previous LED"
      }
    },
    {
      code: 17154,
      labels: {
        primary: "+/-",
        top: "✨",
        verbose: "Toggle LED"
      }
    }
  ]
};

export default LEDEffectsTable;
