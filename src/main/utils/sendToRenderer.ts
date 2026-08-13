import Window from "../managers/Window";

// The main window can be destroyed while the app keeps running in the
// background (Lens overlay only), so callers driven by global listeners
// (USB/HID device events) can't assume it's still there.
const sendToRenderer = (channel: string, ...args: unknown[]) => {
  const window = Window.getWindow();
  if (!window || window.isDestroyed()) return;
  window.webContents.send(channel, ...args);
};

export default sendToRenderer;
