/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
import log from "electron-log/main";
import delay from "./delay";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const drivelist = require("drivelist");

const listDrivesHandler = async (event: unknown, args: unknown) => {
  log.verbose("listing drives: ", event, args);
  let drives;
  let result: undefined | any;
  while (result === undefined) {
    drives = await drivelist.list();
    drives.forEach(async (drive: { description: string | string[]; mountpoints: string | unknown[] }, index: string | number) => {
      log.verbose("drive info", drive.description, drive.mountpoints);
      if (drive.description.includes("RPI RP2") || drive.description.includes("RPI-RP2")) {
        while (drive.mountpoints[0] === undefined || drive.mountpoints.length === 0) {
          await delay(100);
          drives = await drivelist.list();
          result = drives[index].mountpoints[0];
          log.verbose(result);
          if (result !== undefined) break;
        }
        if (result === undefined) {
          result = drive.mountpoints[0];
        }
      }
    });
  }
  return result.path;
};

export default listDrivesHandler;
