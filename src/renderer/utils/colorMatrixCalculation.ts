/* eslint-disable no-bitwise */
export default function colorMatrixCalc(color: string, opacity: number) {
  function parseColor(color: string): { r: number, g: number, b: number } {
    const hex_regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const rgb_regex = /^rgb\(([\d]+), ([\d]+), ([\d]+)\)$/i;

    if (hex_regex.test(color)) {
      const result = hex_regex.exec(color);
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
    }
    if (rgb_regex.test(color)) {
      const result = rgb_regex.exec(color);
      return {
        r: parseInt(result[1]),
        g: parseInt(result[2]),
        b: parseInt(result[3]),
      };
    }

    // Supplied color could not be parsed, treat as black
    return { r: 0, g: 0, b: 0 };
  }

  const parsedColor = parseColor(color);
  return `0 0 0 0 ${(parsedColor.r / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.g / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.b / 255).toFixed(2)} ` +
    `0 0 0 ${opacity} 0`;
}
