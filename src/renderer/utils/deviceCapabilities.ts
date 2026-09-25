/* Bazecor
 * Copyright (C) 2025  DygmaLab SE.
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

/** True when `deviceType` (Bazecor `info.product`) names a Sonsei. */
export function isSonsei(deviceType: string | undefined): boolean {
  return !!deviceType && deviceType.toLowerCase().includes("sonsei");
}

/**
 * True sleep cuts power to the keyscanner sides once the LEDs are off. The
 * Sonsei doesn't expose it as a user setting — the board handles its own deep
 * sleep — so Bazecor hides the control for it and always writes
 * `idleleds.true_sleep 0`, whatever the firmware happens to report back.
 */
export function supportsTrueSleep(deviceType: string | undefined): boolean {
  return !isSonsei(deviceType);
}
