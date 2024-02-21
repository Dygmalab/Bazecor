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

export interface WirelessPropsInterface {
  connected: boolean;
  path: string;
  darkMode: boolean;
  toggleDarkMode: (mode: string) => void;
  startContext: () => void;
  cancelContext: () => void;
  updateAllowBeta: (event: any) => void;
  allowBeta: boolean;
  inContext: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => unknown;
}

export interface WirelessInterface {
  battery: {
    LeftLevel: number;
    RightLevel: number;
    LeftState: number;
    RightState: number;
    savingMode: boolean;
  };
  energy: {
    modes: number;
    currentMode: number;
    disable: number;
  };
  bluetooth: {
    infoChannel1: string;
    infoChannel2: string;
    infoChannel3: string;
    infoChannel4: string;
    infoChannel5: string;
    deviceName: string;
  };
  rf: {
    channelHop: number;
    power: number;
  };
  brightness: number;
  brightnessUG: number;
  fade: number;
  idleleds: number;
  true_sleep: boolean;
  true_sleep_time: number;
}

export interface BatterySettingsProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  isCharging: boolean;
}

export interface EnergyManagementProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  updateTab?: (value: string) => void;
}

export interface AdvancedEnergyManagementProps {
  wireless: WirelessInterface;
  changeWireless: (wireless: WirelessInterface) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export interface RFSettingsProps {
  wireless?: WirelessInterface;
  changeWireless?: (wireless: WirelessInterface) => void;
  sendRePair: () => void;
}

export interface ConnectionProps {
  connection: number;
}

export interface SelectWirelessDropdownProps {
  // action: number;
  // activeTab: number;
  keyCode: { base: number; modified: number };
  onKeySelect: (event: number) => void;
  disable: boolean;
}

export interface WirelessButton {
  name: string;
  keynum: number;
}
