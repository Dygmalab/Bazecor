import Window from "../managers/Window";
import sendToRenderer from "../utils/sendToRenderer";

const onDevTools = () => {
  const window = Window.getWindow();
  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
    sendToRenderer("opened-devtool", true);
  });

  window.webContents.on("devtools-closed", () => {
    sendToRenderer("closed-devtool", false);
  });
};

export default onDevTools;
