import { Octokit } from "@octokit/core";
import axios from "axios";
import SemVer from "semver";
import log from "electron-log/renderer";
import path from "path";
import fs from "fs";

import { ReleaseType } from "@Renderer/types/releases";
import * as Context from "./context";

const FWMAJORVERSION = "1.x";

export const FocusAPIRead = async (context: Context.ContextType): Promise<Context.ContextType> => {
  try {
    if (context.deviceState === undefined) return context;
    const { currentDevice } = context.deviceState;
    context.device.bootloader = currentDevice.device?.bootloader !== undefined ? currentDevice.device.bootloader : false;
    context.device.info = currentDevice.device.info;
    if (context.device.bootloader) return context;
    log.info("CHECKING CONTEXT DEPENDENCIES: ", context.deviceState.currentDevice.device);
    const versionData = await currentDevice.noCacheCommand("version");
    // eslint-disable-next-line prefer-destructuring
    context.device.version = versionData.split(" ")[0];
    context.device.chipID = (await currentDevice.noCacheCommand("hardware.chip_id")).replace(/\s/g, "");
    if (Object.keys(context).length === 0 || Object.keys(context.device.info).length === 0) throw new Error("data is empty!");
  } catch (error) {
    log.warn("error when querying the device");
    log.error(error);
    throw new Error(error);
  }
  return context;
};

const loadAvailableFirmwareVersions = async (allowBeta: boolean) => {
  const Releases: ReleaseType[] = [];
  try {
    const octokit = new Octokit();
    const data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
      owner: "Dygmalab",
      repo: "Firmware-release",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    // log.info("Data from github!", JSON.stringify(data));
    data.data.forEach(release => {
      const releaseData = release.name?.split(" ");
      const name = releaseData ? releaseData[0] : "";
      const version = releaseData ? releaseData[1] : "";
      const body = release.body || "";
      const assets: Array<{
        name: string;
        url: string;
      }> = [];
      const newRelease: ReleaseType = { name, version, body, assets };
      if (release?.assets !== undefined) {
        release.assets.forEach(asset => {
          newRelease.assets.push({
            name: asset.name,
            url: asset.browser_download_url,
          });
          // log.info([asset.name, asset.browser_download_url]);
        });
      }
      // log.info(newRelease);
      if (newRelease.assets.length > 0 && (allowBeta || !newRelease.version?.includes("beta"))) {
        Releases.push(newRelease);
      }
    });
  } catch (error) {
    log.warn("error when querying GitHub with Octokit");
    log.error(error);
    throw new Error(error);
  }
  // log.info(defyReleases);
  return Releases;
};

export const GitHubRead = async (context: Context.ContextType): Promise<Context.ContextType> => {
  const data = { ...context };
  let finalReleases: ReleaseType[];
  let isUpdated;
  let isBeta;
  try {
    const fwReleases = await loadAvailableFirmwareVersions(context.allowBeta);
    finalReleases = fwReleases.filter(
      release =>
        release.name === context.device.info.product &&
        (context.device.info.product !== "Raise"
          ? SemVer.satisfies(release.version ? release.version : "", FWMAJORVERSION, { includePrerelease: true })
          : true),
    );
    finalReleases.sort((a, b) => (SemVer.lt(SemVer.clean(a.version) as string, SemVer.clean(b.version) as string) ? 1 : -1));
    if (context.device.bootloader) {
      data.firmwareList = finalReleases;
      data.isUpdated = false;
      data.isBeta = false;
      return data;
    }
    if (finalReleases.length > 0) {
      isUpdated = context.device.version === finalReleases[0]?.version;
      isBeta = context.device.version.includes("beta");
    } else {
      isUpdated = true;
      isBeta = false;
    }
  } catch (error) {
    log.warn("error when filtering data from GitHub", error);
    throw new Error(error);
  }
  log.info("GitHub data acquired!", finalReleases);
  data.firmwareList = finalReleases;
  data.isUpdated = isUpdated;
  data.isBeta = isBeta;
  return data;
};

