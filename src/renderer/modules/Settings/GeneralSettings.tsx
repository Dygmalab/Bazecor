import React, { useState, useEffect } from "react";
import Styled from "styled-components";

// Own Components
import { flags, languages, languageNames } from "./GeneralSettingsLanguages";
import { useDevice } from "@Renderer/DeviceContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@Renderer/components/ui/card";
import { Switch } from "@Renderer/components/ui/switch";

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

import { Neuron } from "@Renderer/types/neurons";
import { IconChip, IconHanger, IconSun, IconMoon, IconScreen, IconKeyboard, IconFlashlight } from "../../component/Icon";
import FileBackUpHandling from "./FileBackUpHandling";
import { ToggleButtons } from "../../component/ToggleButtons";
import { Select } from "../../component/Select";
import Keymap from "../../../api/keymap";
import i18n from "../../i18n";
import Store from "../../utils/Store";
import { KeyPickerPreview } from "../KeyPickerKeyboard";
import getLanguage from "../../utils/language";
import ToastMessage from "@Renderer/component/ToastMessage";
import { toast } from "react-toastify";

const GeneralSettingsWrapper = Styled.div`
.dropdown-menu {
  min-width: 13rem;
}
`;

const store = Store.getStore();

interface GeneralSettingsProps {
  connected: boolean;
  selectDarkMode: (item: string) => void;
  darkMode: string;
  neurons: Neuron[];
  selectedNeuron: number;
  devTools: boolean;
  onChangeDevTools: (checked: boolean) => void;
  verbose: boolean;
  onChangeVerbose: () => void;
  allowBeta: boolean;
  onChangeAllowBetas: (checked: boolean) => void;
}

const GeneralSettings = ({
  connected,
  selectDarkMode,
  darkMode,
  neurons,
  selectedNeuron,
  devTools,
  onChangeDevTools,
  verbose,
  onChangeVerbose,
  allowBeta,
  onChangeAllowBetas,
}: GeneralSettingsProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [state] = useDevice();

  useEffect(() => {
    setSelectedLanguage(getLanguage(store.get("settings.language") as string));
  }, []);

  const changeLanguage = (language: string) => {
    try {
      setSelectedLanguage(language);
      store.set("settings.language", `${language}`);
      if (state.currentDevice && !state.currentDevice.isClosed) {
        const deviceLang = { ...state.currentDevice.device, language: true };
        state.currentDevice.commands.keymap = new Keymap(deviceLang);
      }
      toast.success(<ToastMessage title={`${i18n.success.languageSaved} ${language}`} icon={<IconFlashlight />} />, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        icon: "",
      });
    } catch (error) {}
  };

  let layersNames: any = neurons[selectedNeuron] ? neurons[selectedNeuron].layers : [];
  const languageElements = languages.map((item, index) => ({
    text: languageNames[index],
    value: item,
    icon: flags[index],
    index,
  }));

  layersNames = layersNames.map((item: any, index: any) => ({
    text: item.name !== "" ? item.name : `Layer ${index + 1}`,
    value: index,
    index,
  }));
  layersNames.push({ text: i18n.keyboardSettings.keymap.noDefault, value: 126, index: 126 });

  const layoutsModes = [
    {
      name: "System",
      value: "system",
      icon: <IconScreen />,
      index: 0,
    },
    {
      name: "Dark",
      value: "dark",
      icon: <IconMoon />,
      index: 1,
    },
    {
      name: "Light",
      value: "light",
      icon: <IconSun />,
      index: 2,
    },
  ];
  const code = {
    base: 0,
    modified: 0,
  };

  return (
    <GeneralSettingsWrapper>
      <Card className="max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle variant="default">
            <IconHanger /> {i18n.preferences.darkMode.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <ToggleButtons selectDarkMode={selectDarkMode} value={darkMode} listElements={layoutsModes} styles="flex" size="sm" />
          </form>
        </CardContent>
      </Card>
      <Card className="mt-3 max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle variant="default">
            <IconKeyboard /> Key Layout
          </CardTitle>
          <CardDescription className="mt-1">
            Select the primary layout you&apos;d like to use as a reference when editing your layout in Bazecor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Select
              id="languageSelector"
              onSelect={changeLanguage}
              value={selectedLanguage}
              listElements={languageElements}
              disabled={false}
            />
          </form>
          <KeyPickerPreview
            code={code}
            disableMods="disabled"
            disableMove="preferences"
            disableAll={false}
            selectedlanguage={selectedLanguage}
            kbtype="ansi"
            activeTab="preferences"
          />
        </CardContent>
      </Card>
      {connected && <FileBackUpHandling />}
      <Card className="mt-3 max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle variant="default">
            <IconChip /> Advanced
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-50 dark:border-gray-700">
              <label htmlFor="devToolsSwitch" className="m-0 text-sm font-semibold tracking-tight">
                {i18n.preferences.devtools}
              </label>
              <Switch
                id="devToolsSwitch"
                defaultChecked={false}
                checked={devTools}
                onCheckedChange={onChangeDevTools}
                variant="default"
                size="sm"
              />
            </div>
            <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-50 dark:border-gray-700">
              <label htmlFor="verboseSwitch" className="m-0 text-sm font-semibold tracking-tight">
                {i18n.preferences.verboseFocus}
              </label>
              <Switch
                id="verboseSwitch"
                defaultChecked={false}
                checked={verbose}
                onCheckedChange={onChangeVerbose}
                variant="default"
                size="sm"
              />
            </div>
            <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-50 dark:border-gray-700">
              <label htmlFor="betasSwitch" className="m-0 text-sm font-semibold tracking-tight">
                {i18n.preferences.allowBeta}
              </label>
              <Switch
                id="betasSwitch"
                defaultChecked={false}
                checked={allowBeta}
                onCheckedChange={onChangeAllowBetas}
                variant="default"
                size="sm"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </GeneralSettingsWrapper>
  );
};

export default GeneralSettings;
