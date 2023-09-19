import { useState } from "react";
import { SelectableKeyboard } from "@Renderer/types/selectableKeyboard";
import Store from "../utils/Store";

const store = Store.getStore();

const useKeyboardStore = () => {
  const initialKeyboards = store.get<string>("keyboards") as SelectableKeyboard[];
  const [storedKeyboards, setStoredKeyboards] = useState<SelectableKeyboard[]>(initialKeyboards ?? []);

  const getStoredKeyboard = (keyboard: SelectableKeyboard) => {
    for (let i = 0; i < storedKeyboards.length; i += 1) {
      if (storedKeyboards[i].id === keyboard.id) {
        return storedKeyboards[i];
      }
    }
    return undefined;
  };

  const isKeyboardStored = (keyboard: SelectableKeyboard) => {
    if (getStoredKeyboard(keyboard)) {
      return true;
    }
    return false;
  };

  const storeKeyboards = (keyboards: SelectableKeyboard[]) => {
    store.set("keyboards", keyboards);
    setStoredKeyboards(keyboards);
  };

  const addStoredKeyboard = (newKeyboard: SelectableKeyboard) => {
    if (!isKeyboardStored(newKeyboard)) {
      const keyboards = [...storedKeyboards, newKeyboard];
      storeKeyboards(keyboards);
    }
  };

  const removeStoredKeyboard = (keyboard: SelectableKeyboard) => {
    const keyboardsAfterRemove = storedKeyboards.filter(currentKeyboard => currentKeyboard.id !== keyboard.id);
    store.set("keyboards", keyboardsAfterRemove);
    setStoredKeyboards(keyboardsAfterRemove);
  };

  return {
    addStoredKeyboard,
    removeStoredKeyboard,
    storeKeyboards,
    storedKeyboards,
  };
};

export default useKeyboardStore;
