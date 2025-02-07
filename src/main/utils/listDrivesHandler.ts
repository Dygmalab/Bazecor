/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import log from "electron-log/main";
import { Drive, list } from "drivelist";
import { delay } from "./delay";

// Only used in the test to ensure proper behaviour when limiting the retries.
// TODO: Remove this setter when determination is made for retry count.
let allowedRetryCount = -2;
export function setAllowedRetries(newRetryCount: number): void {
  allowedRetryCount = newRetryCount;
}

export async function listDrivesHandler(event: unknown, args: unknown): Promise<string> {
  log.verbose("listing drives: ", event, args);
  // Special value: -2 means unlimited retries
  let retries = allowedRetryCount; // Note: Unlimited retries is the current behaviour
  while (retries === -2 || retries > 0) {
    const drives: Drive[] = await list();
    const rpIndex = drives.findIndex(drive => /.*RPI[ -]RP2.*/.test(drive.description));
    if (rpIndex < 0) {
      await delay(100);

      // Device Not Found
      if (retries === -2) {
        continue;
      }
      --retries;
      continue;
    }
    const rpDrive = drives[rpIndex];
    if (rpDrive.mountpoints === undefined || rpDrive.mountpoints.length === 0 || rpDrive.mountpoints[0] === undefined) {
      await delay(100);

      // No Mountpoints Found
      if (retries === -2) {
        continue;
      }
      --retries;
      continue;
    }
    return rpDrive.mountpoints[0].path;
  }
  return "";
}
