/**
 * Waits the specified amount of milliseconds
 * @param {number} timeInMs - The amount of time to wait in milliseconds
 */
export function delay(timeInMs: number) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}
