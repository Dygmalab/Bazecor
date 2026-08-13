/**
 * Parses a raw colormap string from the keyboard into a 2D array representing color layers.
 * The raw string is a space-separated list of numbers, which are grouped into layers
 * based on the provided layer size.
 *
 * @param {string} colormap - The raw, space-separated string of color values from the keyboard.
 * @param {number} ColorLayerSize - The number of color values per layer, used to chunk the data correctly.
 * @returns {number[][]} A 2D array where each sub-array represents a single color layer.
 */
export const parseColormapRaw = (colormap: string, ColorLayerSize: number): number[][] =>
  colormap
    .split(" ")
    .filter(v => v.length > 0)
    .map((k: string) => parseInt(k, 10))
    .reduce((resultArray, item, index) => {
      const localResult: number[][] = resultArray;
      const chunkIndex = Math.floor(index / ColorLayerSize);

      if (!localResult[chunkIndex]) {
        localResult[chunkIndex] = []; // start a new chunk
      }
      localResult[chunkIndex].push(item);
      return localResult;
    }, []);
