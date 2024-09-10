/* eslint-disable class-methods-use-this */
/* eslint-disable no-bitwise */
/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019, 2020  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { KeyType } from "@Renderer/types/layout";
import BlankTable from "./db/blanks";
import { LetterTable, ModifiedLetterTables } from "./db/letters";
import DigitTable, { ModifiedDigitTables } from "./db/digits";
import { LockLayerTable, ShiftToLayerTable, MoveToLayerTable } from "./db/layerswitch";
import PunctuationTable, { ModifiedPunctuationTables } from "./db/punctuation";
import SpacingTable, { ModifiedSpacingTables } from "./db/spacing";
import ModifiersTable, { ModifiedModifiersTables, HyperMehTable } from "./db/modifiers";
import NavigationTable, { ModifiedNavigationTables } from "./db/navigation";
import LEDEffectsTable from "./db/ledeffects";
import MacrosTable from "./db/macros";
import SuperKeyTable from "./db/superkeys";
import TapDanceTable from "./db/tapdance";
import { Battery, Bluetooth, Energy, RF } from "./db/wireless";
import NumpadTable, { ModifiedNumpadTables } from "./db/numpad";
import FunctionKeyTable, { ModifiedFunctionKeyTables } from "./db/fxs";

import MediaControlTable from "./db/mediacontrols";
import { MouseMovementTable, MouseWheelTable, MouseButtonTable } from "./db/mousecontrols";
import MiscellaneousTable, { ModifiedMiscellaneousTables } from "./db/miscellaneous";

import { OneShotModifierTable, OneShotLayerTable } from "./db/oneshot";
import { DualUseModifierTables, DualUseLayerTables } from "./db/dualuse";
import LeaderTable from "./db/leader";
import StenoTable from "./db/steno";
import SpaceCadetTable from "./db/spacecadet";

// languageLayouts - all available languages for layouts
import { languagesDB, supportModifiedTables } from "./languages/languageLayouts";

// newLanguageLayout - is a function that modify language layout
import newLanguageLayout from "./languages/newLanguageLayout";

import Store from "../../renderer/utils/Store";
import getLanguage from "../../renderer/utils/language";
import { BaseKeycodeTableType, KeymapCodeTableType, LanguageType } from "./types";

const store = Store.getStore();

const defaultBaseKeyCodeTable: BaseKeycodeTableType[] = [
  LetterTable,
  DigitTable,
  PunctuationTable,
  SpacingTable,
  ModifiersTable,
  NavigationTable,
  FunctionKeyTable,
  NumpadTable,
  MiscellaneousTable,

  ShiftToLayerTable,
  LockLayerTable,
  MoveToLayerTable,

  LEDEffectsTable,
  MacrosTable,
  SuperKeyTable,
  TapDanceTable,
  MediaControlTable,
  MouseMovementTable,
  MouseButtonTable,
  MouseWheelTable,

  OneShotModifierTable,
  OneShotLayerTable,
  LeaderTable,
  StenoTable,
  SpaceCadetTable,
  Battery,
  Bluetooth,
  Energy,
  RF,
  BlankTable,
];

const defaultKeyCodeTable = defaultBaseKeyCodeTable
  .concat(ModifiedLetterTables)
  .concat(ModifiedDigitTables)
  .concat(ModifiedPunctuationTables)
  .concat(ModifiedSpacingTables)
  .concat(ModifiedNavigationTables)
  .concat(ModifiedModifiersTables)
  .concat(HyperMehTable)
  .concat(ModifiedFunctionKeyTables)
  .concat(ModifiedNumpadTables)
  .concat(ModifiedMiscellaneousTables)
  .concat(DualUseModifierTables)
  .concat(DualUseLayerTables);

// Create cache for language layout
const map = new Map();

// eslint-disable-next-line import/no-mutable-exports
let baseKeyCodeTable: BaseKeycodeTableType[];
// eslint-disable-next-line import/no-mutable-exports
let keyCodeTable: BaseKeycodeTableType[];

