import { SelectableKeyboard } from "../types/selectableKeyboard";

export function createUniqueKeyboards(keyboard1: SelectableKeyboard[], keyboard2: SelectableKeyboard[]) {
  const mergeKeyboards = [...keyboard1, ...keyboard2];
  const uniqueKeyboards = new Set<SelectableKeyboard>();
  for (const keyboard of mergeKeyboards) {
    let existingKeyboard = false;
    for (const uniqueKeyboard of uniqueKeyboards) {
      if (keyboard.id === uniqueKeyboard.id) {
        existingKeyboard = true;
      }
    }
    if (!existingKeyboard) {
      uniqueKeyboards.add(keyboard);
    }
  }
  return uniqueKeyboards;
}
