/* Autoshift key codes.
 *
 * An Autoshift key types its base character on a tap and the shifted one when
 * held. The firmware encodes it as AUTOSHIFT_FIRST + <base HID keycode>, so
 * the range is one code per possible base key.
 *
 * Only keys with a distinct shifted form are eligible -- letters, digits and
 * punctuation. Modifiers, F-keys, navigation and anything carrying modifier
 * flags are rejected by the firmware, which falls back to emitting a plain tap.
 */

export enum AutoshiftCodes {
  AUTOSHIFT_FIRST = 54115, // 0xD363
  AUTOSHIFT_LAST = 54370, // 0xD462
}

/* Bounds of the base HID keycodes the firmware accepts. */
export const AUTOSHIFT_MIN_BASE = 4; // 0x04, `a`
export const AUTOSHIFT_MAX_BASE = 56; // 0x38, `/`

/** Is this an Autoshift key? */
export const isAutoshift = (keyCode: number): boolean =>
  keyCode >= AutoshiftCodes.AUTOSHIFT_FIRST && keyCode <= AutoshiftCodes.AUTOSHIFT_LAST;

/** The plain key an Autoshift key is built from. */
export const autoshiftBaseCode = (keyCode: number): number => keyCode - AutoshiftCodes.AUTOSHIFT_FIRST;

/** The Autoshift key for a plain key. */
export const toAutoshift = (baseKeyCode: number): number => AutoshiftCodes.AUTOSHIFT_FIRST + baseKeyCode;

/**
 * Can this key be made autoshiftable?
 *
 * The keycode has to be a bare HID usage in the eligible range: anything above
 * 255 carries modifier flags or belongs to a special range, and neither has a
 * meaningful shifted form.
 */
export const canBeAutoshifted = (keyCode: number): boolean => keyCode >= AUTOSHIFT_MIN_BASE && keyCode <= AUTOSHIFT_MAX_BASE;
