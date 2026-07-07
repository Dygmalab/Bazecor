import { PaletteType } from "@Renderer/types/layout";

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
  // Raise 1: 69 keyboard + 30 UG left + 33 UG right = 132 total
  // Raise 2: 69 keyboard + 53 UG left + 54 UG right = 176 total
  
  // Ensure we only take the first 132 LEDs (one layer from Raise 1)
  const raise1Layer = layer.slice(0, 132);
  
  const keyboardLEDs = raise1Layer.slice(0, 69); // Keep keyboard LEDs as-is
  const ugLeftR1 = raise1Layer.slice(69, 99);    // 30 LEDs underglow left Raise 1
  const ugRightR1 = raise1Layer.slice(99, 132);  // 33 LEDs underglow right Raise 1
  
  // Interpolate underglow left from 30 to 53 LEDs
  const ugLeftR2 = [];
  for (let i = 0; i < 53; i++) {
    const sourceIndex = Math.floor((i / 53) * 30);
    ugLeftR2.push(ugLeftR1[sourceIndex] !== undefined ? ugLeftR1[sourceIndex] : 15);
  }
  
  // Interpolate underglow right from 33 to 54 LEDs
  const ugRightR2 = [];
  for (let i = 0; i < 54; i++) {
    const sourceIndex = Math.floor((i / 54) * 33);
    ugRightR2.push(ugRightR1[sourceIndex] !== undefined ? ugRightR1[sourceIndex] : 15);
  }
  
  const result = keyboardLEDs.concat(ugLeftR2).concat(ugRightR2);

  // Note: We don't swap colors for ANSI/ISO differences because the colormap
  // indices don't directly correspond to keymap positions. The led_map in the
  // component handles the mapping from key positions to LED indices.

  return result;
};

export const convertPaletteRtoR2 = (color: PaletteType) => {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
    rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
  };
};
