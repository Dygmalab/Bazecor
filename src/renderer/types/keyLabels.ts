/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
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

export interface KeyLabel {
  keyPosition: number;
  layer: number; // -1 means "all layers"
  label: string;
}

export interface KeyLabelsStore {
  version: 1;
  deviceId: string;
  labels: KeyLabel[];
}

export const MAX_LABEL_LENGTH = 50;

export const GLOBAL_LAYER = -1;
