const drivelist = require("drivelist");
import delay from "./delay";

const listDrivesHandler = async (_event: any, _someArgument: any) => {
  let drives;
  let result: undefined | any;
  while (result === undefined) {
    drives = await drivelist.list();
    drives.forEach(async (drive: { description: string | string[]; mountpoints: string | any[] }, index: string | number) => {
      console.log("drive info", drive.description, drive.mountpoints);
      if (drive.description.includes("RPI RP2") || drive.description.includes("RPI-RP2")) {
        while (drive.mountpoints[0] === undefined || drive.mountpoints.length === 0) {
          delay(100);
          drives = await drivelist.list();
          result = drives[index].mountpoints[0];
          console.log(result);
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
