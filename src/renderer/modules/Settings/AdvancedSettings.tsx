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

import React, { useState } from "react";
import log from "electron-log/renderer";

import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";
import { Switch } from "@Renderer/components/atoms/Switch";

import { useDevice } from "@Renderer/DeviceContext";
import { i18n } from "@Renderer/i18n";

// Own Components
import { Button } from "@Renderer/components/atoms/Button";
import ConfirmationDialog from "@Renderer/components/molecules/CustomModal/ConfirmationDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
// Icons Imports
import { IconChip, IconLayers } from "@Renderer/components/atoms/icons";
import { AdvancedSettingsProps } from "@Renderer/types/preferences";

interface LayerItemProps {
  text: string;
  value: number;
  index: number;
}

const AdvancedKeyboardSettings = () => {
  const [EEPROMClearConfirmationOpen, setEEPROMClearConfirmationOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const { state } = useDevice();

  const openEEPROMClearConfirmation = () => {
    setEEPROMClearConfirmationOpen(true);
  };

  const closeEEPROMClearConfirmation = () => {
    setEEPROMClearConfirmationOpen(false);
  };

  const clearEEPROM = async () => {
    setWorking(true);
    closeEEPROMClearConfirmation();
    if (state.currentDevice) {
      let eeprom = await state.currentDevice.command("eeprom.contents");
      eeprom = eeprom
        .split(" ")
        .filter((v: any) => v.length > 0)
        .map(() => 255)
        .join(" ");
      await state.currentDevice.noCacheCommand("eeprom.contents", eeprom);
    }
    setWorking(false);
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={openEEPROMClearConfirmation} disabled={working}>
        {i18n.keyboardSettings.resetEEPROM.button}
      </Button>
      <ConfirmationDialog
        title={i18n.keyboardSettings.resetEEPROM.dialogTitle}
        text={i18n.keyboardSettings.resetEEPROM.dialogContents}
        open={EEPROMClearConfirmationOpen}
        onConfirm={clearEEPROM}
        onCancel={closeEEPROMClearConfirmation}
      />
    </>
  );
};

const AdvancedSettings = ({
  connected,
  defaultLayer,
  selectDefaultLayer,
  keyboardType,
  neurons,
  selectedNeuron,
  onlyCustomLayers,
  onChangeOnlyCustomLayers,
}: AdvancedSettingsProps) => {
  let layersNames: any = neurons[selectedNeuron] ? neurons[selectedNeuron].layers : [];
  layersNames = layersNames.map((item: any, index: any) => ({
    text: item.name !== "" ? item.name : `Layer ${index + 1}`,
    value: index,
    index,
  }));
  layersNames.push({ text: i18n.keyboardSettings.keymap.noDefault, value: 126, index: 126 });

  log.info("defaultLayer: ", defaultLayer);

  const normalizeOnlyCustomLayers = (item: string | boolean): boolean => {
    if (typeof item === "string") {
      if (item === "1") {
        return true;
      }
      if (item === "0") {
        return false;
      }
    }
    return Boolean(item);
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle variant="default">
            <IconLayers /> Layers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <label htmlFor="selectDefaultLayer" className="flex mt-1 mb-2 text-sm font-semibold tracking-tight">
              {i18n.keyboardSettings.keymap.defaultLayer}
            </label>
            <Select value={String(defaultLayer)} onValueChange={e => selectDefaultLayer(e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Macro" />
              </SelectTrigger>
              <SelectContent>
                {layersNames.map((item: LayerItemProps) => (
                  <SelectItem value={String(item.value)} key={`layerItem-${item.value}`} disabled={!connected}>
                    {item.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>

          <div className="flex items-center w-full justify-between py-2 mt-3 border-t-[1px] border-gray-50 dark:border-gray-700">
            <label htmlFor="customSwitch" className="m-0 text-sm font-semibold tracking-tight">
              {i18n.preferences.onlyCustom}
            </label>
            <Switch
              id="customSwitch"
              defaultChecked={false}
              checked={normalizeOnlyCustomLayers(onlyCustomLayers)}
              onCheckedChange={onChangeOnlyCustomLayers}
              variant="default"
              size="sm"
            />
          </div>
        </CardContent>
      </Card>
      {keyboardType === "Raise" ? (
        <Card className="mt-3 max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle variant="default">
              <IconChip /> {i18n.keyboardSettings.resetEEPROM.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>{connected && <AdvancedKeyboardSettings />}</form>
          </CardContent>
        </Card>
      ) : (
        ""
      )}
    </>
  );
};

export default AdvancedSettings;
