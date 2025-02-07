/* eslint-disable no-plusplus */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Drive, list } from "drivelist";
import { listDrivesHandler, setAllowedRetries } from "./listDrivesHandler";

describe("listDrivesHandler", () => {
  beforeEach(() => {
    vi.mock(import("drivelist"), async importOriginal => {
      const mod = await importOriginal();
      return {
        ...mod,
        // replace some exports
        list: vi.fn(),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("will return error when wrong OS", async () => {
    // This value will be returned after all the values in the loop, this is done to not crash the tester
    vi.mocked(list).mockReturnValue(Promise.reject("Invalid OS"));

    await expect(() => listDrivesHandler(undefined, undefined)).rejects.toThrowError("Invalid OS");
    expect(list).toBeCalledTimes(1);
  });

  it("runs forever when device never found", async () => {
    // This value will be returned after all the values in the loop, this is done to not crash the tester
    let temp = vi.mocked(list).mockReturnValue(
      Promise.resolve([
        {
          description: "asdvdsRPI RP2fdsafdsa",
          mountpoints: [
            {
              path: "abc123",
            },
          ],
        },
      ] as Drive[]),
    );
    for (let i = 0; i < 20; i++) {
      temp = temp.mockReturnValueOnce(
        Promise.resolve([
          {
            description: "other-device",
            mountpoints: [
              {
                path: "abc123",
              },
            ],
          },
        ] as Drive[]),
      );
    }

    const value = await listDrivesHandler(undefined, undefined);
    expect(value).toEqual("abc123");
    expect(list).toBeCalledTimes(21);
  });

  it("runs forever when mountpoint never found", async () => {
    // This value will be returned after all the values in the loop, this is done to not crash the tester
    let temp = vi.mocked(list).mockReturnValue(
      Promise.resolve([
        {
          description: "asdvdsRPI RP2fdsafdsa",
          mountpoints: [
            {
              path: "abc123",
            },
          ],
        },
      ] as Drive[]),
    );
    for (let i = 0; i < 20; i++) {
      temp = temp.mockReturnValueOnce(
        Promise.resolve([
          {
            description: "asdvdsRPI RP2fdsafdsa",
          },
        ] as Drive[]),
      );
    }

    const value = await listDrivesHandler(undefined, undefined);
    expect(value).toEqual("abc123");
    expect(list).toBeCalledTimes(21);
  });

  it("calls list once found non hyphen", async () => {
    vi.mocked(list).mockReturnValue(
      Promise.resolve([
        {
          description: "asdvdsRPI RP2fdsafdsa",
          mountpoints: [
            {
              path: "abc123",
            },
          ],
        },
      ] as Drive[]),
    );

    const value = await listDrivesHandler(undefined, undefined);
    expect(value).toEqual("abc123");
    expect(list).toBeCalledTimes(1);
  });

  it("calls list once found with hyphen", async () => {
    vi.mocked(list).mockReturnValue(
      Promise.resolve([
        {
          description: "asdvdsRPI-RP2fdsafdsa",
          mountpoints: [
            {
              path: "abc123",
            },
          ],
        },
      ] as Drive[]),
    );

    const value = await listDrivesHandler(undefined, undefined);
    expect(value).toEqual("abc123");
    expect(list).toBeCalledTimes(1);
  });

  it("calls list twice when mount points missing with hyphen", async () => {
    vi.mocked(list)
      .mockReturnValueOnce(
        Promise.resolve([
          {
            description: "asdvdsRPI-RP2fdsafdsa",
          },
        ] as Drive[]),
      )
      .mockReturnValueOnce(
        Promise.resolve([
          {
            description: "asdvdsRPI-RP2fdsafdsa",
            mountpoints: [
              {
                path: "abc123",
              },
            ],
          },
        ] as Drive[]),
      );

    const value = await listDrivesHandler(undefined, undefined);
    expect(value).toEqual("abc123");
    expect(list).toBeCalledTimes(2);
  });

  it("picks correct device when index of RPI changes", async () => {
    vi.mocked(list)
      .mockReturnValueOnce(
        Promise.resolve([
          {
            description: "asdvdsRPI-RP2fdsafdsa",
          },
        ] as Drive[]),
      )
      .mockReturnValueOnce(
        Promise.resolve([
          {
            description: "other-device",
            mountpoints: [
              {
                path: "zyx987",
              },
            ],
          },
          {
            description: "asdvdsRPI-RP2fdsafdsa",
            mountpoints: [
              {
                path: "abc123",
              },
            ],
          },
        ] as Drive[]),
      );

    const value = await listDrivesHandler(undefined, undefined);
    expect(value).toEqual("abc123");
    expect(list).toBeCalledTimes(2);
  });

  describe("when setting a retry limit", () => {
    beforeEach(() => {
      setAllowedRetries(2);
    });
    afterEach(() => {
      setAllowedRetries(-2);
    });

    it("will return nothing when never any devices", async () => {
      // This value will be returned after all the values in the loop, this is done to not crash the tester
      vi.mocked(list).mockReturnValue(Promise.resolve([] as Drive[]));

      const value = await listDrivesHandler(undefined, undefined);
      expect(value).toEqual("");
      expect(list).toBeCalledTimes(2);
    });

    it("will return nothing when never any mountpoints", async () => {
      // This value will be returned after all the values in the loop, this is done to not crash the tester
      vi.mocked(list).mockReturnValue(Promise.resolve([{ description: "asdvdsRPI-RP2fdsafdsa" }] as Drive[]));

      const value = await listDrivesHandler(undefined, undefined);
      expect(value).toEqual("");
      expect(list).toBeCalledTimes(2);
    });
  });
});
