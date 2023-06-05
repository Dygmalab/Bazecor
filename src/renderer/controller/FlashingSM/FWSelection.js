import { createMachine, assign, raise } from "xstate";
import { Octokit } from "@octokit/core";
import axios from "axios";
import SemVer from "semver";
import Focus from "../../../api/focus";

const FocusAPIRead = async () => {
  let data = {};
  try {
    let focus = new Focus();
    data.bootloader = focus.device.bootloader;
    data.info = focus.device.info;
    data.version = await focus.command("version");
    data.version = data.version.split(" ")[0];
    data.chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
    if (Object.keys(data).length == 0 || Object.keys(data.info).length == 0) throw new Error("data is empty!");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return data;
};

const loadAvailableFirmwareVersions = async () => {
  let Releases = [];
  try {
    const octokit = new Octokit();
    let data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
      owner: "Dygmalab",
      repo: "Firmware-releases",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    // console.log("Data from github!", JSON.stringify(data));
    data.data.forEach(release => {
      let newRelease = {},
        name,
        version;
      const releaseData = release.name.split(" ");
      name = releaseData[0];
      version = releaseData[1];
      newRelease.name = name;
      newRelease.version = version;
      newRelease.body = release.body;
      newRelease.body_html = release.body_html;
      newRelease.body_text = release.body_text;
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
  } catch (error) {
    console.warn("error when querying GitHub with Octokit");
    console.error(error);
    throw new Error(error);
  }
  // console.log(defyReleases);
  return Releases;
};

const GitHubRead = async context => {
  let finalReleases, isUpdated, isBeta;
  const fwReleases = await loadAvailableFirmwareVersions();
  try {
    finalReleases = fwReleases.filter(release => release.name === context.device.info.product);
    finalReleases.sort((a, b) => {
      return SemVer.lt(SemVer.clean(a.version), SemVer.clean(b.version)) ? 1 : -1;
    });
    isUpdated = context.device.version == finalReleases[0].version ? true : false;
    isBeta = context.device.version.includes("beta");
  } catch (error) {
    console.warn("error when filtering data from GitHub");
    console.error(error);
    throw new Error(error);
  }
  console.log("GitHub data acquired!", finalReleases);
  return { firmwareList: finalReleases, isUpdated: isUpdated, isBeta: isBeta };
};

const obtainFWFiles = async (type, url) => {
  let response,
    firmware = undefined;
  try {
    if (type == "keyscanner.bin") {
      response = await axios.request({
        method: "GET",
        url: url,
        responseType: "arraybuffer",
        reponseEncoding: "binary"
      });
      firmware = new Uint8Array(response.data);
    }
    if (type == "Wired_neuron.uf2") {
      response = await axios.request({
        method: "GET",
        url: url,
        responseType: "arraybuffer",
        reponseEncoding: "binary"
      });
      firmware = response.data;
    }
    if (type == "Wireless_neuron.hex") {
      response = await axios.request({
        method: "GET",
        url: url,
        responseType: "text",
        reponseEncoding: "utf8"
      });
      response = response.data.replace(/(?:\r\n|\r|\n)/g, "");
      firmware = response.split(":");
      firmware.splice(0, 1);
    }
    if (type == "firmware.hex") {
      response = await axios.request({
        method: "GET",
        url: url,
        responseType: "text",
        reponseEncoding: "utf8"
      });
      response = response.data.replace(/(?:\r\n|\r|\n)/g, "");
      firmware = response.split(":");
      firmware.splice(0, 1);
    }
  } catch (error) {
    console.warn("error when retrieving firmware data with Axios");
    console.error(error);
    throw new Error(error);
  }
  // console.log(firmware);
  return firmware;
};

const downloadFirmware = async (typeSelected, info, firmwareList, selectedFirmware) => {
  let filename, filenameSides;
  console.log(typeSelected, info, firmwareList, selectedFirmware);
  try {
    if (typeSelected == "default") {
      if (info.product == "Raise") {
        filename = await obtainFWFiles(
          "firmware.hex",
          firmwareList[selectedFirmware].assets.find(asset => {
            return asset.name == "firmware.hex";
          }).url
        );
      } else {
        if (info.keyboardType == "wireless") {
          filename = await obtainFWFiles(
            "Wireless_neuron.hex",
            firmwareList[selectedFirmware].assets.find(asset => {
              return asset.name == "Wireless_neuron.hex";
            }).url
          );
        } else {
          filename = await obtainFWFiles(
            "Wired_neuron.uf2",
            firmwareList[selectedFirmware].assets.find(asset => {
              return asset.name == "Wired_neuron.uf2";
            }).url
          );
        }
        filenameSides = await obtainFWFiles(
          "keyscanner.bin",
          firmwareList[selectedFirmware].assets.find(asset => {
            return asset.name == "keyscanner.bin";
          }).url
        );
      }
    }
  } catch (error) {
    console.warn("error when asking for FW files");
    console.error(error);
    throw new Error(error);
  }

  return { fw: filename, fwSides: filenameSides };
};

const SelectionSM = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6ZAdQGUxUxyAXHUvagGVPQgARMADcclQejboAxBC5hq+EaQDWi5BQCusAIKEAkgCUwAgNoAGALqJQAB1K4OXWyAAeiAEwA2C9QsAHACsAJxBAIyengGeACwhAMwA7AA0IACeiN7eSdThSSFJngkh4SGeIRbeAL7VaWhYuAQkFFS0jMysztx8AsJiElKyYMRkxNR2GGwAZqTEALa02nqGJubWrg5OnHiuHgg+foGhEVEx8clpmQgJ4QHU3kHePrHZnvlJj7X1GNj4RGRKLAaPQmCx2DtePwIABxHBsTBaABG9DkCiUeBU6mocLYAAlkZJpJYbEgQFt4Ts9ll3tRgjkgkkAiUnt5wlcssFqEkgiVYoykrEkuFIt8QA0-s1AW1QZ0IVwoQJcYiUXQZCMxhMprMFjj4QSkUT0CTNo5KS4yftnuE6U8eUyWdl2RlEK8-N5mb4Et4ShZ3iExRKmgDWsD2mCupDYHK2MgcAsAO7oYhgGQAOQAogANAAqJrJFO61IQIW8IQeYU8gtingigWd1ySJW53li3vCQo7FiCgd+wZaQJBHXB3Wo0ZHccTydTAGE8bo0zCM-R8-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-opebU6AsVPTSYTaUiu10U7nyNeV9-Jymsj9PkbyRtj2iNwQjW6G9rPvXKk82zjnbhMJCNrG0flbxRxDi22+XbRV+YzrwLOCNgtVwTgg4KFUdkxEzYgSo7pGHLJiEEQIRaUv-rSxdTO+Mstexrb7EoNomEJzbAeeB0XQkJ3uEyd4hUfSkVCL5nB6XX79zHpPaes9ss7zZGOyKmyyzNPpqWZDFxgjbkPTUMzoL6uXXwYQr+YASFSB0ItxAkXcj5RIlUYOxXuHXhbIChjTI-SYcreZ47CSTKcbADdg4nwbRClWwUdbIUSrlF1oxqs3l0W7ePeS+JIPC3MnAe8Vk3ksJ6zWui3WzwPSFG8naZLWGJXiv-dYtgtjyAY95DacoUdsh45k8OlyHYdGFBqWpzSNZUc0-M90wZ2Ss4Y+wuA-k14tmlO9Ni+43kyblB9DWYowuoXU6hTCi5wOWvrpKUDfw-zGQPirFHcOTDymkT2+8Io9otfJP-ZKmlZB+2KpQvyYom0ihx1CExz5Ud3PbiBsUeIgpnc9PMxqOYIOIe8pbSHWOC18IihxSFYoV5qwPgfMeyNVqY3rwT5w1ZzIEHbgqoEtku8-THsU4OEHjIFLvGbD4UsS1QgVAO7UIAA */
  predictableActionArguments: true,
  id: "FlahsingProcess",
  initial: "LoadDeviceData",
  context: {
    stateblock: 0,
    device: {},
    version: {},
    firmwareList: [],
    firmwares: [],
    typeSelected: "default",
    selectedFirmware: 0,
    isUpdated: false,
    isBeta: false
  },
  states: {
    LoadDeviceData: {
      id: "LoadDeviceData",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Getting device info");
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
            }),
            (context, state) => {
              console.log("Success: ", context.device);
            }
          ]
        },
        onError: {
          target: "failure",
          actions: [
            (context, state) => {
              console.warn("error");
            },
            assign({ error: (context, event) => event })
          ]
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
        src: (context, data) => GitHubRead(context),
        onDone: {
          target: "selectFirmware",
          actions: [
            assign((context, event) => {
              return {
                firmwareList: event.data.firmwareList,
                isUpdated: event.data.isUpdated,
                isBeta: event.data.isBeta
              };
            }),
            assign({
              stateblock: (context, event) => context.stateblock + 1
            })
          ]
        },
        onError: {
          target: "failure",
          actions: assign({ error: (context, event) => event })
        }
      }
    },
    selectFirmware: {
      id: "selectFirmware",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("select Firmware!");
        },
        assign({
          stateblock: (context, event) => context.stateblock + 1
        })
      ],
      on: {
        NEXT: ["loadingFWFiles"],
        CHANGEFW: {
          actions: [assign({ selectedFirmware: (context, event) => event.selected })]
        }
      }
    },
    loadingFWFiles: {
      id: "loadingFWFiles",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Download Firmware!");
        },
        assign({
          stateblock: (context, event) => context.stateblock + 1
        })
      ],
      invoke: {
        id: "donwloadFirmware",
        src: (context, data) =>
          downloadFirmware(context.typeSelected, context.device.info, context.firmwareList, context.selectedFirmware),
        onDone: {
          target: "success",
          actions: [
            assign({ firmwares: (context, event) => event.data }),
            assign({
              stateblock: (context, event) => context.stateblock + 1
            })
          ]
        },
        onError: {
          target: "failure",
          actions: assign({ error: (context, event) => event })
        }
      }
    },
    failure: {
      on: {
        RETRY: "LoadDeviceData"
      }
    },
    success: { type: "final" }
  }
});

export default SelectionSM;
