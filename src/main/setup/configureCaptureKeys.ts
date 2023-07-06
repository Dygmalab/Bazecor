import { UiohookKey } from "uiohook-napi";
import sendToRenderer from "../utils/sendToRenderer";

const UiohookToName = Object.fromEntries(Object.entries(UiohookKey).map(([k, v]) => [v, k]));

const sendkeyDown = (e: any) => {
  const data = { event: e, name: UiohookToName[e.keycode], time: Date.now() };
  sendToRenderer("recorded-key-down", data);
};

// function send webContents event for keyUp
const sendKeyUp = (e: any) => {
  const data = { event: e, name: UiohookToName[e.keycode], time: Date.now() };
  sendToRenderer("recorded-key-up", data);
};

export { sendKeyUp, sendkeyDown };
