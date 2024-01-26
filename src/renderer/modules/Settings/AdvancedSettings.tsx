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

import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import { Switch } from "@Renderer/components/ui/switch";

import { useDevice } from "@Renderer/DeviceContext";
import { Select } from "@Renderer/component/Select";
import { Neuron } from "@Renderer/types/neurons";
import BackupSettings from "./BackupSettings";
import i18n from "../../i18n";

// Own Components
import { RegularButton } from "../../component/Button";
import ConfirmationDialog from "../../component/ConfirmationDialog";

// Icons Imports
import { IconChip, IconLayers } from "../../component/Icon";
import { AdvancedSettingsProps } from "@Renderer/types/preferences";

const AdvancedKeyboardSettings = () => {
  const [EEPROMClearConfirmationOpen, setEEPROMClearConfirmationOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [state] = useDevice();

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
      await state.currentDevice.command("eeprom.contents", eeprom);
    }
    setWorking(false);
  };

  return (
    <>
      <RegularButton
        buttonText={i18n.keyboardSettings.resetEEPROM.button}
        styles="short danger"
        onClick={openEEPROMClearConfirmation}
        disabled={working}
      />
      <ConfirmationDialog
        title={i18n.keyboardSettings.resetEEPROM.dialogTitle}
        open={EEPROMClearConfirmationOpen}
        onConfirm={clearEEPROM}
        onCancel={closeEEPROMClearConfirmation}
      >
        {i18n.keyboardSettings.resetEEPROM.dialogContents}
      </ConfirmationDialog>
    </>
  );
};

const AdvancedSettings = ({
  connected,
  defaultLayer,
  selectDefaultLayer,
  keyboardType,
  neurons,
  neuronID,
  selectedNeuron,
  updateTab,
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
            <label htmlFor="selectDefaultLayer" className="m-0 text-sm font-semibold tracking-tight">
              {i18n.keyboardSettings.keymap.defaultLayer}
            </label>
            <Select
              id="selectDefaultLayer"
              onSelect={selectDefaultLayer}
              value={defaultLayer}
              listElements={layersNames}
              disabled={!connected}
            />
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
      <BackupSettings connected={connected} neurons={neurons} neuronID={neuronID} updateTab={updateTab} />
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
