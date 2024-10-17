export default function colorMatrixCalc(color: string, opacity: number) {
  function parseColor(input: string): { r: number; g: number; b: number } {
    const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const rgbRegex = /^rgb\(([\d]+), ([\d]+), ([\d]+)\)$/i;

    if (hexRegex.test(input)) {
      const result = hexRegex.exec(input);
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
    }
    if (rgbRegex.test(input)) {
      const result = rgbRegex.exec(input);
      return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
      };
    }

    // Supplied color could not be parsed, treat as black
    return { r: 0, g: 0, b: 0 };
  }

  const parsedColor = parseColor(color);
  return (
    `0 0 0 0 ${(parsedColor.r / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.g / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.b / 255).toFixed(2)} ` +
    `0 0 0 ${opacity} 0`
  );
}
