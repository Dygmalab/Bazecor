import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { parseSuperkeysRaw, serializeSuperkeys } from "./superkeys";
import { SuperkeysType } from "@Types/superkeys";
import log from "electron-log/renderer";

describe("parseSuperkeysRaw", () => {
  beforeEach(() => {
    vi.mock("electron-log/renderer", () => ({
      default: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        verbose: vi.fn(),
        debug: vi.fn(),
        silly: vi.fn(),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle empty string", () => {
    expect(parseSuperkeysRaw("", [])).toEqual([]);

    expect(log.warn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith("Superkeys were empty");
  });

  it("GAP: `superArray.length < 1` check will never occur", () => {
    const input = "";
    expect(input).toEqual("");

    const split = input.split(" 0 0");
    expect(split).toEqual([""]);

    const first = split[0];
    expect(first).toEqual("");

    const splitAgain = first.split(" ");
    expect(splitAgain).toEqual([""]);

    const toNums = splitAgain.map(Number);
    expect(toNums).toEqual([0]);

    // to satisfy the check `toNums` would need to be empty
  });

  it("should handle just the terminal character", () => {
    expect(parseSuperkeysRaw(" 0 0", [])).toEqual([]);

    expect(log.warn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith("Superkeys were empty");
  });

  it("GAP: throws out anything after the first ' 0 0'", () => {
    // This may be intended as the serializer only populates every memory value when you erase all superkeys
    // .
    expect(parseSuperkeysRaw("8 22 0 0 8 22 0 0", [])).toEqual([
      { id: 0, name: "", actions: [8, 22] },
    ]);
  });

  it("GAP: anything aside from base 10 integers cause NaN to be in the actions array", () => {
    expect(parseSuperkeysRaw("8 A 8 0 0", [])).toEqual([
      { id: 0, name: "", actions: [8, NaN, 8] },
    ]);
  });

  it("should treat a 0 as the end of a superkey", () => {
    expect(parseSuperkeysRaw("8 22 0 8 0 0", [])).toEqual([
      { id: 0, name: "", actions: [8, 22] },
      { id: 1, name: "", actions: [8] },
    ]);
  });

  it("GAP: Applies 'name' based on index position from stored array", () => {
    expect(parseSuperkeysRaw("1 1 2 3 4 0 0", [{ id: 0, name: "test", actions: [1, 2] }])).toEqual([
      { id: 0, name: "test", actions: [1, 1, 2, 3, 4] },
    ]);
  });

  it("GAP: 'superkey' is never populated", () => {
    expect(parseSuperkeysRaw("1 1 2 3 4 0 0", [])[0].superkey).toBeUndefined();
  });

  it("should parse demo superkey", () => {
    expect(
      parseSuperkeysRaw("53 2101 1077 41 1 0 0", []),
    ).toEqual([
      {
        actions: [53, 2101, 1077, 41, 1],
        id: 0,
        name: "",
      },
    ]);
  });
});

describe("serializeSuperkeysRaw", () => {
  beforeEach(() => {
    vi.mock("electron-log/renderer", () => ({
      default: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        verbose: vi.fn(),
        debug: vi.fn(),
        silly: vi.fn(),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create the reset string for an empty array", () => {
    const clearedMap = serializeSuperkeys([]).split(" ");
    expect(clearedMap.length).toEqual(512);
    clearedMap.forEach((v) => expect(v).toEqual("65535"));
  });

  it("should create the reset string for one superkey with no actions", () => {
    const clearedMap = serializeSuperkeys([{actions:[], id:0, name:""}]).split(" ");
    expect(clearedMap.length).toEqual(512);
    clearedMap.forEach((v) => expect(v).toEqual("65535"));
  });

  it("should create the reset string for one superkey with one action which is 0", () => {
    const clearedMap = serializeSuperkeys([{actions:[0], id:0, name:""}]).split(" ");
    expect(clearedMap.length).toEqual(512);
    clearedMap.forEach((v) => expect(v).toEqual("65535"));
  });

  it("should serialize to a minimum of 5 numbers", () => {
    const superkeys: SuperkeysType[] = [{ id: 0, name: "", actions: [10]}];
    expect(serializeSuperkeys(superkeys)).toEqual("10 1 1 1 1 0 0");
  });

  it("should convert 0, null, undefined, and NaN to 1", () => {
    const superkeys: SuperkeysType[] = [{ id: 0, name: "", actions: [0, null, undefined, NaN, 10]}];
    expect(serializeSuperkeys(superkeys)).toEqual("1 1 1 1 10 0 0");
  });

  it("should serialize two valid superkeys", () => {
    const superkeys: SuperkeysType[] = [
      { id: 0, name: "", actions: [10, 20, 30]},
      { id: 0, name: "", actions: [70, 80, 90]},
    ];
    expect(serializeSuperkeys(superkeys)).toEqual("10 20 30 1 1 0 70 80 90 1 1 0 0");
  });
});