const obtainFWFiles = async (type: string, url: string) => {
  let response;
  let firmware: Array<string> | Uint8Array;
  log.info(`going to get ${type} FW from : ${url}`);
  try {
    if (type === "keyscanner.bin") {
      log.info("getting keyscanner.bin");
      response = await axios.request({
        method: "GET",
        url,
        responseType: "arraybuffer",
        responseEncoding: "binary",
      });
      firmware = new Uint8Array(response.data);
    }
    if (type === "Wired_neuron.uf2") {
      log.info("getting Wired_neuron.uf2");
      response = await axios.request({
        method: "GET",
        url,
        responseType: "arraybuffer",
        responseEncoding: "binary",
      });
      firmware = response.data as Array<string>;
    }
    if (type === "Wireless_neuron.hex") {
      log.info("getting Wireless_neuron.hex");
      response = await axios.request({
        method: "GET",
        url,
        responseType: "text",
        responseEncoding: "utf8",
      });
      response = response.data.replace(/(?:\r\n|\r|\n)/g, "");
      firmware = response.split(":") as Array<string>;
      firmware.splice(0, 1);
    }
    if (type === "firmware.hex") {
      log.info("getting firmware.hex");
      response = await axios.request({
        method: "GET",
        url,
        responseType: "text",
        responseEncoding: "utf8",
      });
      response = response.data.replace(/(?:\r\n|\r|\n)/g, "");
      firmware = response.split(":") as Array<string>;
      firmware.splice(0, 1);
    }
  } catch (error) {
    log.warn("error when retrieving firmware data with Axios");
    log.error(error);
    throw new Error(error);
  }
  log.info("Got FW length: ", firmware.length);
  return firmware;
};

const obtainLocalFWFiles = (customFWPath: string) => {
  const fromHexString = (hexString: any) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)));

  let result;
  if (customFWPath.includes(".hex")) {
    let fileData = fs.readFileSync(customFWPath, { encoding: "utf8" });
    fileData = fileData.replace(/(?:\r\n|\r|\n)/g, "");
    const lines = fileData.split(":");
    lines.splice(0, 1);
    result = lines;
  }
  if (customFWPath.includes(".bin")) {
    const filedata = fs.readFileSync(customFWPath, { encoding: "hex" });
    result = fromHexString(filedata);
  }
  if (customFWPath.includes(".uf2")) {
    result = fs.readFileSync(customFWPath, { encoding: "binary" });
  }
  return result;
};

export const downloadFirmware = async (
  typeSelected: string,
  info: { product: string; keyboardType: string },
  firmwareList: ReleaseType[],
  selectedFirmware: number,
  customFirmwareFolder: string,
) => {
  let filename: Array<string>;
  let filenameSides: Uint8Array;
  log.info("Data to download FW: ", typeSelected, info, firmwareList, selectedFirmware);
  try {
    if (info.product === "Raise") {
      filename =
        typeSelected === "default"
          ? ((await obtainFWFiles(
              "firmware.hex",
              firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "firmware.hex").url,
            )) as Array<string>)
          : (obtainLocalFWFiles(path.join(customFirmwareFolder, "firmware.hex")) as Array<string>);
    } else {
      if (info.keyboardType === "wireless" || info.product === "Raise2") {
        filename =
          typeSelected === "default"
            ? ((await obtainFWFiles(
                "Wireless_neuron.hex",
                firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "Wireless_neuron.hex").url,
              )) as Array<string>)
            : (obtainLocalFWFiles(path.join(customFirmwareFolder, "Wireless_neuron.hex")) as Array<string>);
      } else {
        filename =
          typeSelected === "default"
            ? ((await obtainFWFiles(
                "Wired_neuron.uf2",
                firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "Wired_neuron.uf2").url,
              )) as Array<string>)
            : (obtainLocalFWFiles(path.join(customFirmwareFolder, "Wired_neuron.uf2")) as Array<string>);
      }
      filenameSides =
        typeSelected === "default"
          ? ((await obtainFWFiles(
              "keyscanner.bin",
              firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "keyscanner.bin").url,
            )) as Uint8Array)
          : new Uint8Array(obtainLocalFWFiles(path.join(customFirmwareFolder, "keyscanner.bin")) as any);
    }
  } catch (error) {
    log.warn("error when asking for FW files");
    log.error(error);
    throw new Error(error);
  }
  log.info(`obtained FW's lengths for Neuron: ${filename?.length} and Sides: ${filenameSides?.length}`);
  const result: { fw: Array<string>; fwSides: Uint8Array } = { fw: filename, fwSides: filenameSides };

  return result;
};
