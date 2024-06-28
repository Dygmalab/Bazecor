import { checkUdev, installUdev } from "../utils/udev";
import Window from "../managers/Window";
import autoUpdateOptIn from "../utils/autoUpdateOptIn";

const onReadyToShow = () => {
  const window = Window.getWindow();
  window.once("ready-to-show", () => {
    window.show();
    if (process.platform === "linux") {
      if (!checkUdev()) {
        installUdev(window);
      }
    }
    autoUpdateOptIn(window);
  });
};

export default onReadyToShow;
