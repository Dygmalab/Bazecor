/* Bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2021  Dygma, Inc.
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

interface Macro {
  code: number;
  labels: {
    primary: string;
    top: string;
  };
}

/**
 * Creates a macro object with a specific code and labels.
 * @param {number} index - The index of the macro.
 * @returns {{code: number, labels: {primary: string, top: string}}} The macro object.
 */
const macro = (index: number): Macro => ({
  code: 53852 + index,
  labels: {
    primary: (index + 1).toString(),
    top: "MACRO",
  },
});

/**
 * An array of 128 macro objects.
 * @type {Array<Macro>}
 */
const macros: Array<Macro> = Array(128)
  .fill(0)
  .map((_, index) => macro(index));

/**
 * A table of macros for use in the keymap.
 * @type {{groupName: string, keys: Array<Macro>}}
 */
const MacrosTable: { groupName: string; keys: Array<Macro> } = {
  groupName: "Macros",
  keys: macros,
};

export default MacrosTable;
