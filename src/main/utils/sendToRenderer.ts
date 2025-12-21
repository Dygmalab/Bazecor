import Window from "../managers/Window";

const sendToRenderer = (channel: string, ...args: unknown[]) => {
  const window = Window.getWindow();
  if (window && !window.isDestroyed()) {
    window.webContents.send(channel, ...args);
  }
};

export default sendToRenderer;
