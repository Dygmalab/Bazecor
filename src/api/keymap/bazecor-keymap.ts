/* eslint-disable class-methods-use-this */
/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018  Keyboardio, Inc.
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

// import { KeymapType } from "@Renderer/types/layout";
// import Focus from "../focus";

import KeymapDB from "./db";

declare global {
  namespace globalThis {
    var keymap_instance: Keymap;
  }
}

global.keymap_instance = null;

class Keymap {
  db: KeymapDB;
  legacyInterface: boolean;
  _layerSize: number;
  constructor(opts?: any) {
    // Add checking of language existing to call KeymapDB and change language from the local storage
    if (!global.keymap_instance || opts.language) {
      global.keymap_instance = this;
      this.db = new KeymapDB();
      this.legacyInterface = false;
    }
    global.keymap_instance.setLayerSize(opts);
    // eslint-disable-next-line no-constructor-return
    return global.keymap_instance;
  }

  setLayerSize(opts: number | { keyboard: { rows: number; columns: number } }) {
    if (!opts || opts === undefined) return;

    if (typeof opts === "number") {
      this._layerSize = opts;
    } else if (typeof opts === "object") {
      this._layerSize = opts.keyboard.rows * opts.keyboard.columns;
    }
  }

  _chunk(a: any[], chunkSize: number) {
    const R = [];
    for (let i = 0; i < a.length; i += chunkSize) R.push(a.slice(i, i + chunkSize));
    return R;
  }
}

export default Keymap;
