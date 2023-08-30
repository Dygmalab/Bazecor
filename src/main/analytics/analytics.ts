import { ipcMain } from "electron";
import Store from "../managers/Store";
import { initSentry, closeSentry } from "./sentry";

const setConsent = (consentGiven: boolean) => {
  const store = Store.getStore();
  const currentConsent = store.get("consent");
  store.set("consent", consentGiven);
  if (currentConsent === true && consentGiven === false && process.env.NODE_ENV === "production") {
    console.log("Shutting down analytics");
    closeSentry();
  } else if (currentConsent === false && consentGiven === true && process.env.NODE_ENV === "production") {
    console.log("Init analytics");
    initSentry();
  }
};

const addAnalyticsListener = () => {
  ipcMain.handle("change-consent", (event, newConsent: boolean) => setConsent(newConsent));
};

const removeAnalyticsListener = () => {
  ipcMain.removeHandler("change-consent");
};

export { removeAnalyticsListener, addAnalyticsListener };
