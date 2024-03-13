/* eslint-disable no-bitwise */
export default function colorDarkerCalculation(color: string) {
  // Functions to convert colors
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
  // alert(hexToRgb("#0033ff").g); // "51";

  // alert(rgbToHex(0, 51, 255)); // #0033ff
  // function rgbToHex(r, g, b) {
  //   return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  // }
  // alert(rgbToHex(0, 51, 255)); // #0033ff

  const regexTestHEX = /^#([0-9a-f]{3}){1,2}$/i;

  // Calc matrix color but you need to convert to RGB color first
  const sumColor = (rgbColor: string) => {
    const localRgbColor = rgbColor.replace(/[^\d,]/g, "").split(",");
    const shadeDarkerInternal = `rgb(${(parseInt(localRgbColor[0], 10) * 0.25).toFixed(0)}, ${(
      parseInt(localRgbColor[1], 10) * 0.5
    ).toFixed(0)}, ${(parseInt(localRgbColor[2], 10) * 0.75).toFixed(0)} )`;
    return shadeDarkerInternal;
  };

  let safeRGBColor;
  let shadeDarker;

  if (regexTestHEX.test(color)) {
    // is Hexa
    // console.log("Color is Hexa: ", color);
    safeRGBColor = `rgb(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b})`;
    shadeDarker = sumColor(safeRGBColor);
  } else {
    // is rgba
    // console.log("Color is RGB: ", color);
    shadeDarker = sumColor(color);
  }

  return shadeDarker;
}
