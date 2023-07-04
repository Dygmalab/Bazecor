import Window from "../managers/Window";

const sendToRenderer = (channel: string, ...args: unknown[]) => {
  const window = Window.getWindow();
  window.webContents.send(channel, ...args);
};

export default sendToRenderer;
