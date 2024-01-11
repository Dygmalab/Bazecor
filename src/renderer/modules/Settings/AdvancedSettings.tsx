import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";

import { useDevice } from "@Renderer/DeviceContext";
import { Select } from "@Renderer/component/Select";
import i18n from "../../i18n";

// Own Components
import { RegularButton } from "../../component/Button";
import ConfirmationDialog from "../../component/ConfirmationDialog";

// Icons Imports
import { IconChip, IconLayers } from "../../component/Icon";

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

interface AdvancedSettingsProps {
  connected: boolean;
  defaultLayer: number;
  selectDefaultLayer: () => void;
  neurons: Record<string, unknown>[];
  selectedNeuron: number;
}

const AdvancedSettings = ({ connected, selectDefaultLayer, defaultLayer, neurons, selectedNeuron }: AdvancedSettingsProps) => {
  let layersNames: any = neurons[selectedNeuron] ? neurons[selectedNeuron].layers : [];
  layersNames = layersNames.map((item: any, index: any) => ({
    text: item.name !== "" ? item.name : `Layer ${index + 1}`,
    value: index,
    index,
  }));
  layersNames.push({ text: i18n.keyboardSettings.keymap.noDefault, value: 126, index: 126 });
  return (
    <>
      <Card className="rounded-xl max-w-2xl mx-auto bg-white/60 dark:bg-gray-800">
        <CardHeader>
          <CardTitle variant="default">
            <IconLayers /> {i18n.keyboardSettings.keymap.defaultLayer}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <Select
              id="selectDefaultLayer"
              onSelect={selectDefaultLayer}
              value={defaultLayer}
              listElements={layersNames}
              disabled={!connected}
            />
          </form>
        </CardContent>
      </Card>

      <Card className="mt-3 rounded-xl max-w-2xl mx-auto bg-white/60 dark:bg-gray-800">
        <CardHeader>
          <CardTitle variant="default">
            <IconChip /> {i18n.keyboardSettings.resetEEPROM.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>{connected && <AdvancedKeyboardSettings />}</form>
        </CardContent>
      </Card>
    </>
  );
};

export default AdvancedSettings;
