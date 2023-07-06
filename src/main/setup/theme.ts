import { nativeTheme, NativeTheme } from "electron";
import Store from "../managers/Store";
import sendToRenderer from "../utils/sendToRenderer";

const onThemeChange = () => () => {
  sendToRenderer("darkTheme-update", nativeTheme.shouldUseDarkColors);
};

const configureNativeTheme = () => {
  nativeTheme.on("updated", onThemeChange());
};

const setTheme = () => {
  const store = Store.getStore();
  let darkMode = store.get("settings.darkMode");
  if (typeof darkMode === "boolean" || darkMode === undefined) {
    darkMode = "system";
    store.set("settings.darkMode", "system");
  }
  // Setting nativeTheme currently only seems to work at this point in the code
  nativeTheme.themeSource = darkMode as NativeTheme["themeSource"];
};

export { configureNativeTheme, setTheme, onThemeChange };
