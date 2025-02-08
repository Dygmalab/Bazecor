/* eslint-disable no-bitwise */
import { MacroActionsType, MacrosType } from "@Renderer/types/macros";
import { KeymapDB } from "../keymap";

const macrosEraser = (tMem: number) => Array(tMem).fill("255").join(" ");

/**
 * Parses a string of space separated base 10 8-bit integers representing key types and key codes values into an array of macros.
 *
 * @param {string} raw A string of space separated 8-bit integers
 * @param {MacrosType[]} storedMacros An array of existing macros, used to populate the name field
 * @returns {MacrosType[]} A list of the macros defined.
 */
export const parseMacrosRaw = (raw: string, storedMacros?: MacrosType[]): MacrosType[] => {
  const keymapDB = new KeymapDB();
  const macrosArray = raw.split(" 0 0")[0].split(" ").map(Number);

  // Translate received macros to human readable text
  const macros: MacrosType[] = [];
  let iter = 0;
  // macros are `0` terminated or when end of macrosArray has been reached, the outer loop
  // must cycle once more than the inner
  while (iter <= macrosArray.length) {
    let actions: MacroActionsType[] = [];
    while (iter < macrosArray.length) {
      const type = macrosArray[iter];
      if (type === 0) {
        break;
      }

      switch (type) {
        case 1:
          actions.push({
            type,
            keyCode: [
              (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)],
              (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)],
            ],
          });
          break;
        case 2:
        case 3:
        case 4:
        case 5:
          actions.push({ type, keyCode: (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)] });
          break;
        case 6:
        case 7:
        case 8:
          actions.push({ type, keyCode: macrosArray[(iter += 1)] });
          break;
        default:
          break;
      }

      iter += 1;
    }
    actions = actions.filter(a => {
      let result;
      if (Array.isArray(a.keyCode)) {
        a.keyCode.filter(k => !Number.isNaN(k));
      } else {
        result = !Number.isNaN(a.keyCode);
      }
      return result;
    });
    macros.push({
      actions,
      name: "",
      macro: "",
    });
    iter += 1;
  }
  macros.forEach((m, idx) => {
    const aux = m;
    aux.id = idx;
    macros[idx] = aux;
  });

  // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
  const stored = storedMacros;
  if (stored === undefined || stored.length === 0) {
    return macros;
  }
  return macros.map((macro, i) => {
    if (stored.length < i) {
      return macro;
    }

    return {
      ...macro,
      name: stored[i]?.name,
      macro: macro.actions.map(k => keymapDB.parse(k.keyCode as number).label).join(" "),
    };
  });
};

/**
 * Serializes an array of macros into a string of space separated 8-bit numbers.
 *
 * @param {MacrosType[]} macros An array of macros to serialize
 * @param {number} tMem The total memory available on the device to store the macros within
 * @returns {string} The serialized macros
 */
export const serializeMacros = (macros: MacrosType[], tMem: number): string => {
  // log.info(
  //   "Macros map function",
  //   macros,
  //   macrosEraser,
  //   macros.length === 0,
  //   macros.length === 1 && Array.isArray(macros[0].actions),
  // );
  if (macros.length === 0 || (macros.length === 1 && !Array.isArray(macros[0].actions))) {
    return macrosEraser(tMem);
  }
  const mapAction = (action: MacroActionsType): number[] => {
    if (
      Array.isArray(action.keyCode)
        ? Number.isNaN(action.keyCode[0]) || Number.isNaN(action.keyCode[1])
        : Number.isNaN(action.keyCode)
    )
      return [];
    switch (action.type) {
      case 1:
        return [
          action.type,
          (action.keyCode as number[])[0] >> 8,
          (action.keyCode as number[])[0] & 255,
          (action.keyCode as number[])[1] >> 8,
          (action.keyCode as number[])[1] & 255,
        ];
      case 2:
      case 3:
      case 4:
      case 5:
        return [action.type, (action.keyCode as number) >> 8, (action.keyCode as number) & 255];
      default:
        return [action.type, action.keyCode as number];
    }
  };
  const result: string = macros
    .map(macro => macro.actions.map((action: MacroActionsType) => mapAction(action)).concat([0]))
    .flat()
    .concat([0])
    .join(" ")
    .split(",")
    .join(" ");
  // log.info("MACROS GOING TO BE SAVED", result);
  return result;
};
