/**
 * Parses a string of space separated base 10 integers representing palette index values into arrays of the specified length.
 * Example: parseColormapRaw("1 2 3 4 5 6", 2) => [ [1, 2], [3, 4], [5, 6] ]
 *
 * @param {string} colormap A string of space separated index values
 * @param {number} ColorLayerSize The length of the chunk to create
 * @returns {number[][]} The values contained within the supplied colormap parsed to numbers and grouped into arrays of ColorLayerSize length.
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