class KeymapDB {
  keymapCodeTable: KeymapCodeTableType[];
  language: LanguageType;
  allCodes: BaseKeycodeTableType[];

  constructor() {
    this.keymapCodeTable = new Array<KeymapCodeTableType>();
    // create variable that get language from the local storage
    this.language = getLanguage(store.get("settings.language"));
    if (languagesDB[this.language] === undefined) {
      this.language = "en-US";
    }

    // Modify our baseKeyCodeTable, depending on the language selected by the static methods and by inside function newLanguageLayout
    baseKeyCodeTable = this.updateBaseKeyCode();
    const keyCodeTableWithModifiers =
      this.language !== "en-US" && supportModifiedTables[this.language]
        ? defaultKeyCodeTable.concat(supportModifiedTables[this.language])
        : defaultKeyCodeTable;
    // Modify our baseKeyCodeTable, depending on the language selected through function newLanguageLayout
    keyCodeTable = baseKeyCodeTable.concat(
      newLanguageLayout(
        keyCodeTableWithModifiers.slice(defaultBaseKeyCodeTable.length),
        this.language,
        languagesDB[this.language],
      ),
    );
    this.allCodes = keyCodeTable;

    for (const group of keyCodeTable) {
      for (const key of group.keys) {
        let value;

        if (key.labels) {
          value = key;
        } else {
          value = {
            code: key.code,
            labels: {
              primary: `#${key.code.toString()}`,
            },
          };
        }

        this.keymapCodeTable[key.code] = value;
      }
    }
  }

  parseModifs(keycode: number) {
    let modified = 0;
    if (keycode & 0b100000000) {
      // Ctrl Decoder
      modified += 256;
    }
    if (keycode & 0b1000000000) {
      // Alt Decoder
      modified += 512;
    }
    if (keycode & 0b10000000000) {
      // AltGr Decoder
      modified += 1024;
    }
    if (keycode & 0b100000000000) {
      // Shift Decoder
      modified += 2048;
    }
    if (keycode & 0b1000000000000) {
      // Win Decoder
      modified += 4096;
    }
    if (keycode > 49152) {
      if (keycode < 51218) {
        return modified + 49169;
      }
      return modified + 49169 + 1;
    }
    return modified;
  }

  appliedModifs(keycode: number) {
    type ModifsType = {
      mehApplied: boolean;
      hyperApplied: boolean;
      altApplied: boolean;
      altGrApplied: boolean;
      ctrlApplied: boolean;
      shiftApplied: boolean;
      osApplied: boolean;
    };

    const result: ModifsType = {
      mehApplied: false,
      hyperApplied: false,
      altApplied: false,
      altGrApplied: false,
      ctrlApplied: false,
      shiftApplied: false,
      osApplied: false,
    };
    if (keycode & 0b100000000) {
      // Ctrl Decoder
      result.ctrlApplied = true;
    }
    if (keycode & 0b1000000000) {
      // Alt Decoder
      result.altApplied = true;
    }
    if (keycode & 0b10000000000) {
      // AltGr Decoder
      result.altGrApplied = true;
    }
    if (keycode & 0b100000000000) {
      // Shift Decoder
      result.shiftApplied = true;
    }
    if (keycode & 0b1000000000000) {
      // Win Decoder
      result.osApplied = true;
    }
    if (keycode & 0b0101100000000) {
      // Meh Decoder
      result.mehApplied = true;
    }
    if (keycode & 0b1101100000000) {
      // Hyper Decoder
      result.hyperApplied = true;
    }
    return result;
  }

