/**
 * Function that returns an array of numbers from start to end.
 * @param {number} start - The number to start from.
 * @param {number} end - The number to end at.
 * @returns {Array<number>} - An array of numbers from start to end.
 * @example
 * const arr = aFN(1, 5);
 */
export default function aFN(start: number, end: number): Array<number> {
  const arr = Array.from({ length: end - start }, (e, i) => i + start);
  return arr;
}
