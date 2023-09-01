import * as FullStory from "@fullstory/browser";
import Store from "./Store";

const initFullstory = () => {
  const store = Store.getStore();
  const consent = store.get("consent");

  if (consent && process.env.NODE_ENV === "production") {
    FullStory.init({ orgId: "o-1PYPRZ-na1" });
  }
};

export { initFullstory };
