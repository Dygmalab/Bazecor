// Parsers
import { parseKeymapRaw, serializeKeymap } from "./keymap";
import { parsePaletteRaw } from "./palette";
import { parseColormapRaw } from "./colormap";
import { parseMacrosRaw, serializeMacros } from "./macros";
import { parseSuperkeysRaw, serializeSuperkeys } from "./superkeys";
import {
  parseCombosRaw,
  serializeCombos,
  emptyCombo,
  duplicateComboIndex,
  overlappingComboIndexes,
  isLegacyCombosReply,
  comboMembers,
  remapComboPositions,
} from "./combos";

// Converters
import { convertKeymapRtoR2, convertColormapRtoR2, convertPaletteRtoR2 } from "./conversions/raiseToRaise2";
import {
  convertKeymapR2toR,
  convertColormapR2toR,
  convertPaletteR2toR,
  stripRaise2OnlyKeys,
  stripRaise2OnlySuperkeyActions,
} from "./conversions/raise2ToRaise";
import {
  convertKeymapDefyToSonsei,
  convertColormapDefyToSonsei,
  convertKeymapSonseiToDefy,
  convertColormapSonseiToDefy,
  convertKeyPositionDefyToSonsei,
  convertKeyPositionSonseiToDefy,
  DEFY_KEYS_PER_LAYER,
  DEFY_LEDS_PER_LAYER,
  SONSEI_KEYS_PER_LAYER,
  SONSEI_LEDS_PER_LAYER,
} from "./conversions/defyToSonsei";

export {
  parseKeymapRaw,
  serializeKeymap,
  parsePaletteRaw,
  parseColormapRaw,
  parseMacrosRaw,
  serializeMacros,
  parseSuperkeysRaw,
  serializeSuperkeys,
  parseCombosRaw,
  serializeCombos,
  emptyCombo,
  duplicateComboIndex,
  overlappingComboIndexes,
  isLegacyCombosReply,
  comboMembers,
  remapComboPositions,
  convertKeymapRtoR2,
  convertColormapRtoR2,
  convertPaletteRtoR2,
  convertKeymapR2toR,
  convertColormapR2toR,
  convertPaletteR2toR,
  stripRaise2OnlyKeys,
  stripRaise2OnlySuperkeyActions,
  convertKeymapDefyToSonsei,
  convertColormapDefyToSonsei,
  convertKeymapSonseiToDefy,
  convertColormapSonseiToDefy,
  convertKeyPositionDefyToSonsei,
  convertKeyPositionSonseiToDefy,
  DEFY_KEYS_PER_LAYER,
  DEFY_LEDS_PER_LAYER,
  SONSEI_KEYS_PER_LAYER,
  SONSEI_LEDS_PER_LAYER,
};
