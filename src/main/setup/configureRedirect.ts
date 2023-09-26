import { shell } from "electron";
import Window from "../managers/Window";

const configureRedirect = () => {
  const window = Window.getWindow();
  const handleRedirect = (e: any, url: string) => {
    if (url !== window.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  window.webContents.on("will-navigate", handleRedirect);

  window.webContents.setWindowOpenHandler(() =>
    // new-window handler removed in Electron 22
    ({ action: "deny" }),
  );
};

export default configureRedirect;
