/**
 * Sanitizes a numerical intensity value, ensuring it falls within the inclusive range of [0, 255]
 * and is an integer.
 *
 * - If the input `value` is `undefined`, `null`, or `NaN`, it is coerced to 0.
 * - If the input `value` is less than 0 (including -Infinity), it is coerced to 0.
 * - If the input `value` is greater than 255 (including Infinity), it is coerced to 255.
 * - Floating-point numbers within the [0, 255] range are rounded down to the nearest integer using `Math.floor`.
 * - Otherwise, the original integer `value` within [0, 255] is returned.
 *
 * @param {number | null | undefined} value - The intensity value to be sanitized. Can be a number, null, or undefined.
 * @returns {number} The sanitized integer value within the range [0, 255].
 * @example
 * sanitizeIntensity(-10);  // Returns 0
 * sanitizeIntensity(128);  // Returns 128
 * sanitizeIntensity(300);  // Returns 255
 * sanitizeIntensity(127.5); // Returns 127
 * sanitizeIntensity(NaN);   // Returns 0
 * sanitizeIntensity(Infinity); // Returns 255
 * sanitizeIntensity(null);  // Returns 0
 */
export function sanitizeIntensity(value: number | null | undefined): number {
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  // Ensure integer result after clamping
  return Math.max(0, Math.min(255, Math.floor(value)));
}
