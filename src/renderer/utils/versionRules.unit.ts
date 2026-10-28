import { afterEach, describe, expect, test, vi } from "vitest";

const loadWithBazecor = async (version: string) => {
  vi.resetModules();
  vi.doMock("../../../package.json", () => ({ version }));
  return import("./versionRules");
};

afterEach(() => {
  vi.doUnmock("../../../package.json");
});

describe("isFirmwareInDropdown()", () => {
  test.each([
    { product: "Defy", fw: "v2.2.1", expected: true },
    { product: "Defy", fw: "3.0.0", expected: false },
    { product: "Sonsei", fw: "1.1.0", expected: true },
    { product: "Sonsei", fw: "2.0.0", expected: true },
    { product: "Raise2", fw: "3.0.0", expected: false },
    { product: "Raise", fw: "1.3.0", expected: true },
  ])("Bazecor 1.11.0: $product $fw -> $expected", async ({ product, fw, expected }) => {
    const { isFirmwareInDropdown } = await loadWithBazecor("1.11.0");
    expect(isFirmwareInDropdown(product, fw)).toBe(expected);
  });

  test.each([
    { product: "Defy", fw: "v2.2.1", expected: false },
    { product: "Defy", fw: "3.0.0", expected: true },
    { product: "Defy", fw: "3.1.0-beta1", expected: true },
    { product: "Defy", fw: "4.0.0", expected: false },
    { product: "Sonsei", fw: "1.1.0", expected: false },
    { product: "Sonsei", fw: "2.0.0", expected: true },
    { product: "Sonsei", fw: "3.0.0", expected: false },
    { product: "Raise2", fw: "1.4.1", expected: false },
    { product: "Raise2", fw: "2.0.0", expected: true },
    { product: "Raise", fw: "1.3.0", expected: true },
  ])("Bazecor 1.12.0: $product $fw -> $expected", async ({ product, fw, expected }) => {
    const { isFirmwareInDropdown } = await loadWithBazecor("1.12.0");
    expect(isFirmwareInDropdown(product, fw)).toBe(expected);
  });

  test("a 1.12.0 beta build already uses the 1.12.0 rules", async () => {
    const { isFirmwareInDropdown } = await loadWithBazecor("1.12.0-beta.1");
    expect(isFirmwareInDropdown("Sonsei", "1.1.0")).toBe(false);
  });
});

describe("hasFirmwareFeature()", () => {
  test.each([
    { feature: "sk20", product: "Defy", fw: "v2.1.9", expected: false },
    { feature: "sk20", product: "Defy", fw: "v2.2.0-beta1 Kaleidoscope", expected: true },
    { feature: "sk20", product: "Raise2", fw: "1.4.0", expected: true },
    { feature: "sk20", product: "Sonsei", fw: "0.1.0", expected: true },
    { feature: "sk20", product: "Raise", fw: "9.9.9", expected: false },
    { feature: "lens", product: "Defy", fw: "2.2.1", expected: false },
    { feature: "lens", product: "Defy", fw: "2.3.0", expected: true },
    { feature: "lens", product: "Raise2", fw: "1.5.0", expected: true },
    { feature: "lens", product: "Sonsei", fw: "0.9.0", expected: false },
    { feature: "lens", product: "Sonsei", fw: "garbage", expected: false },
  ] as const)("$feature on $product $fw -> $expected", async ({ feature, product, fw, expected }) => {
    const { hasFirmwareFeature } = await loadWithBazecor("1.11.0");
    expect(hasFirmwareFeature(feature, product, fw)).toBe(expected);
  });
});
