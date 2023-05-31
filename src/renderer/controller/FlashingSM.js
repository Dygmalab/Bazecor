import { createMachine, assign, raise } from "xstate";
import { Octokit } from "@octokit/core";
import SemVer from "semver";
import Focus from "../../api/focus";

const sidesReady = (context, event) => {
  return context.sideLeftOk && context.sideRightOK;
};

const FocusAPIRead = async () => {
  let focus = new Focus();
  let data = {};
  data.bootloader = focus.device.bootloader;
  data.info = focus.device.info;
  data.version = await focus.command("version");
  data.version = data.version.split(" ")[0];
  data.chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
  if (Object.keys(data).length == 0 || Object.keys(data.info).length == 0) throw new Error("data is empty!");
  return data;
};

const loadAvailableFirmwareVersions = async () => {
  const octokit = new Octokit();
  let data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner: "Dygmalab",
    repo: "Firmware-releases",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  // console.log("Data from github!", JSON.stringify(data));
  let Releases = [];
  data.data.forEach(release => {
    let newRelease = {},
      name,
      version;
    const releaseData = release.name.split(" ");
    name = releaseData[0];
    version = releaseData[1];
    newRelease.name = name;
    newRelease.version = version;
    newRelease.assets = [];
    release.assets.forEach(asset => {
      newRelease.assets.push({
        name: asset.name,
        url: asset.browser_download_url
      });
      //console.log([asset.name, asset.browser_download_url]);
    });
    //console.log(newRelease);
    Releases.push(newRelease);
  });
  // console.log(defyReleases);
  return Releases;
};

const GitHubRead = async info => {
  const fwReleases = await loadAvailableFirmwareVersions();
  let finalReleases = fwReleases.filter(release => release.name === info.product);
  finalReleases.sort((a, b) => {
    return SemVer.ltr(SemVer.clean(a.version), SemVer.clean(b.version)) ? -1 : 1;
  });
  console.log("GitHub data acquired!", finalReleases);
  return finalReleases;
};

const CheckFWVersion = async () => {
  return true;
};

const GetLSideData = async () => {
  return true;
};

const GetRSideData = async () => {
  return true;
};

