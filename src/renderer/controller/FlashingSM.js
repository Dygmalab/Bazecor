import { createMachine, assign } from "xstate";
import { Octokit } from "@octokit/core";
import SemVer from "semver";

const sidesReady = (context, event) => {
  return context.sideLeftOk && context.sideRightOK;
};

const FocusAPIRead = async () => {
  console.log("Starting focusAPIread fn");
  // let focus = new Focus();
  let data = {};
  // data.bootloader = focus.device.bootloader;
  // data.info = focus.device.info;
  // console.log("getting kb info!");
  // data.version = await focus.command("version").split(" ")[0];
  // console.log("retrieved version", data.version);
  // data.chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
  console.log("Done reading data: ", data);
  return data;
};

const loadAvailableFirmwareVersions = async () => {
  // Octokit.js
  // https://github.com/octokit/core.js#readme
  const octokit = new Octokit();

  let data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner: "Dygmalab",
    repo: "Firmware-releases",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  // console.log("Data from github!", JSON.stringify(data));
  let defyReleases = [];
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
    defyReleases.push(newRelease);
  });
  // console.log(defyReleases);
  return defyReleases;
};

const GitHubRead = async () => {
  const fwReleases = await loadAvailableFirmwareVersions();
  let DefyReleases = fwReleases.filter(release => release.name === "Defy");
  DefyReleases.sort((a, b) => {
    return SemVer.ltr(SemVer.clean(a.version), SemVer.clean(b.version)) ? -1 : 1;
  });
  return DefyReleases;
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
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6ZAdQGUxUxyAXHUvagGVPQgARMADcclQejboAxBC5hq+EaQDWi5BQCusAIKEAkgCUwAgNoAGALqJQAB1K4OXWyAAeiAEwA2C9QsAHACsAJwAjADsEUEWQZ4BIUEANCAAnogAzFnUGUFhQXEALCEWEd7eEQC+lSloWLgEJBRUtIzMrM7cfALCYhJSsmDEZMTUdhhsAGakxAC2tNp6hibm1q4OTpx4rh4IPn6BoZHRsfGJKekIhQn+EYWeYdfeQYUZniHe1bUY2PhEZJRYDR6EwWOwtrx+BAAOI4NiYLQAI3ocgUSjwKnU1FhbAAEkjJNJLDYkCANnCtjtEN4HtRghUgsFPO9Xp4LtSMmFqGELPlvIU7hkAoKviA6r9GgCWiD2uCuJCBDiEci6DIhiMxhNpnNsXD8YjCehietHBSXKTdjSufTokyWW92QhOYVqFEIlkwt4QiEHmFcqLxQ1-s0ga1QR0IZN0DhUFpiGAZEYAKIAFSMAE1jaTyZ0qQgvdaMqUSt6Mr4QgFHWEQhFqD7CgKHhZ+YEKgGfkGmoDgW0wZ1qLAtORuzIs-ZTbmLYhEp5qNdPeUhUXPIzHc8MnXebFrlkAsLCu36n8uy07PG7OhiFIITwGDgIGAAMKYViqVF4RTKNSKaFgNi3+8wENMcyQnSkpwQMIV28ahGTeGlm2Fd4MkdMpa2rcoXhCQp+Wwz4ajFDtjylUMzzAC8r37ACH2fV81WGGZNSkbV5l-f87wfYC1mzMDzVAXYoKCGC4J8TxEIiZC1wsEJqGeGlnhXBJYhCQ8JWDbsxnPS9r3lIwOKfF9yDfeQP3RTEfz-PTAK4klx02Pj3EQT18hyUIMgFCwmz3ZI0kQCJgldCJAmid0AliXlVM7EiaDIiidO4KyaMMt91UY8ZmJmVjLP0myTXs7YIOcoJXJCdygq84JUKFHJ8keRDCmrMJIuIkMYq0yiIXDdhenEOAU1IABVOwICkBMTM-DFv2oWijPoAA1IZcC4ECc3A-inICMTuSCaJPAib0KlyNcvVks5HhpTxOQKZrJVazTyO0-surYHrAX6oaRrYBMBsIQRdBTJMVt4gr1r2CxqqEzxiiib0AjCR0wo3CpCiCD0AkOnabvU092vi6gRHQVB71GhhpDYHQZEIZMGAYJNBCB-K8yhrbfG8JTNtiPJvAR8HZLuVHOXR91MYIwMWo02LHsjaNY3jRNUwzBmzRBxzIK9GScJ5SI4IbFdHWuWt7liIKBWifkMixk9Q0mDBYEwcWWgAd2jNgk1gchKep2n6e4uzlaZu4-AFCpHm9YtSoRoS6RrasCm8OrPEt6LqBt9A7Yd63bcwIwcCgTA2H0mQGAGx9HyTGmlcnUGiyLOsUa54IgvkhH7lkl4dtKQIa2FJO7tT9Pbo0-vs9z-PC6TIwjAAeSMSu1tVmu-GwgpPUb5sfCrQIAldcGwk2-IG2rXuh6zjOaGHngwEmAvAKLkuy4r33QMZiCPWKvcLGDnbQoCQpHQ+DcQpvBZGKFBMI4DE6iyIoPFow8z4pyzpfa+49J4zzng5XYb86RhS-lEIUv8EZlmoJdABnIwExEgd8I8MDM5p3tjQ8+WcAByYA4xcDvqXcuDB0Eq0wSWOsiQ-T4M5E3TeUQd6CweC8BqKkoHUOxrQgeCjGF0JYWwvAMgJ7T1nk-VaGDMhuX8HDWICEvQ4T-r5BAiQYIx0KKUYBbxf74SoWpK2NB4ywDYDMMAPB0CpEWhwh+3DdHAyZrEOsbwizXB8PkaIVYYgumZKjBODUeQWzka45OHivHxl8f44gsBNGoJ0bZZ+-sIICg3FDb0OEyj8n2tzSxfowrcnKO6cBHw2b+WqARPApAHzwFJGLBheVymgwALRQ0dJMg8GSop3RlH2eeejeFeAsZcYBc59qejKKjBqCRrpzPgYsiM8puhCFEL1Q0oyq6qwkvrFGxCGQRHAXDfcsiXHzI0icuUXQoRKiRPQG589dgo1rBzeITJXggMdILNuNIMjemXjI4+0peynO4FGGMcYwDAv0QgRGWy-QNhwhWaS6zMiIv8KEBINZUkSTbEchhYZZT9kHMOKgeLVkEt5gKYlDYvRhWwmuOI2CGpvH8nBQ5nz4GSw6g5FZeYeTvFgrUn0ncOkUqdKKmscRyieTBThVFpFcZUX0jNVQXKlWlFrC8Co6qgqatQhYPwoRTgJHAfca4xq2oPXlQlc1yUrWFRRlyN48QoieShv5CIqEVWOvRi6istofX3Tik9Vlr0+qDWGqNYNoM97gO5LyHaPJQj8jZJYtCskAhlkeBkbZFZZkyuZXKvGBMiafTAKTKQOh82q2ZD4PmDYXlRobShKtLSKi-08hhUI3qmXKLTVLeUWLZa4p4i-AtcMuRa1LcpCta4i1+lKjEbCp7pWEXkW4hBdCz79t2CubI0iGq8n5PySIa50Zznji6t4LwP7NqvZkvup9mXOzhG7cgD6vCMi5C+rW76GqxssRzTcwCbWlGFJ5VNcDmXDxznnG+D4YN7GFFyBq9x3IgL3MK1D2QSg8kSHEPV5RcNgaXRfK+xGN1+1uZgz0xUCigOSckxplxf4bkePkN4rwPh7SA8MzjHGb3DzUWQFWirX4oyDgkYUMRciHssQAuk7oJXlt2c44DXzYEqeTqlYgpGG2en8DSTaJQO5+kIe-HaO5TFxFTdk7xeTFqkYFFWecxD3hQ1iNWGsHxU3su7KRnaVYY01uKGWDuZ6Ag9MqEAA */
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
        }
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
              actions: [
                assign({ device: (context, event) => event.data }),
                assign({
                  stateblock: (context, event) => context.stateblock + 1
                })
              ]
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
            src: GitHubRead,
            onDone: {
              target: "success",
              actions: [
                assign({ firmwareList: (context, event) => event.data }),
                assign({
                  stateblock: (context, event) => context.stateblock + 1
                })
              ]
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
      initial: "LSideCheck",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Preparation!");
        }
      ],
      states: {
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
            onDone: [
              assign({
                stateblock: (context, event) => context.stateblock + 1
              }),
              "RSideCheck"
            ],
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
            onDone: [
              assign({
                stateblock: (context, event) => context.stateblock + 1
              }),
              "SelectDevicesToUpdate"
            ],
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
                  sideRightOK: event.data,
                  stateblock: context.stateblock + 1
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
        }
      ],
      states: {
        waitEsc: {
          id: "waitEsc",
          on: {
            //Esc key listener will send this event
            PRESSED: "#FlahsingProcess.flashingProcess.flashRightSide"
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
