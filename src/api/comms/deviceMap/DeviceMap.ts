import log from "electron-log/renderer";

export default class DeviceMap extends Map<string, string> {
  isUpdated(key: string, value: string): boolean {
    log.warn("comparison between keys", this.get(key) === value, this.get(key), value);
    return this.get(key) === value;
  }
}
