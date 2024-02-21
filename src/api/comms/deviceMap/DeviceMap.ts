export default class DeviceMap extends Map<string, string> {
  isUpdated(key: string, value: string): boolean {
    console.warn("comparison between keys", this.get(key) === value, this.get(key), value);
    if (this.get(key) === value) return true;
    return false;
  }
}
