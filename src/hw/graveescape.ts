/* Grave Escape key code.
 *
 * After QMK's QK_GESC: a single key that sends Escape on its own, and ` when
 * Shift (giving ~) or GUI (e.g. Cmd+` on macOS) is held. The choice is made
 * when the key goes down and kept until it is released.
 */

export enum GraveEscapeCodes {
  GRAVE_ESCAPE = 54372, // 0xD464
}

/** Is this the Grave Escape key? */
export const isGraveEscape = (keyCode: number): boolean => keyCode === GraveEscapeCodes.GRAVE_ESCAPE;
