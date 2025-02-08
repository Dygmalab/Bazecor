import { RGB, rgbw2b } from "../color";

/**
 * Parses a string of space separated base 10 integers representing RGB (and optionally W) values index values into an array of RGB colors.
 * If the colors contained are RGBW colors, they will be converted to RGB colors before being returned.
 * Example: parsePaletteRaw("1 2 3 4 5 6", false) => [
 *   { r: 1, g: 2, b: 3, rgb: "rgb(1,2,3)" },
 *   { r: 4, g: 5, b: 6, rgb: "rgb(4,5,6)" },
 * ]
 *
 * @param {string} palette A string of space separated color values within [0-255]
 * @param {boolean} isRGBW If the color information passed in represents RGBW colors (will be treated as RGB if false)
 * @returns {RGB[][]} The RGB values contained within the supplied palette.
 */
export const parsePaletteRaw = (palette: string, isRGBW: boolean): RGB[] =>
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
