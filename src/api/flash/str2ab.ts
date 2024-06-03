export function str2ab(str: string) {
  // eslint-disable-next-line no-buffer-constructor
  const buf = new ArrayBuffer(str.length); // 2 bytes for each char
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    // eslint-disable-next-line no-bitwise
    bufView[i] = str.charCodeAt(i) & 0xff;
  }
  return buf;
}
