// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

import LocalizedStrings from "react-localization";
import { Language } from "@Renderer/types/i18n";
import English from "@Renderer/i18n/en";

const strings: any = {
  en: English as Language,
};

const languages = new LocalizedStrings<Language>(strings);

const refreshHardware = ({ device }: any) => {
  languages.getAvailableLanguages().forEach(code => {
    strings[code].hardware = device.instructions ? device.instructions[code] : {};
  });

  const language = languages.getLanguage();
  Object.assign(languages, new LocalizedStrings(strings));
  languages.setLanguage(language);
};

function i18n() {
  return {
    ...languages,
    refreshHardware,
  };
}

export default i18n;
