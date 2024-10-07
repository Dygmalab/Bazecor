export interface StorageType {
  settings: {
    backupFolder: string;
    backupFrequency: number;
    language: string;
    darkMode: string;
    hideBluetoothExperimental?: boolean;
    showDefaults: boolean;
    isStandardView: boolean;
  };
  neurons: unknown[];
}
