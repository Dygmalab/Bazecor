import { createMachine, assign } from "xstate";
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
  data.info = focus.device.info
  data.version = focus.command("version").split(" ")[0];
    let chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
    let availableFW = await this.selectFWTypefromGitHub(focus.device.info.product);
    // console.log("FWs from Github!", availableFW);
    this.setState({ commands, neuronID: chipID, firmwareList: availableFW, selectedFirmware: 0 });
  return {vendor: "dygma", product:"raise", type: "ISO", fw: "v0.0.0"}
}

const loadAvailableFirmwareVersions = async () => {
  // Octokit.js
  // https://github.com/octokit/core.js#readme
  const octokit = new Octokit();

  let data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner: "Dygmalab",
    repo: "Firmware-releases",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  // console.log("Data from github!", JSON.stringify(data));
  let defyReleases = [];
  data.data.forEach((release) => {
    let newRelease = {},
      name,
      version;
    const releaseData = release.name.split(" ");
    name = releaseData[0];
    version = releaseData[1];
    newRelease.name = name;
    newRelease.version = version;
    newRelease.assets = [];
    release.assets.forEach((asset) => {
      newRelease.assets.push({ name: asset.name, url: asset.browser_download_url });
      //console.log([asset.name, asset.browser_download_url]);
    });
    //console.log(newRelease);
    defyReleases.push(newRelease);
  });
  // console.log(defyReleases);
  return defyReleases;
}

const GitHubRead = async type => {
  const fwReleases = await loadAvailableFirmwareVersions();
  let DefyReleases = fwReleases.filter((release) => release.name === type);
  DefyReleases.sort((a, b) => {
    return SemVer.ltr(SemVer.clean(a.version), SemVer.clean(b.version)) ? -1 : 1;
  });
  return DefyReleases;
}

const CheckFWVersion = async () => {
  return true;
}

const GetLSideData = async () => {
  return true;
}

const GetRSideData = async () => {
  return true;
}

const flashingMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6ASTxwBcd1UBlR9RsAYgG0ADAF1EoAA6lczUnlEgAHogCMAgOwBOakoBM2gKwA2JQA4ALAb3qLAGhABPZQd3V921doDMHvR+Pb1qgC+gbZoWLgEJBRUdAzMrBxcYNQAMqToEAAiYABuOJSZXOg8EDLJ+DmkANbJyBQArrAAgoS0AEpgGYIiSCASUjgycooIvkrU7gYGHkoe7hrapqa2DghKqkp61E7G6qa6qgICSpvBoRjY+ERklLA09Ews7JzcqelZuflghZw8YMRkYjUMQYRgAM1IxAAttQ6uRGi12p0IN05P1HkNeiMxhNtFMZnM3OpFst7Mo9BTqAI3PsKRSnPsziAwpdIjcYg94s8km8MgBxJiYeoAI2QAHUSmVqBVqskBYwABIin7oVG9dHSWRYxCqUweaimAI+LxKAzmUxKFbKDQCLQCPZmvT6PUnJksiLXaJ3WKPBIvZJpfmCkXiv4AyHA0EQ6HUeVK4UqtXiSQYrWgEa6-WG1TGmZms2WslrAwBKl6UyqOYeUwCYx6N0XD1RW73OJPRKvMHoHCoerEXhtACiABU2gBNJN9FOa4aIYyzA0bSzzpRWabaK1rPWmFzqQzGKa7bTGAT1kLMxtXZsctt+nmwerkFs8IejifCNHTwZphRzhcVzZ1BXNcPA3IsTGJbYAPnVRjGrfYDAbcIr3Zb0OjwCB-g7RpJTwco8EqGpqAAYUwMByCqcUADV-lwGRJw1b9ZzWXQDBcJZiS8XUfGJTcZk0dRq3UEwBGrTwLCQ1lPRbah0Mw4hsNgHgAFVCEyJph0HBiv0xdNECMcYdFUKZTw4qZN1MHxqCAgRDR0PQdAMJdJKbVCaDEfsxHQYguG-fgP3VHSfxGWZfC0bQjlNe1ZmM4xN1NTwqQPU9Dw2aYXJQr0aBSNgcEw0jyKqXD8MIuUwEYHK8u+IptIGXTfxY+LtAytkstSXL8rIiiw0BSMuGjGE+XKyrMMTALkzq4LlC8YxwsigxormAw4vAvQc22DxqT0E9PEWFrpJiNoOrAArutKPDpQI2VY3Ko6qrGnoJtTZjtBOKkPDNYx51svwBAMCyPqpWLyz3St7UQ893UymS7s6wqeojEF+shQbbuOh7P0ml7Xvez7vtMX7-qLCLbUOQ5zGXXxlv269vQAd27RhB1gcgeEIIc2DYQdMlq57tQQPdZvWExDlAnNaz0CyrJsuz9Ec5zIcvVqZLBDBYEwNocCgTBGGOng2GU4jiMHTneZnfnFi2YzNr+2Y9GOKwVtWQTVGsjY630E8rCUUwabc6hVfQdXNe13WqpfEdxzNpj+d4os4NdjwrAQ+cqzcP22sD9WUjAMEw8w-XDeN03xqnLH+Z8W0Sw0C0c299R1E3GD2KOIx1DUCl-AzlW1cwHO87118o9Lxj6pGSvtgCPZ1ksNvG6LPYdyp2DBJUU8627mIs8wAA5MA+xkQujZNtho7Huc1GoXY4JLCkdDrInVlUSstGE2vjyAk1N+9be94PvAI5vjPlNBAJ5XbXw+nuByx5DBN0ShYQ0QFphTDPOcZCyst7dl7P2QBw9Hplz5npBATp4pOFJgTJyttqxnnPHgUgmF4C9Chhgu4mNCENQALQfU3Bw9aFZhI5gSj4Es6hv6tl9NybgbDzZEJ9lsM0f0lgLTJiWMCqwdANyvvbOYf19w5l9ordBB1vScnbP6XkHw8gFCKNImOsjBJQUUeYNQahVHxQpLaCsUxLIOVrE4VBF4jG03EVyDsAZ3jyiFKKMUtjz7EI0AaIwtknQnDNN4eKhxbSCUgSoXUMEgiGKksEn0oTzFdh7H2MAsSQGCS2CcV6Sd6lJMluBJR1lTzUlsm3WCBi0FFP9qYu8rwHxPioNU5itStA6FmMJRyKgWnqObhWSBm1LCnlAmI2SYAMJYReI0cZ-N9g7m3HuACcwgKFlWLXayuxtp7DxJYRkhTXJtQ8mALyPkZEEK+SFdYO4RbzntuWWyxx3F+G2MZYyDdW7zk2SNE6XUqgHNkT4cYDk6zP3vioOC7iawbRBq43Re1nnQ0OsdU6SLArlyIfsPiJZFxqA+uaXaEM+kvJkgzJgzNyDIoahoTQng1zEnbsLR+iA9RZLMEnHwiwNgRQKWy0lP9e4hx1sdXlIwzRTO2rBY4mwTA+E3IJWalkvpeD+mTA8mzt793zlUql7DsQnmoISGsdZ4Lt3ns7MKpq4KbUobBVlgT+mZ17n-MgP5R4gJQS6tQu01rmiTk3dYuJyaCo+gq4N7KYgjJbBqxA9zqD21gjmQwBMDweE3M-bQBohKsU2Ko3pWalU0HKdg+1T0fkFtXEWxp6xq2GjUQWuY2xnQN0rHMSyHhgjBCAA */
  predictableActionArguments: true,
  id: "FlahsingProcess",
  initial: "InitialState",
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
  },
  schema: {
    services: {
      LoadGithubFW: {
        data: [],
      },
      FocusAPIRead: {
        data: {},
      },
    },
  },
  states: {
    InitialState: {
      always: ".LoadDeviceData",

      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Initial state running!");
        },
      ],

      states: {
        LoadDeviceData: {
          id: "LoadDeviceData",
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Load device data running!");
              context.stateblock = context.stateblock+1;
            },
          ],
          invoke: {
            id: "FocusAPIRead",
            src: FocusAPIRead,
            onDone: {
              target: "LoadGithubFW",
              actions: assign({ device: (context, event) => event.data }),
            },
            onError: {
              target: "failure",
              actions: assign({ error: (context, event) => event.data }),
            },
          },
        },
        LoadGithubFW: {
          id: "LoadGitHubData",
          invoke: {
            id: "GitHubData",
            src: GitHubRead,
            onDone: {
              target: "success",
              actions: assign({ firmwareList: (context, event) => event.data }),
            },
            onError: {
              target: "failure",
              actions: assign({ error: (context, event) => event.data }),
            },
          },
          entry: [
            (context, event) => {
              // This will error at .flag
              console.log("Loading Github data!");
              context.stateblock = context.stateblock+1;
            },
          ],
        },
        failure: {
          on: {
            RETRY: "LoadDeviceData",
          },
        },
        success: {
          always: "preparation",
        },
      }
    },
    RenderStatus: {
      on: {
        UPDATE: {
          target: "waitEsc",
          cond: sidesReady,
        },
      },
      invoke: {
        id: "CheckFWVersion",
        src: CheckFWVersion,
        onDone: {
          actions: assign((context, event) => { 
            return {
              sideLeftOk: event.data,
              sideRightOK: event.data
            }
          }),
        },
      },
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Loaded RenderStatus, waiting for UPDATE!");
          context.stateblock = context.stateblock+1;
        },
      ],
    },

    preparation: {
      always: "LSideCheck",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Preparation!");
          context.stateblock = context.stateblock+1;
        },
      ],
    },

    LSideCheck: {
      invoke: {
        id: "GetLSideData",
        src: GetLSideData,
        onDone: "RSideCheck",
        onError: "preparation",
      },
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Lside Check!");
          context.stateblock = context.stateblock+1;
        },
      ],
    },

    RSideCheck: {
      invoke: {
        id: "GetRSideData",
        src: GetRSideData,
        onDone: "RenderStatus",
        onError: "preparation",
      },
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Rside Check!");
          context.stateblock = context.stateblock+1;
        },
      ],
    },

    waitEsc: {
      on: {
        PRESSED: "flashRightSide",
      },
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Wait for esc!");
          context.stateblock = context.stateblock+1;
        },
      ],
    },

    flashRightSide: {
      on: {
        SUCCESS: "flashLeftSide",
        RETRY: {
          target: "flashRightSide",

          actions: assign({
            retriesRight: (context, event) => context.retriesRight + 1,
          }),

          cond: "New guard",
        },
      },
    },

    flashLeftSide: {
      on: {
        SUCCESS: "flashNeuron",
        RETRY: "failure",
      },
    },

    flashNeuron: {
      on: {
        SUCCESS: "success",
        RETRY: "failure",
      },
    },

    success: {
      type: "final",
    },

    failure: {
      on: {
        RETRY: "InitialState",
      },
    },
  },
});

export default flashingMachine;
