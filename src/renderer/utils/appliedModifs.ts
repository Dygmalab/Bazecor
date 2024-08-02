type ModifsType = {
  mehApplied: boolean;
  hyperApplied: boolean;
  altApplied: boolean;
  altGrApplied: boolean;
  ctrlApplied: boolean;
  shiftApplied: boolean;
  osApplied: boolean;
};
const result: ModifsType = {
  mehApplied: false,
  hyperApplied: false,
  altApplied: false,
  altGrApplied: false,
  ctrlApplied: false,
  shiftApplied: false,
  osApplied: false,
};

export const appliedModifs = (keycode: number) => {
  // eslint-disable-next-line
  if (keycode & 0b100000000) {
    // Ctrl Decoder
    result.ctrlApplied = true;
  }
  // eslint-disable-next-line
  if (keycode & 0b1000000000) {
    // Alt Decoder
    result.altApplied = true;
  }
  // eslint-disable-next-line
  if (keycode & 0b10000000000) {
    // AltGr Decoder
    result.altGrApplied = true;
  }
  // eslint-disable-next-line
  if (keycode & 0b100000000000) {
    // Shift Decoder
    result.shiftApplied = true;
  }
  // eslint-disable-next-line
  if (keycode & 0b1000000000000) {
    // Win Decoder
    result.osApplied = true;
  }
  // eslint-disable-next-line
  if (keycode & 0b0101100000000) {
    // Meh Decoder
    result.mehApplied = true;
  }
  // eslint-disable-next-line
  if (keycode & 0b1101100000000) {
    // Hyper Decoder
    result.hyperApplied = true;
  }
  return result;
};
