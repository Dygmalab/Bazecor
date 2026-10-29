import { rgb2w, rgbw2b } from "../color";

export const parsePaletteRaw = (palette: string, isRGBW: boolean) =>
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

// A palette always holds 16 colours: 64 values in RGBW (Defy, Raise2), 48 in RGB (Sonsei, Raise).
const PALETTE_COLORS = 16;

/**
 * Returns `palette` in the format the target keyboard expects, telling the
 * stored format apart by its length. Some backups carry the other format (an
 * early Sonsei backup saved an RGBW palette), and a keyboard sent the wrong
 * number of values stops answering every command after it. Anything that is
 * neither 48 nor 64 values is returned untouched.
 */
export const fitPaletteToFormat = (palette: string, targetRGBW: boolean): string => {
  const count = palette.split(" ").filter(v => v.length > 0).length;
  const isRGBW = count === PALETTE_COLORS * 4;
  const isRGB = count === PALETTE_COLORS * 3;
  if ((!isRGBW && !isRGB) || isRGBW === targetRGBW) return palette;
  return parsePaletteRaw(palette, isRGBW)
    .flatMap(color => {
      if (!targetRGBW) return [color.r, color.g, color.b];
      const rgbw = rgb2w(color);
      return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
    })
    .join(" ");
};
