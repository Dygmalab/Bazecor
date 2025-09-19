export function preserveModifiers(keycode: number): number {
  const ctrlMask = 0b0000_0001_0000_0000;
  const altMask = 0b0000_0010_0000_0000;
  const altGrMask = 0b0000_0100_0000_0000;
  const shiftMask = 0b0000_1000_0000_0000;
  const osMask = 0b0001_0000_0000_0000;

  // eslint-disable-next-line no-bitwise
  return keycode & (ctrlMask | altMask | altGrMask | shiftMask | osMask);
}
