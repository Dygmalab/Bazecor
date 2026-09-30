import hex2byte from "./hex2byte";
import { HexType } from "./types";

/**
 * Decodes a single line from an Intel HEX file into a structured object.
 * This object contains the byte count, address, record type, and the data payload as a Uint8Array.
 *
 * @param {string} line - One line from a .hex file, without the leading colon.
 * @returns {HexType} An object representing the decoded line, structured for use in firmware flashing.
 */
export default function ihexDecode(line: string): HexType {
  let offset = 0;

  const byteCount = parseInt(line.substring(offset, offset + 2), 16);
  offset += 2;
  const address = parseInt(line.substring(offset, offset + 4), 16);
  offset += 4;
  const recordtype = parseInt(line.substring(offset, offset + 2), 16);
  offset += 2;

  const byteData = hex2byte(line.substring(offset, offset + byteCount * 2));

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
