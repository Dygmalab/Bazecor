import { checkUdev, installUdev } from "../utils/udev";
import Window from "../managers/Window";

const onReadyToShow = () => {
  const window = Window.getWindow();
  window.once("ready-to-show", () => {
    window.show();
    if (process.platform === "linux") {
      if (!checkUdev()) {
        installUdev(window);
      }
    }
  });
};

export default onReadyToShow;
