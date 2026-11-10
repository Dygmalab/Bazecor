import { KeyType } from "@Renderer/types/layout";

export interface SelectedKey {
  keyIndex: number;
  ledIndex: number;
}

export function selectKeys(selection: SelectedKey[], key: SelectedKey, additive: boolean): SelectedKey[] {
  if (additive) {
    return selection.some(selected => selected.keyIndex === key.keyIndex)
      ? selection.filter(selected => selected.keyIndex !== key.keyIndex)
      : [...selection, key];
  }
  return selection.length === 1 && selection[0].keyIndex === key.keyIndex ? [] : [key];
}

export function commonColorIndex(colors: number[], selection: SelectedKey[]): number | undefined {
  const first = colors?.[selection[0]?.ledIndex];
  return first !== undefined && selection.every(({ ledIndex }) => colors[ledIndex] === first) ? first : undefined;
}

/** No common assignment means the picker must show no selected control. */
export function commonKeyCode(keys: KeyType[], selection: number[]): number | undefined {
  const first = keys?.[selection[0]]?.keyCode;
  return first !== undefined && selection.every(index => keys[index]?.keyCode === first) ? first : undefined;
}
