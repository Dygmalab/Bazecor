import { KeyType } from "@Renderer/types/layout";
import { KeymapDB } from "../keymap";

const keymapDB = new KeymapDB();

/**
 * Parses a raw keymap string from the keyboard into a 2D array of numbers.
 * The raw string is a space-separated list of numbers, which are grouped into layers
 * based on the provided layer size.
 *
 * @param {string} keymap - The raw, space-separated string of key codes from the keyboard.
 * @param {number} keyLayerSize - The number of keys per layer, used to chunk the data correctly.
 * @returns {number[][]} A 2D array where each sub-array represents a single keymap layer.
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
 * Serializes a 2D keymap array into a raw string format that can be sent to the keyboard.
 * It flattens the array and converts each key (whether a number or a KeyType object) into its string representation.
 *
 * @param {KeyType[][]} keymap - The 2D array representing the keymap, containing either numbers or KeyType objects.
 * @returns {string} The serialized raw string representation of the keymap.
 */
export const serializeKeymap = (keymap: KeyType[][]): string =>
  keymap
    .flat()
    .map(k => (typeof k === "number" ? String(k) : keymapDB.serialize(k).toString()))
    .join(" ");
