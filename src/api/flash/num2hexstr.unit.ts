import { expect, it } from "vitest";
import { num2hexstr } from "./num2hexstr";

it("converts number to hex string", () => {
  expect(num2hexstr(128)).toEqual("80");
});
