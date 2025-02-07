export function preserveModifiers(keycode:number): number {
  const ctrlMask: number = 0b0000_0001_0000_0000;
  const altMask: number = 0b0000_0010_0000_0000;
  const altGrMask: number = 0b0000_0100_0000_0000;
  const shiftMask: number = 0b0000_1000_0000_0000;
  const osMask: number = 0b0001_0000_0000_0000;

  return keycode & (ctrlMask | altMask | altGrMask | shiftMask | osMask);
}
