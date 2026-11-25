import { KeyType } from "@Renderer/types/layout";
import { NOKEY_KEY } from "../../api/keymap/db/blanks";

/**
 * How a key reads on the keyboard drawing. A NO KEY is drawn as an empty key:
 * it does nothing, so a blank cap says so better than the words "NO KEY" on
 * every unused position.
 *
 * Only for the drawing. Pickers and descriptions keep the keymap DB's labels,
 * where "No Key" names what was chosen. Returns a copy, so the keymap state the
 * label came from is never changed.
 */
const boardKeyLabel = (key: KeyType): KeyType => {
  if (!key || key.keyCode !== NOKEY_KEY.code) return key;
  return { ...key, label: "", extraLabel: "" };
};

export default boardKeyLabel;
