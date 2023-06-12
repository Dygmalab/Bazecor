import { createMachine, assign, raise } from "xstate";
import SemVer from "semver";
import Focus from "../../../api/focus";
import Backup from "../../../api/backup";

const keyboardSetup = async context => {
  if (context.device.bootloader) return { RaiseBrightness: undefined };
  try {
    let focus = new Focus();
    if (context.device.info.product === "Raise") {
      await focus.command("led.mode 1");
      let brightness = await focus.command("led.brightness");
      await focus.command("led.brightness 255");
      return { RaiseBrightness: brightness };
    }
    await focus.command("upgrade.start");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return { RaiseBrightness: undefined };
};

const GetLSideData = async () => {
  let result = {};
  try {
    let focus = new Focus();
    result.version = await focus.command("version");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const GetRSideData = async () => {
  let result = {};
  try {
    let focus = new Focus();
    result.version = await focus.command("version");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const CheckFWVersion = async () => {
  let result = false;
  try {
    result = SemVer.ltr(result.version, result.version);
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const sidesReady = (context, event) => {
  return context.sideLeftOk && context.sideRightOK;
};

const CreateBackup = async context => {
  let backup;
  try {
    let bkp = new Backup();
    const commands = await bkp.Commands();
    backup = await bkp.DoBackup(commands, context.device.chipID);
    await bkp.SaveBackup(backup);
  } catch (error) {
    console.warn("error when creating Backup of the device");
    console.error(error);
    throw new Error(error);
  }
  return { backup: backup };
};

const DeviceChecks = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6dAd3RwBdlTiBhTMcga1gGIIpPGGr4AbqR6jpATwBGpdMQgBlMEwCuABwDaABgC6iUNtK4mOYSZAAPRAA591AIwuAnAFYA7O4BMACwAbO5eHgA0ILKILgDMQdSxvgHesfr+DkFBLgEAvrmRaFi4BCQUVLQMzKwcXLwCYMRkxNTaGEwAZmwAttRyispqGjoGxkggZhZWeDb2CEH6DtR+7t4uniGZsX4OLpHR8yuJq04LOwGxu-mFGNj4RGSUsDT0jCxsnNx8-KoAKgCCACVfqMbJNmNNZohAu5qA5POt3C4-Os-LEXEEHPtELEAgFqAi-NlPCtPF4-H5riAindSo8Kp9eAARbg4XDCfjsAASAFF2ABpUHjcGWazjObZfEItLuWKefQBfS49zYhCXFwEzwpfQooIklJ5ArU24lB7lZ7URk8FnkNnTH78gCShCFpnMELFoAlOQJcXScoVSoCKqijm81Ex8RyoQC6ziVJpprKTxoABlVDgIGArYJhKIJFJRABxDTpzNgJnoJjoV0Td2imbixzufF+EneFaYpE+byqwKeahI-QubwOFv6eUK2IJk33ZMVMtZnONZqtdpdYi9EtMRcVqs1oxg+uQpsIBwOPzHdyLILeAI7LyeVV6y8eDvXi76DuBGfFOf0i1AQzJc6h4XMRDEPBJGkahtyA8tK2rWsRRPL0YjbWJqB1Md9CVNt4SxUMEBRcNsKye9LiSMdPF-WkzRTah4JAr5+BXNg1yrDctw0Ji9yQw9hWPT07BidJYSSIkFTJJwHHiZ8SVcVYVinL8KWnI1E3-c0aHUVBuCYFlxBwJ5flIABVbQICrMBwPzKDC0tUDkAAdQANUadk8GQoTGzQhAciVOElQWRZz08c9VXiZxvDJZFxyyLVPBojTZzpbTqF0-TDOMuBTIsqymBsszCCZf5fh5bypmEuYMUyZZ0VCXCEWCCKiJRAd9RitsW0xO9vFopMAJocR0FQTNrNUastAEQhAR5VRVB5JlKo9XyROIpVML8bwggpXbgyRAI+3WAlAi6skWr6gatIYjpGFQTRiBsubfkBABNFaGyhfzYiSVw0hSdZvG8TaQwOTw-u21ItWCXwJxcfIjTwUgs3gcZNLSlMjyqta5nDFxZIWeIAxwnJVWcPwFQuXx0Qxa8IcNG4-0xipXmqD5QLRt0ce+pLXEJ4KSevMmiMlZYdXlWN3F2uVrpZi0rRtO1hJQ6rEACBFEl2pVgYxHwgiOojcXxdEyRbZrKZ1OX6IXYDs1A7HVu+1IKYxPb3CcOVcUijWCSCS5tp8PEEWSpm6PnQC7atR2vtPFxQsHfxthRCkCYcQ2DkppZYwh-wQYWOIEZS5mbYtTLyAMsAjJM8zLOsmPUPWnJwuoXX47b37eyIkdYQhy5R1wy5u364vw6G6gRrGgqwEmqtNC5usebjhw70SC5paSDXdjbVUPEvElMiyc54hi0PjRLiOaDunAHqehu1f8rfW7WduX871UIcvbsA+3-agmty+1BYCaHIFjQSS8-K6lbHEVIF5FTDiCMdfEO0LxpHPJ+Sm-9EZAA */
    predictableActionArguments: true,
    id: "FlahsingProcess",
    initial: "PerfSetup",
    context: {
      stateblock: 0,
      device: {},
      sideLeftOk: false,
      sideLeftBL: false,
      sideRightOK: false,
      sideRightBL: false,
      backup: undefined
    },
    states: {
      PerfSetup: {
        id: "PerfSetup",
        entry: [
          (context, event) => {
            console.log("Performing setup");
          }
        ],
        invoke: {
          id: "keyboardSetup",
          src: (context, data) => keyboardSetup(context),
          onDone: {
            actions: [
              assign((context, event) => {
                if (event.data.RaiseBrightness) {
                  return {
                    RaiseBrightness: event.data.RaiseBrightness
                  };
                }
              }),
              assign({
                stateblock: (context, event) => 1
              }),
              raise("internal")
            ]
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event })
          }
        },
        on: [
          { event: "*", target: "validateStatus", cond: "doNotRequireSideCheck" },
          { event: "*", target: "success", cond: "bootloaderMode" },
          { event: "*", target: "LSideCheck", cond: "requireSideCheck" }
        ]
      },
      LSideCheck: {
        id: "LSideCheck",
        entry: [
          (context, event) => {
            console.log("Checking left side");
          }
        ],
        invoke: {
          id: "GetLSideData",
          src: GetLSideData,
          onDone: {
            actions: [
              assign({
                stateblock: (context, event) => 2
              }),
              "RSideCheck"
            ]
          },
          onError: "failure"
        }
      },
      RSideCheck: {
        id: "RSideCheck",
        entry: [
          (context, event) => {
            console.log("Checking right side");
          }
        ],
        invoke: {
          id: "GetRSideData",
          src: GetRSideData,
          onDone: {
            actions: [
              assign({
                stateblock: (context, event) => 3
              }),
              "SelectDevicesToUpdate"
            ]
          },
          onError: "failure"
        }
      },
      SelectDevicesToUpdate: {
        id: "SelectDevicesToUpdate",
        entry: [
          (context, event) => {
            console.log("Selecting devices that are updatable");
          }
        ],
        on: {
          UPDATE: {
            target: "validateStatus",
            cond: sidesReady
          }
        },
        invoke: {
          id: "CheckFWVersion",
          src: CheckFWVersion,
          onDone: {
            actions: assign((context, event) => {
              return {
                sideLeftOk: event.data,
                sideRightOK: event.data,
                stateblock: 4
              };
            })
          },
          onError: "failure"
        }
      },
      validateStatus: {
        id: "validateStatus",
        entry: [
          (context, event) => {
            console.log("Validating status, waiting for UPDATE");
          }
        ],
        invoke: {
          id: "CreateBackup",
          src: (context, data) => CreateBackup(context),
          onDone: {
            actions: [
              assign((context, event) => {
                console.log(event);
                return {
                  backup: event.data.backup
                };
              }),
              assign({
                stateblock: (context, event) => 5
              }),
              (context, event) => {
                console.log("Backup ready");
              }
            ]
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event })
          }
        },
        on: {
          PRESSED: {
            target: "success",
            actions: [
              assign({
                stateblock: (context, event) => context.stateblock + 1
              })
            ]
          }
        }
      },
      failure: {
        on: {
          RETRY: "PerfSetup"
        }
      },
      success: {
        type: "final"
      }
    }
  },
  {
    guards: {
      requireSideCheck: (context, event) => {
        return !context.device.bootloader && context.device.info.product !== "Raise";
      },
      doNotRequireSideCheck: (context, event) => {
        return !context.device.bootloader && context.device.info.product === "Raise";
      },
      bootloaderMode: (context, event) => {
        return context.device.bootloader;
      }
    }
  }
);

export default DeviceChecks;
