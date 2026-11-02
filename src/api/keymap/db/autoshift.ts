/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2026  DygmaLab SE
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
import { CapsWordCodes } from "../../../hw/capsword";

/* CapsWord is a single assignable key, so it gets an ordinary table entry.
 *
 * Autoshift deliberately has none: its range holds one code per base key, and
 * a user never picks "autoshift A" from a list -- they pick A and tick the
 * checkbox. The table entries for that range are derived from the base keys at
 * runtime in KeymapDB, so the labels follow the selected layout instead of
 * being hardcoded to a US one. */
const CapsWord = {
  groupName: "CapsWord",
  keys: [
    {
      code: CapsWordCodes.CAPS_WORD,
      labels: {
        top: "CAPS",
        primary: "WORD",
        verbose: "CapsWord",
      },
    },
  ],
};

export default CapsWord;
export { CapsWord };
