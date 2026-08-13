import { BrowserWindow } from "electron";

class LensOverlay {
  private static instance: LensOverlay;

  private static window: BrowserWindow | null = null;

  private constructor() {
    // this comment is here so TS stays quiet
  }

  public static getInstance() {
    if (!LensOverlay.instance) {
      LensOverlay.instance = new LensOverlay();
    }
    return LensOverlay.instance;
  }

  public static setWindow(newWindow: BrowserWindow | null) {
    LensOverlay.window = newWindow;
  }

  public static getWindow(): BrowserWindow | null {
    return LensOverlay.window;
  }
}

export default LensOverlay;
