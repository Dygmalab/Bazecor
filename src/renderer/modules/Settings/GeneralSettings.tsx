import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";

// Flags imports
import frenchF from "@Assets/flags/france.png";
import germanF from "@Assets/flags/germany.png";
import japaneseF from "@Assets/flags/japan.png";
import koreanF from "@Assets/flags/korean.png";
import spanishF from "@Assets/flags/spain.png";
import englishUSF from "@Assets/flags/englishUS.png";
import englishUKF from "@Assets/flags/englishUK.png";
import danishF from "@Assets/flags/denmark.png";
import swedishF from "@Assets/flags/sweden.png";
import finnishF from "@Assets/flags/finland.png";
import icelandicF from "@Assets/flags/iceland.png";
import norwegianF from "@Assets/flags/norway.png";
import swissF from "@Assets/flags/switzerland.png";
import eurkeyF from "@Assets/flags/eurkey.png";
import { useDevice } from "@Renderer/DeviceContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@Renderer/components/ui/card";
import { Switch } from "@Renderer/components/ui/switch";

import { IconChip, IconHanger, IconSun, IconMoon, IconScreen, IconKeyboard } from "../../component/Icon";
import { ToggleButtons } from "../../component/ToggleButtons";
import { Select } from "../../component/Select";
import Keymap from "../../../api/keymap";
import i18n from "../../i18n";
import Store from "../../utils/Store";
import { KeyPicker, KeyPickerPreview, Picker } from "../KeyPickerKeyboard";

const store = Store.getStore();

interface GeneralSettingsProps {
  selectDarkMode: (item: string) => void;
  darkMode: string;
  neurons: Record<string, unknown>[];
  selectedNeuron: number;
  devToolsSwitch: JSX.Element;
  verboseSwitch: JSX.Element;
}

const GeneralSettings = ({
  selectDarkMode,
  darkMode,
  neurons,
  selectedNeuron,
  devToolsSwitch,
  verboseSwitch,
}: GeneralSettingsProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [state] = useDevice();

  useEffect(() => {
    setSelectedLanguage(store.get("settings.language") as string);
  }, []);

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language);
    store.set("settings.language", `${language}`);
    if (state.currentDevice && !state.currentDevice.isClosed) {
      const deviceLang = { ...state.currentDevice.device, language: true };
      state.currentDevice.commands.keymap = new Keymap(deviceLang);
    }
  };

  let layersNames: any = neurons[selectedNeuron] ? neurons[selectedNeuron].layers : [];
  const flags = [
    englishUSF,
    englishUKF,
    spanishF,
    germanF,
    frenchF,
    frenchF,
    frenchF,
    swedishF,
    finnishF,
    danishF,
    norwegianF,
    icelandicF,
    japaneseF,
    koreanF,
    swissF,
    eurkeyF,
  ];
  let language: any = [
    "english",
    "british",
    "spanish",
    "german",
    "french",
    "frenchBepo",
    "frenchOptimot",
    "swedish",
    "finnish",
    "danish",
    "norwegian",
    "icelandic",
    "japanese",
    "korean",
    "swissGerman",
    "eurkey",
  ];
  const languageNames = [
    "English US",
    "English UK",
    "Spanish",
    "German",
    "French",
    "French Bépo",
    "French Optimot",
    "Swedish",
    "Finnish",
    "Danish",
    "Norwegian",
    "Icelandic",
    "Japanese",
    "Korean",
    "Swiss (German)",
    "EurKEY (1.3)",
  ];
  language = language.map((item: any, index: any) => ({
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
    <>
      <Card className="rounded-xl max-w-2xl mx-auto bg-white/60 dark:bg-gray-800">
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

      <Card className="mt-3 rounded-xl max-w-2xl mx-auto bg-white/60 dark:bg-gray-800">
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
              listElements={language}
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

      <Card className="mt-3 rounded-xl max-w-2xl mx-auto bg-white/60 dark:bg-gray-800">
        <CardHeader>
          <CardTitle variant="default">
            <IconChip /> Advanced
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <Form.Group controlId="DevTools" className="switchHolder">
              <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-700">
                <Form.Label className="mt-0">{i18n.preferences.devtools}</Form.Label>
                {devToolsSwitch}
                <Switch />
              </div>
            </Form.Group>

            <Form.Group controlId="Verbose" className="switchHolder">
              <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-700">
                <Form.Label>{i18n.preferences.verboseFocus}</Form.Label>
                {verboseSwitch}
              </div>
            </Form.Group>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default GeneralSettings;
