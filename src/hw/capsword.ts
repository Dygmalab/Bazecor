/* CapsWord key code.
 *
 * A single toggle key: while it is on, letters are capitalised until the word
 * ends -- on a space, enter, tab, punctuation, an idle timeout, or by pressing
 * the key again.
 */

export enum CapsWordCodes {
  CAPS_WORD = 54371, // 0xD463
}

/** Is this the CapsWord key? */
export const isCapsWord = (keyCode: number): boolean => keyCode === CapsWordCodes.CAPS_WORD;
