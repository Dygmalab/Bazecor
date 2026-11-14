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
import { GraveEscapeCodes } from "../../../hw/graveescape";

/* Grave Escape is a single assignable key, so it gets an ordinary table entry. */
const GraveEscape = {
  groupName: "GraveEscape",
  keys: [
    {
      code: GraveEscapeCodes.GRAVE_ESCAPE,
      labels: {
        top: "GRAVE",
        primary: "ESC",
        verbose: "Grave Escape",
      },
    },
  ],
};

export default GraveEscape;
export { GraveEscape };