const flashingSM = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6ZAdQGUxUxyAXHUvagGVPQgARMADcclQejboAxBC5hq+EaQDWi5BQCusAIKEAkgCUwAgNoAGALqJQAB1K4OXWyAAeiAEwA2C9QsAHACsAJzengDM3t4hEZ6eADQgAJ6IcX4WACyZniEhAfkA7IVBEQC+ZUloWLgEJBRUtIzMrM7cfALCYhJSsmDEZMTUdhhsAGakxAC2tNp6hibm1q4OTpx4rh4IPhnBYZHRsfFJqQiZBf6FOaGZIeeZpd4VVRjY+ERklLA09Ews7OtePwIABxHBsTBaABG9DkCiUeBU6moYLYAAloZJpJYbEgQKtwetNohwgBGajBbwBCxBXyk7J5E4kiLk0kWUlBAIRWlBSIs54gapvOqfRq-FoArhAgSoyEwugyfqDYajCbTFHgjFQrHoHErRyElx4rZkim06m09kMkJMhAszLUYqFbmZQoBbylEI+AVC2ofBrfJp-VqAsboHCoLTEMAyIwAUQAKkYAJp6vEEtrEhAxclcixuzLeOKhd220khQrUL0M9mlAIFD0+15++pfH7Nf5taiwLTkNsyNP2A2Z42IEK86jnUmFUmkzyZcszwq26KVzyBCKFLJeoIWCIBJs1d6txp2aN2dDEKSAngMHAQMAAYUwrFUcLwimUakUILAbFv95gDqg74sORKjggc60tQnIRCy7JXFkASJCkiBun4u6ZDSpQRK6NIHpUgrNseoqBmeYAXleXYAQ+z6voqAyTCqUhqjMv7-neD7Acs6ZgUaoBbFB3gwVy8HTlh5woac4SeFWRZBM67JUr4hSHsK-ptsM56XteUpGJxT4vuQb7yB+CJIj+f76YB3G4kOaz8e4iCkt4HLUNydyFhyOQVrahR5JcyHhDOmSblyaktqRNDkZRuncNZtFGW+SpMSMLGTGxVkGbZ+oORsEEuW5HnZK5QQ+cuqEICU5Iyd4eGkhEYT5BFJEBtF2lUYCwbsF04hwAmpAAKp2BAUgxqZn6It+1B0cZ9AAGr9LgXAgRm4ECc5yF+ByhRFmEoR3NyK7IVWUTzkhXqeIUngtSKbVaRROldt1bC9V8A3DaNbAxoNhCCLoCZxqtfH5Rt2x7gEMHhKEERZGV7JSYgAQuVWyMVnO4mFqphG+q1mkxU9gIiOgqD3mNDDSGwOgyIQ8YMAwcaCMDeVZvO67UL4VJsqF+GkrayPCfk5ZsvE071iEt0aaeHVxdQYYRlGMbxkmqY8fZhqg05kExCEk6+GExQVv5M62rufjXW6zp1bhvLlDjxF3ZpYwYLAmB440ADu4ZsHGsDkDIcYMI+tOBwzTNq6BLMQVdWGTrtVt1eE+T8-WjqW658RxD4Tz20ejuNM76Cu+7gaF67Rg4FAmBsAZMgMINj6PqHzMa1msO+FWnKFpu-muRE-NbtQ64PHEUSBBYVKSyepcu27+cz0XmAV1XNeAQHRhGAA8kYLcjmD7d+OOATd4bfdltz-ixOOpSFl6uFT1FcuzyXNBl5gPBgGMq8PnXDdN-Tu91pazgmVGCFhwEFGHldIItoKyQydFkTwHJqTI1JA-e6b8X5P0Xh-L+tc4wb23oAxyWwQEOjNoEL0iCSj8yCDVWGcRbioNwjdXO6lp6v2fvPThi8AByYAoxcF-o3ZuEc1okLSHcSGrlzjW2pJ4TkMDKpsliJffch06HZ3QU7LhUsF6u34YIvA68t47zESDNuRZyRbnwtEGSAQKqnArLJM6Ki7GsJeHnPRNBoywDYJMMAPB0DJCWsI-+DBiGay2OuIIp14h5HkW6Is3gyx0N1qVfIDjGoenHNoxovj-HRiCSE4gsATFEPMVHMGroIhD1uEfZ0kQ2SOOco1WJQQFJYSugoq4FRCJ4FIA+eAeJcbcNyq3CCABaectppmZDyYGcUnYgHiKiV4TIK5amuhCNOL0sQvJXQWe2F6N5gRvSAr0cZe8tbXVtNkWJPhdoWHXDE+cEs2GRXukskMUoOignBHKegVygFbAeJWLajDrouQnhsyqLJpG0hjlyAoHSghHKDBKLs8tIzRmBRIhA1Itkzk3FEaIuQPS2jgrrGkeQGq+HhrI9F3zJTcB7H2KgeK1kEr3HHBqCck4UsqnY6gwtsiwwal3dFBNOqOVWVmEWusypUliFcechYUlwuiEPZCoQsh7h1nuKVMtqIGVmqoTl8r8yViVQUTcOQSoatOMSikcDxwPBpI1O2nj2GP2lbLBKhlXwWoKg8ckWcdngLgmyXCflQr+AsLEPc5Z5yzi9URLxHCHqxWepi85sAPojTGsGsGpJUEiqUkgq6FZNx+WpFWCNG5yyhDRR8rBfquzE1Jl9MAFMpA6GLVreIPgOZXAUruJ5NbKr+VqfkBSeQchj2ukax6MruDYsVgOwSZa2QuUrcbSd0l5yTnVQ8Uo-ksLvO9Z8nRi8X6bq8DhGC2QFFXRpN4YoSjpIBV2lyV0SD6zNvRZg7h1Avbgl9uQe92xOTkjKtcV9tIP380ao6RNVIkFbnXDnK9WDgPeOweXSu1cDJQdyOyScMcMYOLuIjAlE5LZ7DiNGzwBEcMgbw5mt+uDv5gCgyyccUM3R1luIpT9SNcJDzpXcEIE9gjnCA7ozjs9DFkE1nKiCuELgqO2THRqCjYH+SHnVZ5sR327n3Ap29IGUrED4yUB06H9xZGyT3Wh5J5wC2TWC8I6KCkBOKUtKDroyy3GEq5Io576SG3RWytsUGFJlkJZcWkyr8zVrthUIAA */
  predictableActionArguments: true,
  id: "FlahsingProcess",
  initial: "FWSelection",
  context: {
    stateblock: 0,
    device: {},
    fwStatus: {},
    retriesRight: 0,
    retriesLeft: 0,
    retriesNeuron: 0,
    sideLeftOk: false,
    sideLeftBL: false,
    sideRightOK: false,
    sideRightBL: false,
    version: {},
    firmwareList: [],
    selectefirmware: 0
  },
  states: {
    FWSelection: {
      initial: "LoadDeviceData",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Initial state running!");
        },
        assign({
          stateblock: (context, event) => context.stateblock + 1
        })
      ],

      states: {
        LoadDeviceData: {
          id: "LoadDeviceData",
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Load device data running!");
            }
          ],
          invoke: {
            id: "FocusAPIRead",
            src: FocusAPIRead,
            onDone: {
              target: "LoadGithubFW",
              actions: [assign({ device: (context, event) => event.data })]
            },
            onError: {
              target: "failure",
              actions: assign({ error: (context, event) => event.data })
            }
          }
        },
        LoadGithubFW: {
          id: "LoadGitHubData",
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Loading Github data!");
            }
          ],
          invoke: {
            id: "GitHubData",
            src: (context, data) => GitHubRead(context.device.info),
            onDone: {
              target: "success",
              actions: [assign({ firmwareList: (context, event) => event.data })]
            },
            onError: {
              target: "failure",
              actions: assign({ error: (context, event) => event.data })
            }
          }
        },
        failure: {
          on: {
            RETRY: "LoadDeviceData"
          }
        },
        success: {
          always: "#FlahsingProcess.preparation"
        }
      }
    },
    preparation: {
      id: "preparation",
      initial: "selectFirmware",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Preparation!");
        },
        assign({
          stateblock: (context, event) => context.stateblock + 1
        })
      ],
      states: {
        selectFirmware: {
          id: "selectFirmware",
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("select Firmware!");
              if (context.device.info.product == "Raise") raise("SKIP");
            }
          ],
          on: {
            //Esc key listener will send this event
            CHECK: "LSideCheck",
            SKIP: "SelectDevicesToUpdate",
            CHANGEFW: {
              actions: [assign({ selectefirmware: (context, event) => event.selected })]
            }
          }
        },
        LSideCheck: {
          id: "LSideCheck",
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Lside Check!");
            }
          ],
          invoke: {
            id: "GetLSideData",
            src: GetLSideData,
            onDone: ["RSideCheck"],
            onError: "failure"
          }
        },

        RSideCheck: {
          id: "RSideCheck",
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Rside Check!");
            }
          ],
          invoke: {
            id: "GetRSideData",
            src: GetRSideData,
            onDone: ["SelectDevicesToUpdate"],
            onError: "failure"
          }
        },
        SelectDevicesToUpdate: {
          id: "SelectDevicesToUpdate",
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
                  sideRightOK: event.data
                };
              })
            }
          },
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Loaded SelectDevicesToUpdate, waiting for UPDATE!");
            }
          ]
        },
        validateStatus: {
          id: "validateStatus",
          entry: [
            (context, event) => {
              console.log("Validate Status!");
            }
          ],
          on: {
            PRESSED: "#FlahsingProcess.flashingProcess"
          }
        },
        failure: {
          on: {
            RETRY: "LSideCheck"
          }
        }
      }
    },
    flashingProcess: {
      id: "flashingProcess",
      initial: "waitEsc",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Start Flashing process!");
          //enable listener for esc key
        },
        assign({
          stateblock: (context, event) => context.stateblock + 1
        })
      ],
      states: {
        waitEsc: {
          id: "waitEsc",
          on: {
            //Esc key listener will send this event
            ESCPRESSED: "#FlahsingProcess.flashingProcess.flashRightSide"
          },
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Wait for esc!");
              //enable listener for esc key
              //if per conditions it does not have to be enabled, skip it.
            },
            assign({ stateblock: (context, event) => context.stateblock + 1 })
          ],
          exit: [
            (context, event) => {
              //disable listener for esc key
            }
          ]
        },
        flashRightSide: {
          id: "flashRightSide",
          entry: [
            (context, event) => {
              console.log(`Flashing Right Side! for ${context.retriesRight} times`);
            },
            assign({
              retriesRight: (context, event) => context.retriesRight + 1
            })
          ],
          on: {
            SUCCESS: "flashLeftSide",
            ERROR: "error"
          }
        },
        flashLeftSide: {
          id: "flashLeftSide",
          entry: [
            (context, event) => {
              console.log(`Flashing Left Side! for ${context.retriesLeft} times`);
            },
            assign({
              retriesLeft: (context, event) => context.retriesLeft + 1
            })
          ],
          on: {
            SUCCESS: "flashNeuron",
            ERROR: "error"
          }
        },
        flashNeuron: {
          id: "flashNeuron",
          on: {
            SUCCESS: "#FlahsingProcess.restoreLayers",
            ERROR: "error"
          }
        },
        error: {
          id: "error",
          entry: [
            (context, event) => {
              console.log("Error has occurred", event);
            }
          ]
        }
      }
    },
    restoreLayers: {
      id: "restoreLayers",
      entry: [
        (context, event) => {
          console.log("Restoring layers");
        }
      ],
      on: {
        SUCCESS: "success",
        ERROR: {
          actions: (context, event) => console.log("error when restoring layers")
        }
      }
    },
    success: {
      type: "final"
    }
  }
});

export default flashingSM;
