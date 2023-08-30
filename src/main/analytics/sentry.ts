import * as Sentry from "@sentry/electron/main";
import Store from "../managers/Store";

const initSentry = () => {
  const store = Store.getStore();
  const consent = store.get("consent");

  if (consent && process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: "https://4f2776f1fa5ce54b4dab6e8b510f2473@o4505792386760704.ingest.sentry.io/4505792424837120",
    });
  }
};

const closeSentry = () => Sentry.close();

export { initSentry, closeSentry };
