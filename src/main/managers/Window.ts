import { BrowserWindow } from "electron";

class Window {
  private static instance: Window;

  private static window: BrowserWindow;

  private constructor() {
    // this comment is here so TS stays quiet
  }

  public static getInstance() {
    if (!Window.instance) {
      Window.instance = new Window();
    }
    return Window.instance;
  }

  public static setWindow(newWindow: BrowserWindow | null) {
    Window.window = newWindow;
  }

  public static getWindow(): BrowserWindow | null {
    return Window.window;
  }
}

export default Window;
