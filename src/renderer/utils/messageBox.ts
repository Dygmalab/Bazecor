import { ipcRenderer } from "electron";

/*
 * Use these instead of window.alert / window.confirm. Those native renderer
 * dialogs leave the window without keyboard focus on Windows once closed, so
 * every text field stops taking input until the user refocuses the window by
 * hand. See the "show-message-box" handler in src/main/setup/configureIPCs.ts.
 */

/** Asks a yes/no question; resolves true when the user picks `okLabel`. */
export const confirmBox = async (message: string, okLabel = "OK", cancelLabel = "Cancel"): Promise<boolean> => {
  const { response } = await ipcRenderer.invoke("show-message-box", {
    type: "question",
    message,
    buttons: [okLabel, cancelLabel],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });
  return response === 0;
};

/** Shows a message with a single OK button. */
export const alertBox = async (message: string): Promise<void> => {
  await ipcRenderer.invoke("show-message-box", { type: "warning", message, buttons: ["OK"], noLink: true });
};
