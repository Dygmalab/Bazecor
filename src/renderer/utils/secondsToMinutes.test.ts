import { expect, test } from "vitest";
import secondsToMinutes from "./secondsToMinutes";

test.each([
  { seconds: 127, minutes: 2 },
  { seconds: 150, minutes: 3 },
  { seconds: 300, minutes: 5 },
  { seconds: 3600, minutes: 60 },
  { seconds: 20, minutes: 1 },
  { seconds: 0, minutes: 0 },
  { seconds: -1, minutes: 0 },
])("$seconds s is shown as $minutes min", ({ seconds, minutes }) => {
  expect(secondsToMinutes(seconds)).toBe(minutes);
});
