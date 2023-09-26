import ElectronStore from "electron-store";

class Store {
  private static instance: ElectronStore;

  private constructor() {
    // this comment is here so TS stays quiet
  }

  public static getStore() {
    if (!Store.instance) {
      Store.instance = new ElectronStore();
    }
    return Store.instance;
  }
}

export default Store;
