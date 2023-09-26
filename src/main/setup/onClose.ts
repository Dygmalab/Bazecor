import { nativeTheme } from "electron";
import { onThemeChange } from "./theme";
import Window from "../managers/Window";

const onClose = () => {
  const window = Window.getWindow();
  window.on("closed", () => {
    nativeTheme.off("updated", onThemeChange);
    Window.setWindow(null);
  });
};

export default onClose;
