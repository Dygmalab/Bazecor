/* eslint-disable no-bitwise */
import { autoshiftBaseCode, isAutoshift } from "../../../hw/autoshift";

// The firmware has five modifier flags. Right Ctrl/Shift/OS share their
// corresponding flag; standalone modifier assignments retain their side.
const modifierFlags: Record<number, number> = {
  224: 256,
  225: 2048,
  226: 512,
  227: 4096,
  228: 256,
  229: 2048,
  230: 1024,
  231: 4096,
};

const plainCode = (keyCode: number): number => (isAutoshift(keyCode) ? autoshiftBaseCode(keyCode) : keyCode);
const isKeyboardCode = (keyCode: number): boolean => keyCode >= 0 && keyCode < 8192;

export const modifierFlag = (keyCode: number): number => modifierFlags[keyCode] ?? 0;

export function isModifierSelected(keyCode: number, modifierCode: number): boolean {
  const code = plainCode(keyCode);
  if (!isKeyboardCode(code)) return false;
  // Standalone keys retain their side. Shortcut flags select the left-side
  // modifier or AltGr, rather than both copies of Ctrl, Shift, or Super.
  return (
    (code & 0xff) === modifierCode ||
    ((modifierCode < 228 || modifierCode === 230) && Boolean(code & 0x1f00 & modifierFlag(modifierCode)))
  );
}

function selectedModifiers(keyCode: number): number {
  const code = plainCode(keyCode);
  if (!isKeyboardCode(code)) return 0;
  return (code & 0x1f00) | modifierFlag(code & 0xff);
}

/** Toggle modifiers and modified keys, or replace the ordinary key. */
export function selectShortcutKey(currentCode: number, nextCode: number): number {
  if (!isKeyboardCode(nextCode) || nextCode === 0) return nextCode;

  const current = plainCode(currentCode);
  const base = isKeyboardCode(current) ? current & 0xff : 0;
  const flags = selectedModifiers(current);
  const nextFlag = modifierFlag(nextCode);
  if (nextFlag && modifierFlag(base) === nextFlag && base !== nextCode) {
    // Choosing the other side of a standalone modifier replaces that key.
    return nextCode | (current & 0x1f00 & ~nextFlag);
  }
  const removeKey = !nextFlag && flags !== 0 && (nextCode === base || nextCode === current);

  if (!nextFlag && !removeKey) return nextCode | flags;

  const toggled = flags ^ nextFlag;
  if (!removeKey && base && !modifierFlag(base)) return base | toggled;

  // A modifier-only assignment still needs a real HID key as its base.
  // Keep the existing base where possible, otherwise promote a remaining flag.
  if (modifierFlag(base) & toggled) return base | (toggled & ~modifierFlag(base));
  const remaining = [nextCode, 224, 225, 226, 227, 230].find(key => modifierFlag(key) & toggled);
  return remaining === undefined ? 0 : remaining | (toggled & ~modifierFlag(remaining));
}
