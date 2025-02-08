import { KeyType } from "@Renderer/types/layout";
import { KeymapDB } from "../keymap";

const keymapDB = new KeymapDB();

/**
 * Parses a string of space separated base 10 integers representing key codes into arrays of the specified length.
 * Example: parseKeymapRaw("1 2 3 4 5 6", 2) => [ [1, 2], [3, 4], [5, 6] ]
 *
 * @param {string} keymap A string of space separated index values
 * @param {number} keyLayerSize The length of the chunk to create
 * @returns {number[][]} The values contained within the supplied keymap parsed to numbers and grouped into arrays of keyLayerSize length.
 */
export const parseKeymapRaw = (keymap: string, keyLayerSize: number): number[][] =>
  keymap
    .split(" ")
    .filter(v => v.length > 0)
    .map((k: string) => parseInt(k, 10))
    .reduce((resultArray, item, index) => {
      const localResult = resultArray;
      const chunkIndex = Math.floor(index / keyLayerSize);

      if (!localResult[chunkIndex]) {
        localResult[chunkIndex] = []; // start a new chunk
      }
      localResult[chunkIndex].push(item);
      return localResult;
    }, []);

/**
 * Serializes a 2d array of KeyTypes into a string of space separated keyCode values.
 * Example: serializeKeymap([
 *   [{ keyCode: 10, label: "test" }],
 *   [{ keyCode: 20, label: "test_2" }],
 * ]) => "10 20"
 *
 * @param {KeyType[][]} keymap A string of space separated index values
 * @returns {string} A space separated string of keyCode values.
 */
export const serializeKeymap = (keymap: KeyType[][]): string =>
  keymap
    .flat()
    .map(k => (typeof k === "number" ? String(k) : keymapDB.serialize(k).toString()))
    .join(" ");
