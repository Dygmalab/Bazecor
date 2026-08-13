import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { parseSuperkeysRaw, serializeSuperkeys } from "./superkeys";

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

  it.each([
    {
      description: "should parse a simple superkey string",
      raw: "1 2 3 4 5 0 0",
      stored: [{ id: 0, name: "My Superkey", actions: [] }],
      expected: [
        {
          id: 0,
          name: "My Superkey",
          actions: [1, 2, 3, 4, 5],
        },
      ],
    },
    {
      description: "should parse multiple superkeys",
      raw: "1 2 0 3 4 5 0 0",
      stored: [
        { id: 0, name: "SK1", actions: [] },
        { id: 1, name: "SK2", actions: [] },
      ],
      expected: [
        { id: 0, name: "SK1", actions: [1, 2] },
        { id: 1, name: "SK2", actions: [3, 4, 5] },
      ],
    },
    {
      description: "should handle empty raw string",
      raw: "0 0",
      stored: [],
      expected: [],
    },
    {
      description: "should handle raw string with only zeros",
      raw: "0 0 0 0 0",
      stored: [],
      expected: [],
    },
    {
      description: "should handle no stored superkeys",
      raw: "10 20 30 0 0",
      stored: [],
      expected: [{ id: 0, name: "", actions: [10, 20, 30] }],
    },
    {
      description: "should discard superkeys if length is too short",
      raw: "",
      stored: [],
      expected: [],
    },
  ])("$description", ({ raw, stored, expected }) => {
    const result = parseSuperkeysRaw(raw, stored as SuperkeysType[]);
    expect(result).toEqual(expected);
  });
});

describe("serializeSuperkeys", () => {
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

  it.each([
    {
      description: "should serialize a simple superkey",
      superkeys: [{ id: 0, name: "Test", actions: [1, 2, 3, 4, 5] }],
      expected: "1 2 3 4 5 0 0",
    },
    {
      description: "should serialize multiple superkeys",
      superkeys: [
        { id: 0, name: "SK1", actions: [1, 2] },
        { id: 1, name: "SK2", actions: [3, 4, 5] },
      ],
      expected: "1 2 1 1 1 0 3 4 5 1 1 0 0",
    },
    {
      description: "should return eraser string for empty superkeys array",
      superkeys: [],
      expected: Array(512).fill("65535").join(" "),
    },
    {
      description: "should return eraser string for a superkey with no actions",
      superkeys: [{ id: 0, name: "Empty", actions: [] }],
      expected: Array(512).fill("65535").join(" "),
    },
    {
      description: "should pad superkeys with less than 5 actions",
      superkeys: [{ id: 0, name: "Padded", actions: [10, 20] }],
      expected: "10 20 1 1 1 0 0",
    },
    {
      description: "should handle null or undefined actions",
      superkeys: [{ id: 0, name: "Nulls", actions: [1, null, 3, undefined, 5] }],
      expected: "1 1 3 1 5 0 0",
    },
  ])("$description", ({ superkeys, expected }) => {
    const result = serializeSuperkeys(superkeys as SuperkeysType[]);
    expect(result.trim()).toEqual(expected.trim());
  });
});
