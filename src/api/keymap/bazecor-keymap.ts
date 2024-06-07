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

  // async focus(s: Focus, keymap: KeymapType) {
  //   if (keymap && keymap.custom && keymap.custom.length > 0) {
  //     const flatten = (arr: any) => [].concat(...arr);

  //     if (this.legacyInterface) {
  //       const args = flatten(keymap.default.concat(keymap.custom)).map(k => this.db.serialize(k));

  //       return (await s.request("keymap.map", ...args)) as string;
  //     }

  //     const args = flatten(keymap.custom).map(k => this.db.serialize(k));

  //     await s.request("keymap.onlyCustom", keymap.onlyCustom ? "1" : "0");
  //     return s.request("keymap.custom", ...args);
  //   }
  //   let defaults: string;
  //   let custom: string;
  //   let onlyCustom: boolean;

  //   if (!this.legacyInterface) {
  //     defaults = (await s.request("keymap.default")) as string;
  //     custom = (await s.request("keymap.custom")) as string;
  //     onlyCustom = Boolean(parseInt(await s.request("keymap.onlyCustom"), 10)) as boolean;
  //   }

  //   if (!defaults && !custom) {
  //     const localKeymap = ((await s.request("keymap.map")) as string).split(" ").filter(v => v.length > 0);
  //     const roLayers = parseInt((await s.request("keymap.roLayers")) || "0", 10);

  //     defaults = localKeymap.slice(0, this._layerSize * roLayers).join(" ");
  //     custom = localKeymap.slice(this._layerSize * roLayers, localKeymap.length).join(" ");

  //     onlyCustom = false;
  //     this.legacyInterface = true;
  //   }
  //   const defaultKeymap = defaults
  //     .split(" ")
  //     .filter(v => v.length > 0)
  //     .map(k => this.db.parse(parseInt(k, 10)));
  //   const customKeymap = custom
  //     .split(" ")
  //     .filter(v => v.length > 0)
  //     .map(k => this.db.parse(parseInt(k, 10)));

  //   if (customKeymap.length === 0) {
  //     onlyCustom = false;
  //   }

  //   return {
  //     onlyCustom,
  //     custom: this._chunk(customKeymap, this._layerSize),
  //     default: this._chunk(defaultKeymap, this._layerSize),
  //   };
  // }
}

// class OnlyCustom {
//   async focus(s, onlyCustom) {
//     if (onlyCustom === undefined) {
//       return Boolean(parseInt(await s.request("keymap.onlyCustom")));
//     }

//     return await s.request("keymap.onlyCustom", onlyCustom ? "1" : "0");
//   }
// }

// const focus = Focus.getInstance();
// focus.addCommands({
//   keymap: new Keymap(),
// });
// focus.addMethod("setLayerSize", "keymap");

export default Keymap;
