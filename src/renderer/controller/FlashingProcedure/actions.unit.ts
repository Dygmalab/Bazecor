import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { DeviceTools } from "@Renderer/DeviceContext";
import Device from "../../../api/comms/Device";
import { resetKeyboard } from "../../../api/flash/RaiseTools";
import NRf52833 from "../../../api/flash/defyFlasher/NRf52833-flasher";
import SideFlaser from "../../../api/flash/defyFlasher/sideFlasher";
import Raise2Flash from "../../../api/flash/raise2Flasher/Raise2-flasher";
import SonseiFlash from "../../../api/flash/sonseiFlasher/Sonsei-flasher";
import { FlashRaise } from "../../../api/flash";
import {
  reconnect,
  flashSide,
  uploadDefyWired,
  resetDefy,
  uploadDefyWireless,
  uploadRaise2,
  uploadSonsei,
  restoreDefies,
  resetRaise,
  uploadRaise,
  restoreRaise,
} from "./actions";

// Mock dependencies
vi.mock("fs", () => ({
  default: {
    copyFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

vi.mock("electron", () => ({
  ipcRenderer: {
    invoke: vi.fn(),
  },
}));

vi.mock("@Renderer/DeviceContext", () => ({
  DeviceTools: {
    list: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    enumerateSerial: vi.fn(),
  },
}));

vi.mock("../../../api/comms/Device", () => {
  const mockDevice = vi.fn().mockImplementation((params, type) => {
    return {
      type,
      productId: "0001",
      port: { path: "mock-port" },
      device: {
        info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
        usb: { vendorId: 0x35ef, productId: 0x0001 },
      },
      command: vi.fn().mockResolvedValue("ok"),
    };
  });
  (mockDevice as any).isDevice = vi.fn().mockReturnValue(true);
  return { default: mockDevice };
});

vi.mock("../../../api/flash/RaiseTools", () => ({
  resetKeyboard: vi.fn(),
}));

vi.mock("../../../api/flash/defyFlasher/NRf52833-flasher", () => ({
  default: {
    flash: vi.fn().mockImplementation((fw, onProgress, finished) => {
      finished(null, "ok");
      return Promise.resolve();
    }),
  },
}));

vi.mock("../../../api/flash/defyFlasher/sideFlasher", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        flashSide: vi.fn().mockResolvedValue({ error: false, message: "" }),
        prepareNeuron: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

vi.mock("../../../api/flash/raise2Flasher/Raise2-flasher", () => ({
  default: {
    flash: vi.fn().mockImplementation((fw, onProgress, finished) => {
      finished(null, "ok");
      return Promise.resolve();
    }),
  },
}));

vi.mock("../../../api/flash/sonseiFlasher/Sonsei-flasher", () => ({
  default: {
    flash: vi.fn().mockImplementation((fw, onProgress, finished) => {
      finished(null, "ok");
      return Promise.resolve();
    }),
  },
}));

vi.mock("../../../api/flash", () => ({
  FlashRaise: vi.fn().mockImplementation(() => {
    return {
      resetKeyboard: vi.fn().mockResolvedValue(undefined),
      updateFirmware: vi.fn().mockResolvedValue(true),
    };
  }),
}));

vi.mock("electron-log/renderer", () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn().mockImplementation((v, ...args) => {
      console.log(v, ...args);
    }),
    debug: vi.fn(),
    verbose: vi.fn(),
    silly: vi.fn(),
  },
}));

vi.mock("../../../main/utils/delay", () => ({
  delay: vi.fn().mockResolvedValue(undefined),
}));

describe("actions", () => {
  let context: any;

  beforeEach(() => {
    const mockDev = new Device({} as any, "serial");
    vi.mocked(DeviceTools.list).mockResolvedValue([mockDev]);
    vi.mocked(DeviceTools.connect).mockResolvedValue(mockDev);

    context = {
      globalProgress: 0,
      leftProgress: 0,
      rightProgress: 0,
      resetProgress: 0,
      neuronProgress: 0,
      restoreProgress: 0,
      device: {
        info: { product: "Raise" },
      },
      deviceState: {
        currentDevice: {
          port: { path: "mock-port" },
          device: {
            info: { product: "Raise" },
            usb: { vendorId: 0x35ef, productId: 0x0001 },
          },
        },
      },
      originalDevice: {
        device: {
          usb: { productId: 0x0001, vendorId: 0x35ef },
          info: { product: "Raise", keyboardType: "ISO" },
        },
      },
      firmwares: {
        fwSides: Buffer.alloc(10),
        fw: [Buffer.alloc(10)],
      },
      stateUpdate: vi.fn().mockImplementation((event) => {
        if (event.type === "increment-event") {
          context.globalProgress = event.data.globalProgress;
          context.leftProgress = event.data.leftProgress;
          context.rightProgress = event.data.rightProgress;
          context.resetProgress = event.data.resetProgress;
          context.neuronProgress = event.data.neuronProgress;
          context.restoreProgress = event.data.restoreProgress;
        }
      }),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("stateUpdate (tested via restoreRaise / restoreDefies)", () => {
    it("should accumulate global progress to 99% instead of 100% on Raise (problematic behavior)", async () => {
      // NOTE: This test asserts the Raise progress calculation precision issue.
      // Summing 0.33 * 3 gives 0.99 instead of 1.00.
      context.device.info.product = "Raise";
      context.backup = { backup: [] };

      // Seed reset and neuron progress to 100%
      context.resetProgress = 100;
      context.neuronProgress = 100;

      // We call restoreRaise which executes restoreSettings internally and hits stateUpdate
      await restoreRaise(context);

      // Verify that after completing the restore stage, globalProgress is 99% instead of 100%
      expect(context.globalProgress).toBe(99);
    });

    it("should calculate global progress to 100% on other keyboards", async () => {
      context.device.info.product = "Defy";
      context.backup = { backup: [] };

      // Make restoreProgress, neuronProgress, resetProgress, leftProgress, rightProgress all 100%
      context.restoreProgress = 100;
      context.neuronProgress = 100;
      context.resetProgress = 100;
      context.leftProgress = 100;
      context.rightProgress = 100;

      await restoreDefies(context);

      // For Defy, calculation is 0.2 * 5 = 1.0
      expect(context.globalProgress).toBe(100);
    });
  });

  describe("restoreSettings", () => {
    it("should connect, send settings commands, and disconnect", async () => {
      const mockDev = new Device({} as any, "serial");
      vi.mocked(DeviceTools.list).mockResolvedValue([mockDev]);
      vi.mocked(DeviceTools.connect).mockResolvedValue(mockDev);

      context.backup = {
        backup: [
          { command: "keymap.set", data: "1 2 3" },
        ],
      };

      const result = await restoreDefies(context);
      expect(result).toBe(true);
      expect(mockDev.command).toHaveBeenCalledWith("keymap.set 1 2 3");
      expect(DeviceTools.disconnect).toHaveBeenCalled();
    });
  });

  describe("reconnect", () => {
    it("should enumerate serial and reconnect", async () => {
      vi.mocked(DeviceTools.enumerateSerial).mockResolvedValue({
        foundDevices: [
          {
            device: {
              info: { product: "Raise", keyboardType: "ISO" },
            },
          } as any,
        ],
        validDevices: [],
      });

      context.originalDevice = {
        device: {
          info: { product: "Raise", keyboardType: "ISO" },
        },
      };

      const result = await reconnect(context);
      expect(result).toBe(true);
    });
  });

  describe("flashSide", () => {
    it("should disconnect device and trigger flashSide", async () => {
      const res = await flashSide("right", context);
      expect(res.rightResult).toBe(true);
      expect(DeviceTools.disconnect).toHaveBeenCalled();
      expect(context.flashSides.flashSide).toHaveBeenCalled();
    });
  });

  describe("uploadDefyWired", () => {
    it("should write binary file to defy mounted drive path", async () => {
      vi.mocked(ipcRenderer.invoke).mockResolvedValue("mock-volume-path");
      context.firmwares.fw = Buffer.alloc(10); // single buffer array-like mock

      const res = await uploadDefyWired(context);
      expect(res).toBe(context);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join("mock-volume-path", "default.uf2"),
        expect.any(Buffer),
        expect.any(Object)
      );
    });
  });

  describe("resetDefy", () => {
    it("should trigger resetKeyboard through RaiseTools", async () => {
      const res = await resetDefy(context);
      expect(res).toBe(context);
      expect(resetKeyboard).toHaveBeenCalled();
    });
  });

  describe("uploadDefyWireless", () => {
    it("should trigger NRf52833 flash and return status", async () => {
      const result = await uploadDefyWireless(context);
      expect(result).toBe(true);
      expect(NRf52833.flash).toHaveBeenCalled();
    });

    it("should result in an unhandled rejection if callback throws (problematic behavior)", async () => {
      // NOTE: This test illustrates the async error propagation callback bug.
      // If the finished callback throws because of an error, it rejects as an unhandled promise.
      vi.mocked(NRf52833.flash).mockImplementationOnce((fw, onProgress, finished) => {
        // Trigger finished callback with error
        finished(new Error("Flash failed"), "mock error info");
        return Promise.resolve();
      });

      let unhandledErr: any = null;
      const handler = (reason: any) => {
        unhandledErr = reason;
      };
      process.on("unhandledRejection", handler);

      try {
        const res = await uploadDefyWireless(context);
        expect(res).toBe(false);

        // Wait a tick for async rejection to execute
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(unhandledErr).toBeDefined();
        expect(unhandledErr.message).toContain("Flash error mock error info");
      } finally {
        process.off("unhandledRejection", handler);
      }
    });
  });

  describe("uploadRaise2", () => {
    it("should trigger Raise2 flash", async () => {
      const result = await uploadRaise2(context);
      expect(result).toBe(true);
      expect(Raise2Flash.flash).toHaveBeenCalled();
    });
  });

  describe("uploadSonsei", () => {
    it("should trigger Sonsei flash", async () => {
      const result = await uploadSonsei(context);
      expect(result).toBe(true);
      expect(SonseiFlash.flash).toHaveBeenCalled();
    });
  });

  describe("resetRaise", () => {
    it("should trigger resetKeyboard inside FlashRaise", async () => {
      const res = await resetRaise(context);
      expect(res).toBe(context);
      expect(context.flashRaise.resetKeyboard).toHaveBeenCalled();
    });
  });

  describe("uploadRaise", () => {
    it("should trigger updateFirmware inside FlashRaise", async () => {
      const res = await uploadRaise(context);
      expect(res).toBe(context);
      expect(context.flashRaise.updateFirmware).toHaveBeenCalled();
    });
  });
});
