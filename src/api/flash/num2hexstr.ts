import { padToN } from './padToN'

export function num2hexstr(number: number, paddedTo?: number | undefined) {
  return padToN(number.toString(16), paddedTo);
}
