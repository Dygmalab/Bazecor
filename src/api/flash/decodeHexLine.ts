/**
 * Converts a hexadecimal string into an array of bytes.
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {number[]} An array of numbers representing the bytes.
 */
function hex2byte(hex: string): number[] {
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substring(i, i + 2), 16));

  return bytes;
}

/**
 * Decodes a single line from an Intel HEX file into a structured object.
 * This object contains the byte count, address, record type, and the data payload as a Uint8Array.
 *
 * @param {string} line - One line from a .hex file, without the leading colon.
 * @returns {{str: string, len: number, address: number, type: number, data: Uint8Array}} An object representing the decoded line, structured for use in firmware flashing.
 */
export function decodeHexLine(line: string): { str: string; len: number; address: number; type: number; data: Uint8Array } {
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

  for (let i = 0; i < byteData.length; i += 1) {
    bytesView[i] = byteData[i];
  }

  return {
    str: line,
    len: byteCount,
    address,
    type: recordtype,
    data: bytesView,
  };
}
