import { rgbw2b } from "../color";

/**
 * Parses a raw palette string from the keyboard into an array of color objects.
 * It handles both RGB and RGBW color formats based on the `isRGBW` flag.
 *
 * @param {string} palette - The raw, space-separated string of color values from the keyboard.
 * @param {boolean} isRGBW - If true, the function parses 4 values (RGBW) per color and converts them to RGB. If false, it parses 3 values (RGB) per color.
 * @returns {Array<{r: number, g: number, b: number, rgb: string}>} An array of color objects, each containing r, g, b components and a CSS rgb string.
 */
export const parsePaletteRaw = (palette: string, isRGBW: boolean): Array<{ r: number; g: number; b: number; rgb: string }> =>
  isRGBW
    ? palette
        .split(" ")
        .filter(v => v.length > 0)
        .map((k: string) => parseInt(k, 10))
        .reduce((resultArray, item, index) => {
          const localResult = resultArray;
          const chunkIndex = Math.floor(index / 4);

          if (!localResult[chunkIndex]) {
            localResult[chunkIndex] = []; // start a new chunk
          }
          localResult[chunkIndex].push(item);
          return localResult;
        }, [])
        .map(color => {
          const coloraux = rgbw2b({ r: color[0], g: color[1], b: color[2], w: color[3] });
          return {
            r: coloraux.r,
            g: coloraux.g,
            b: coloraux.b,
            rgb: coloraux.rgb,
          };
        })
    : palette
        .split(" ")
        .filter(v => v.length > 0)
        .map((k: string) => parseInt(k, 10))
        .reduce((resultArray, item, index) => {
          const localResult = resultArray;
          const chunkIndex = Math.floor(index / 3);

          if (!localResult[chunkIndex]) {
            localResult[chunkIndex] = []; // start a new chunk
          }
          localResult[chunkIndex].push(item);
          return localResult;
        }, [])
        .map(color => ({
          r: color[0],
          g: color[1],
          b: color[2],
          rgb: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        }));
