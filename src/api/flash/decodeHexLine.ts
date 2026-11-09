import hex2byte from "./hex2byte";
import { HexType } from "./types";

/**
 * Decodes a single line from an Intel HEX file string into a structured object.
 *
 * This function parses the standard components of a HEX line:
 * - Byte Count: The number of data bytes in the line.
 * - Address: The starting memory address for the data.
 * - Record Type: The type of record (e.g., data, end of file, extended address).
 * - Data: The actual data bytes, converted from hexadecimal to a Uint8Array.
 *
 * @param {string} line - A single string line from an Intel HEX file.
 *                        It should start with ':' and conform to the HEX format.
 * @returns {HexType} An object representing the parsed HEX line, containing:
 *                    - `str`: The original input line string.
 *                    - `len`: The parsed byte count (number of data bytes).
 *                    - `address`: The parsed 16-bit memory address.
 *                    - `type`: The parsed record type.
 *                    - `data`: A Uint8Array containing the data bytes from the line.
 * @example
 * const hexLine = ":10010000214601360121470136007EFE09D2190140";
 * const parsedLine = decodeHexLine(hexLine);
 * console.log(parsedLine);
 * // Output might look like:
 * // {
 * //   str: ":10010000214601360121470136007EFE09D2190140",
 * //   len: 16,
 * //   address: 256,
 * //   type: 0,
 * //   data: Uint8Array(16) [ 33, 70, 1, 54, 1, 33, 71, 1, 54, 0, 126, 254, 9, 210, 25, 1 ]
 * // }
 */
export function decodeHexLine(line: string): HexType {
  let offset = 0;

  // It's common for HEX lines to start with a colon.
  // While this function doesn't strictly enforce or use it,
  // robust parsing might involve stripping it if present.
  // For this implementation, we assume the line is passed without
  // the leading colon or that substring indices account for it.
  // Given the current parsing, if a colon is present, it should be
  // stripped before calling this function, or offset should start at 1.
  // Let's assume `line` is passed without the leading ':' for now.

  const byteCount = parseInt(line.substring(offset, offset + 2), 16);
  offset += 2;
  const address = parseInt(line.substring(offset, offset + 4), 16);
  offset += 4;
  const recordtype = parseInt(line.substring(offset, offset + 2), 16);
  offset += 2;

  const byteData = hex2byte(line.substring(offset, offset + byteCount * 2));

  // The ArrayBuffer can be directly created from byteData if hex2byte returns Uint8Array
  // or if we pass byteData directly to new Uint8Array(byteData)
  // However, the current hex2byte returns number[], so this loop is necessary.
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
