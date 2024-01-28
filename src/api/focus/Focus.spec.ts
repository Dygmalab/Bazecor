import { afterEach, describe, expect, it } from "vitest";
import { ctx } from "./Focus.ctx";
import { Focus } from "./Focus";

afterEach(() => (ctx.instance = undefined));

describe(`${Focus.getInstance.name}()`, () => {
  it("returns the same instance when called multiple times", () => {
    const r = Focus.getInstance();
    expect(Focus.getInstance()).toBe(r);
  });
});
