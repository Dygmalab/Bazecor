import { expect, test, describe } from "vitest";
import { rgbw2b } from "./RGBWtoRGB";

describe("rgbw2b", () => {
  test("all zeros returns black", () => {
    const result = rgbw2b({ r: 0, g: 0, b: 0, w: 0 });
    expect(result.r).toBe(0);
    expect(result.g).toBe(0);
    expect(result.b).toBe(0);
    expect(result.rgb).toBe("rgb(0, 0, 0)");
  });

  test("white channel adds to all RGB channels", () => {
    const result = rgbw2b({ r: 10, g: 20, b: 30, w: 40 });
    expect(result.r).toBe(50);
    expect(result.g).toBe(60);
    expect(result.b).toBe(70);
    expect(result.rgb).toBe("rgb(50, 60, 70)");
  });

  test("negative white is sanitized to 0", () => {
    const result = rgbw2b({ r: 10, g: 20, b: 30, w: -40 });
    expect(result.r).toBe(10);
    expect(result.g).toBe(20);
    expect(result.b).toBe(30);
  });

  test("result clamps at 255", () => {
    const result = rgbw2b({ r: 200, g: 200, b: 200, w: 100 });
    expect(result.r).toBe(255);
    expect(result.g).toBe(255);
    expect(result.b).toBe(255);
  });

  test("pure RGB values without white pass through", () => {
    const red = rgbw2b({ r: 255, g: 0, b: 0, w: 0 });
    expect(red.r).toBe(255);
    expect(red.g).toBe(0);
    expect(red.b).toBe(0);

    const green = rgbw2b({ r: 0, g: 255, b: 0, w: 0 });
    expect(green.g).toBe(255);

    const blue = rgbw2b({ r: 0, g: 0, b: 255, w: 0 });
    expect(blue.b).toBe(255);
  });

  test("generates correct rgb string", () => {
    const result = rgbw2b({ r: 100, g: 50, b: 25, w: 10 });
    expect(result.rgb).toBe("rgb(110, 60, 35)");
  });
});
