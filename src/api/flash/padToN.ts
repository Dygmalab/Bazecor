export function padToN(number: number, numberToPad: number) {
  let str = "";

  for (let i = 0; i < numberToPad; i++) str += "0";

  return (str + number).slice(-numberToPad);
}
