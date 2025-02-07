import { expect, it, describe } from "vitest";
import getTranslator from "./translator";

describe("translator", ()=> {
  it("should return fr-FR for input fr-Fr", ()=>{
    expect(getTranslator("fr-FR")).toBe("fr-FR");
  });

  it("should return fr-FR for input fr", ()=>{
    expect(getTranslator("fr")).toBe("fr-FR");
  });

  it("should return fr-FR for input fr-???", ()=>{
    expect(getTranslator("fr-???")).toBe("fr-FR");
  });

  it("should return default fallback", ()=>{
    expect(getTranslator("abc")).toBe("en-US");
  });

  it("should return supplied fallback", ()=>{
    expect(getTranslator("abc", "fr-FR")).toBe("fr-FR");
  });
});
