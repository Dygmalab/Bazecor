import { afterEach, describe, expect, it } from "vitest";
import { ctx } from "./Focus.ctx";
import { Focus } from "./Focus";
import { FocusStub } from './Focus.mocks'

afterEach(() => (ctx.instance = undefined));

describe(`${Focus.getInstance.name}()`, () => {
  it("returns the same instance when called multiple times", () => {
    const r = Focus.getInstance();
    expect(Focus.getInstance()).toBe(r);
  });
});

describe('find()', () => {
  it('returns empty array when no serial ports', async () => {
    const s = new FocusStub({ ports: []})
    const r = await s.find()
    expect(r).toEqual([])
  })
})