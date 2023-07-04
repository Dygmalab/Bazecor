/* chrysalis-keymap -- Chrysalis keymap library
 * Copyright (C) 2018  Keyboardio, Inc.
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
const superkey = index => ({
  code: 53980 + index,
  labels: {
    primary: (index + 1).toString(),
    top: "SUPER",
  },
});

const superkeys = Array(128)
  .fill()
  .map((_, index) => superkey(index));

const SuperKeyTable = {
  groupName: "SuperKeys",
  keys: superkeys,
};

export default SuperKeyTable;
