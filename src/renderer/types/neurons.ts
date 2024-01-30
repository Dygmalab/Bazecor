/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
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

export interface LayerType {
  id: number;
  name: string;
}

export interface macrosType {
  actions: unknown;
  id: number;
  name: string;
  macro: string;
}

export interface superkeysType {
  actions: unknown;
  name: string;
  id: number;
}

export interface Neuron {
  id: string;
  name: string;
  layers: Array<LayerType>;
  macros: Array<macrosType>;
  superkeys: Array<superkeysType>;
}

export interface Neurons {
  neurons: Neuron[];
  selectedNeuron: number;
}