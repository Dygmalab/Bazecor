import { PaletteType } from "@Renderer/types/layout";

export const convertKeymapR2toR = (layer: number[], keyboardType: string) => {
  let localLayer = [...layer];
  // restoring thumbcluster
  const preT = localLayer.slice(0, 69);
  const movT = localLayer.slice(69, 71);
  const remT = localLayer[71];
  const restT = localLayer.slice(72);
  localLayer = preT.concat([remT].concat(movT)).concat(restT);

  // if ansi
  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const enterK = localLayer[31];
    const symbolK = localLayer[47];

    localLayer[31] = symbolK;
    localLayer[47] = enterK;
    // Move shift (48<>49)
    const extraK = localLayer[48];
    const shiftK = localLayer[49];

    localLayer[48] = shiftK;
    localLayer[49] = extraK;
  }

  // if layout !== layout, solve shift & enter
  return localLayer;
};

export const convertColormapR2toR = (layer: number[], keyboardType: string, backupKeyboardType: string) => {
  const rest = layer.slice(0, 132);
  const result = rest;

  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const enterC = result[40];
    const symbolC = result[48];

    result[40] = symbolC;
    result[48] = enterC;
  }

  if (keyboardType === "ANSI" && backupKeyboardType === "ISO") {
    // Move shift (48<>49)
    const extraC = result[19];
    const shiftC = result[20];

    result[19] = shiftC;
    result[20] = extraC;
  }

  return result;
};

export const convertPaletteR2toR = (color: PaletteType) => {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
    rgb: `rgb(${color.r}, ${color.g}, ${color.b})`
  };
};
