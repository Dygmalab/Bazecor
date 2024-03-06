/* Bazecor-hardware -- Bazecor Hardware library collection
 * Copyright (C) 2019, 2024  DygmaLab SE
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

import { RaiseANSI, RaiseANSIBootloader } from "../hardware-dygma-raise-ansi";
import { RaiseISO, RaiseISOBootloader } from "../hardware-dygma-raise-iso";
import { DefyWired, DefyWiredBootloader } from "../hardware-dygma-defy-wired";
import { DefyWireless, DefyWirelessBootloader } from "../hardware-dygma-defy-wireless";
import { Raise2ANSI, Raise2ANSIBootloader } from "../hardware-dygma-raise2-ansi";
import { Raise2ISO, Raise2ISOBootloader } from "../hardware-dygma-raise2-iso";

// const Hardware = {
//   serial: [Raise_ANSI, Raise_ISO, Raise_ANSIBootloader, Raise_ISOBootloader],
//   nonSerial: [],
//   bootloader: [Raise_ANSIBootloader, Raise_ISOBootloader]
// };

const Hardware = {
  serial: [RaiseISO, RaiseANSI, DefyWired, DefyWireless, Raise2ANSI, Raise2ISO],
  nonSerial: [DefyWiredBootloader],
  bootloader: [
    RaiseANSIBootloader,
    RaiseISOBootloader,
    DefyWiredBootloader,
    DefyWirelessBootloader,
    Raise2ANSIBootloader,
    Raise2ISOBootloader,
  ],
};

export default Hardware;