  keySegmentator(keyCode: number) {
    let code = { base: 0, modified: 0 };
    const modified = this.parseModifs(keyCode);
    switch (true) {
      case keyCode < 256:
      case BlankTable.keys.map(r => r.code).includes(keyCode):
      case MediaControlTable.keys.map(r => r.code).includes(keyCode):
      case MouseMovementTable.keys.map(r => r.code).includes(keyCode):
      case MouseWheelTable.keys.map(r => r.code).includes(keyCode):
      case MouseButtonTable.keys.map(r => r.code).includes(keyCode):
        // Regular keys KeyCode
        code = { base: keyCode, modified: 0 };
        break;
      case keyCode < 8192:
        // Reguar key with Modifier KeyCode
        code = { base: keyCode - modified, modified };
        break;
      case keyCode < 17152:
        // Yet to review
        code = { base: keyCode, modified: 0 };
        break;
      case LEDEffectsTable.keys.map(r => r.code).includes(keyCode):
        // LED effect keys
        code = { base: keyCode, modified: 0 };
        break;
      case ShiftToLayerTable.keys.map(r => r.code).includes(keyCode):
        // Layer switch keys
        code = { base: keyCode - 17450, modified: 17450 };
        break;
      case LockLayerTable.keys.map(r => r.code).includes(keyCode):
        // Layer Move not used keys
        code = { base: keyCode - 17408, modified: 17408 };
        break;
      case MoveToLayerTable.keys.map(r => r.code).includes(keyCode):
        // Layer Lock keys
        code = { base: keyCode - 17492, modified: 17492 };
        break;
      case OneShotModifierTable.keys.map(r => r.code).includes(keyCode):
      case OneShotLayerTable.keys.map(r => r.code).includes(keyCode):
      case keyCode < 49169:
        // Yet to review
        code = { base: 0, modified: keyCode };
        break;
      case keyCode < 53266:
        // Dual Function Keycode
        code = { base: keyCode - modified, modified };
        break;
      case TapDanceTable.keys.map(r => r.code).includes(keyCode):
      case LeaderTable.keys.map(r => r.code).includes(keyCode):
      case StenoTable.keys.map(r => r.code).includes(keyCode):
      case SpaceCadetTable.keys.map(r => r.code).includes(keyCode):
        // Multiple special keys
        code = { base: 0, modified: keyCode };
        break;
      case MacrosTable.keys.map(r => r.code).includes(keyCode):
        // Macros keys
        code = { base: keyCode - 53852, modified: 53852 };
        break;
      case SuperKeyTable.keys.map(r => r.code).includes(keyCode):
        // Superkeys keys
        code = { base: keyCode - 53980, modified: 53980 };
        break;
      default:
        code = { base: keyCode, modified: 0 };
        break;
    }
    return code;
  }

  parse(keyCode: number) {
    let key;
    let localKeyCode = keyCode;

    if (!localKeyCode) localKeyCode = 0;

    if (localKeyCode < this.keymapCodeTable.length) {
      key = this.keymapCodeTable[localKeyCode];
    }

    if (!key) {
      key = {
        code: localKeyCode,
        labels: {
          primary: `#${localKeyCode.toString()}`,
        },
      };
    }

    return {
      keyCode: key.code,
      label: key.labels.primary,
      extraLabel: key.labels.top,
      verbose: key.labels.verbose,
      alt: key.alt,
    };
  }

  reverse(label: string) {
    const answ = this.keymapCodeTable.filter(Boolean).find((x: any) => x.labels.primary === label);
    return answ !== undefined ? answ.code : 1;
  }

  reverseSub(label: string, top: string) {
    const answ = this.keymapCodeTable.filter(Boolean).find((x: any) => x.labels.primary === label && x.labels.top === top);
    return answ !== undefined ? answ.code : 1;
  }

  getMap() {
    return this.keymapCodeTable.filter(Boolean).filter((x: any) => x.code < 255 && x.code > 0);
  }

  serialize(key: KeyType) {
    return key.keyCode;
  }

  updateBaseKeyCode() {
    this.language = getLanguage(store.get("settings.language"));
    if (languagesDB[this.language] === undefined) {
      this.language = "en-US";
    }
    // Checking language in the cache
    if (map.has(this.language)) {
      // Return language layout from the cache
      return map.get(this.language);
    }
    // Creating language layout and add it into cache
    const newBase = newLanguageLayout(defaultBaseKeyCodeTable, this.language, languagesDB[this.language]);
    map.set(this.language, newBase);
    // Return new language layout
    return newBase;
  }
}

export default KeymapDB;
export { baseKeyCodeTable, keyCodeTable, languagesDB };
