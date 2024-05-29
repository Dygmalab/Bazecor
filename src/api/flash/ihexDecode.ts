import hex2byte from "./hex2byte";
import { HexType } from "./types";

/**
 * Decodes hex line to object.
 * @param {string} line - One line from hex file.
 * @returns {object} Щbject for use in firmware.
 */
export default function ihexDecode(line: string): HexType {
  let offset = 0;

  const byteCount = parseInt(line.substr(offset, 2), 16);
  offset += 2;
  const address = parseInt(line.substr(offset, 4), 16);
  offset += 4;
  const recordtype = parseInt(line.substr(offset, 2), 16);
  offset += 2;

  const byteData = hex2byte(line.substr(offset, byteCount * 2));

  const bytes = new ArrayBuffer(byteData.length);
  const bytesView = new Uint8Array(bytes, 0, byteData.length);

  for (let i = 0; i < byteData.length; i += 1) bytesView[i] = byteData[i];

  return {
    str: line,
    len: byteCount,
    address,
    type: recordtype,
    data: bytesView,
  };
}
