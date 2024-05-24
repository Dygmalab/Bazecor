export function padToN(number: string, numberToPad = 0) {
  let str = "";

  for (let i = 0; i < numberToPad; i += 1) str += "0";

  return (str + number).slice(-numberToPad);
}
