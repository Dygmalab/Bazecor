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

import English from "./i18n/en";

const strings = {
  en: English,
};

const i18n = new LocalizedStrings(strings);
i18n.refreshHardware = ({ device }) => {
  i18n.getAvailableLanguages().forEach(code => {
    strings[code].hardware = device.instructions ? device.instructions[code] : {};
  });

  const language = i18n.getLanguage();
  Object.assign(i18n, new LocalizedStrings(strings));
  i18n.setLanguage(language);
};

export default i18n;
