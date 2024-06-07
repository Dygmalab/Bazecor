export default function hex2byte(hex: string) {
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16));

  return bytes;
}
