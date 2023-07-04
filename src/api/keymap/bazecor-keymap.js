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

import Focus from "../focus";

import KeymapDB from "./db";

global.keymap_instance = null;

class Keymap {
  constructor(opts) {
    // Add checking of language existing to call KeymapDB and change language from the local storage
    if (!global.keymap_instance || opts.language) {
      global.keymap_instance = this;
      this.db = new KeymapDB();
      this.legacyInterface = false;
    }
    global.keymap_instance.setLayerSize(opts);
    return global.keymap_instance;
  }

  setLayerSize(opts) {
    if (!opts || opts == undefined) return;

    if (typeof opts === "number") {
      this._layerSize = opts;
    } else if (typeof opts === "object") {
      this._layerSize = opts.keyboard.rows * opts.keyboard.columns;
    }

    return this;
  }

  _chunk(a, chunkSize) {
    const R = [];
    for (let i = 0; i < a.length; i += chunkSize) R.push(a.slice(i, i + chunkSize));
    return R;
  }

  async focus(s, keymap) {
    if (keymap && keymap.custom && keymap.custom.length > 0) {
      const flatten = arr => [].concat(...arr);

      if (this.legacyInterface) {
        const args = flatten(keymap.default.concat(keymap.custom)).map(k => this.db.serialize(k));

        return await s.request("keymap.map", ...args);
      }

      const args = flatten(keymap.custom).map(k => this.db.serialize(k));

      await s.request("keymap.onlyCustom", keymap.onlyCustom ? "1" : "0");
      return await s.request("keymap.custom", ...args);
    }
    let defaults;
    let custom;
    let onlyCustom;

    if (!this.legacyInterface) {
      defaults = await s.request("keymap.default");
      custom = await s.request("keymap.custom");
      onlyCustom = Boolean(parseInt(await s.request("keymap.onlyCustom")));
    }

    if (!defaults && !custom) {
      const keymap = (await s.request("keymap.map")).split(" ").filter(v => v.length > 0);
      const roLayers = parseInt((await s.request("keymap.roLayers")) || "0");

      defaults = keymap.slice(0, this._layerSize * roLayers).join(" ");
      custom = keymap.slice(this._layerSize * roLayers, keymap.length).join(" ");

      onlyCustom = false;
      this.legacyInterface = true;
    }
    const defaultKeymap = defaults
      .split(" ")
      .filter(v => v.length > 0)
      .map(k => this.db.parse(parseInt(k)));
    const customKeymap = custom
      .split(" ")
      .filter(v => v.length > 0)
      .map(k => this.db.parse(parseInt(k)));

    if (customKeymap.length == 0) {
      onlyCustom = false;
    }

    return {
      onlyCustom,
      custom: this._chunk(customKeymap, this._layerSize),
      default: this._chunk(defaultKeymap, this._layerSize),
    };
  }
}

// class OnlyCustom {
//   async focus(s, onlyCustom) {
//     if (onlyCustom === undefined) {
//       return Boolean(parseInt(await s.request("keymap.onlyCustom")));
//     }

//     return await s.request("keymap.onlyCustom", onlyCustom ? "1" : "0");
//   }
// }

const focus = new Focus();
focus.addCommands({
  keymap: new Keymap(),
});
focus.addMethod("setLayerSize", "keymap");

export { Keymap as default };
