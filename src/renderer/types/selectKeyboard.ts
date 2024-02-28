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

import { DeviceClass } from "./devices";

export interface SelectKeyboardProps {
  onConnect: (...args: any[]) => any;
  onDisconnect: () => void;
  connected: boolean;
  device: unknown;
  darkMode: boolean;
  restoredOk: boolean;
  setLoading: (loading: boolean) => void;
}

export interface NeuronConnectionProps {
  loading: boolean;
  scanFoundDevices: boolean;
  scanDevices: () => void;
  onKeyboardConnect: () => Promise<void>;
  connected: boolean;
  onDisconnect: () => Promise<void>;
  onDisconnectConnect: () => Promise<void>;
  deviceItems: any;
  selectPort: (event: any) => void;
  selectedPortIndex: number;
  isVirtual: boolean;
  virtualDevice: DeviceClass;
  connectedDeviceIndex: number;
}

export interface DeviceItemsType {
  index: number;
  displayName: string;
  userName: string;
  path: string;
}
