import type { LensStoreState } from "../../lens/shared/types";

export interface StorageType {
  settings: {
    backupFolder: string;
    backupFrequency: number;
    language: string;
    darkMode: string;
    hideBluetoothExperimental?: boolean;
    showDefaults: boolean;
    version: string;
    runInBackground?: boolean;
  };
  neurons: unknown[];
  lens?: LensStoreState;
}
