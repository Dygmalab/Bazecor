import { ipcRenderer } from "electron";
import Store from "./Store";
import { initSentry } from "./sentry";
import { initFullstory } from "./fullstory";

const setConsent = async (consentGiven: boolean) => {
  const store = Store.getStore();
  const currentConsent = store.get("consent");
  store.set("consent", consentGiven);
  await ipcRenderer.invoke("change-consent", consentGiven);
  if (currentConsent === true && !consentGiven && process.env.NODE_ENV === "production") {
    console.log("Shutting down analytics");
  } else if (currentConsent === false && consentGiven && process.env.NODE_ENV === "production") {
    console.log("Starting analytics");
    initSentry();
    initFullstory();
  }
};

export { initSentry, setConsent };
