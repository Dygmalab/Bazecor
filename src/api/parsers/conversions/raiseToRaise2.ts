import { PaletteType } from "@Renderer/types/layout";
import { rgb2w } from "../../color";
import type { RGBWConversionProfile } from "../../color";

export const convertKeymapRtoR2 = (layer: number[], keyboardType: string) => {
  let localLayer = [...layer];
  // restoring thumbcluster
  const preT = localLayer.slice(0, 69);
  const remT = localLayer[69];
  const movT = localLayer.slice(70, 72);
  const restT = localLayer.slice(72);
  localLayer = preT.concat(movT.concat(remT)).concat(restT);

  // if ansi
  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const symbolK = localLayer[31];
    const enterK = localLayer[47];

    localLayer[31] = enterK;
    localLayer[47] = symbolK;
    // Move shift (48<>49)
    const shiftK = localLayer[48];
    const extraK = localLayer[49];

    localLayer[48] = extraK;
    localLayer[49] = shiftK;
  }

  // if layout !== layout, solve shift & enter
  return localLayer;
};

export const convertColormapRtoR2 = (layer: number[], keyboardType: string, backupKeyboardType: string) => {
  const color = layer[130];
  const rest = layer.slice(0, -1);
  const result = rest.concat(new Array(45).fill(color));

  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const symbolC = result[40];
    const enterC = result[48];

    result[40] = enterC;
    result[48] = symbolC;
  }

  if (keyboardType === "ANSI" && backupKeyboardType === "ISO") {
    // Move shift (48<>49)
    const shiftC = result[19];
    const extraC = result[20];

    result[19] = extraC;
    result[20] = shiftC;
  }

  return result;
};

export const convertPaletteRtoR2 = (color: PaletteType, profile?: RGBWConversionProfile) => {
  const rgbw = rgb2w(color, profile);
  return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
};
