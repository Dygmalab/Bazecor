import { Octokit } from "@octokit/core";
import axios from "axios";
import SemVer from "semver";
import log from "electron-log/renderer";
import { ReleaseType } from "@Renderer/types/releases";

import * as Context from "./context";

const FWMAJORVERSION = "1.x";

export const FocusAPIRead = async (context: Context.ContextType): Promise<Context.ContextType> => {
  const data = { ...context };
  try {
    if (context.deviceState === undefined) return data;
    const { currentDevice } = context.deviceState;
    data.device.bootloader = currentDevice.device?.bootloader !== undefined ? currentDevice.device.bootloader : false;
    data.device.info = currentDevice.device.info;
    if (data.device.bootloader) return data;
    log.info("CHECKING CONTEXT DEPENDENCIES: ", context.deviceState);
    const versionData = await currentDevice.noCacheCommand("version");
    // eslint-disable-next-line prefer-destructuring
    data.device.version = versionData.split(" ")[0];
    data.device.chipID = (await currentDevice.noCacheCommand("hardware.chip_id")).replace(/\s/g, "");
    if (Object.keys(data).length === 0 || Object.keys(data.device.info).length === 0) throw new Error("data is empty!");
  } catch (error) {
    log.warn("error when querying the device");
    log.error(error);
    throw new Error(error);
  }
  return data;
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
        (context.device.info.product === "Defy"
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
    isUpdated = context.device.version === finalReleases[0].version;
    isBeta = context.device.version.includes("beta");
  } catch (error) {
    log.warn("error when filtering data from GitHub");
    log.error(error);
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
  let firmware;
  try {
    if (type === "keyscanner.bin") {
      response = await axios.request({
        method: "GET",
        url,
        responseType: "arraybuffer",
        responseEncoding: "binary",
      });
      firmware = new Uint8Array(response.data);
    }
    if (type === "Wired_neuron.uf2") {
      response = await axios.request({
        method: "GET",
        url,
        responseType: "arraybuffer",
        responseEncoding: "binary",
      });
      firmware = response.data;
    }
    if (type === "Wireless_neuron.hex") {
      response = await axios.request({
        method: "GET",
        url,
        responseType: "text",
        responseEncoding: "utf8",
      });
      response = response.data.replace(/(?:\r\n|\r|\n)/g, "");
      firmware = response.split(":");
      firmware.splice(0, 1);
    }
    if (type === "firmware.hex") {
      response = await axios.request({
        method: "GET",
        url,
        responseType: "text",
        responseEncoding: "utf8",
      });
      response = response.data.replace(/(?:\r\n|\r|\n)/g, "");
      firmware = response.split(":");
      firmware.splice(0, 1);
    }
  } catch (error) {
    log.warn("error when retrieving firmware data with Axios");
    log.error(error);
    throw new Error(error);
  }
  // log.info(firmware);
  return firmware;
};

export const downloadFirmware = async (
  typeSelected: string,
  info: { product: string; keyboardType: string },
  firmwareList: ReleaseType[],
  selectedFirmware: number,
): Promise<{ fw: any; fwSides: any }> => {
  let filename;
  let filenameSides;
  log.info(typeSelected, info, firmwareList, selectedFirmware);
  try {
    if (typeSelected === "default") {
      if (info.product === "Raise") {
        filename = await obtainFWFiles(
          "firmware.hex",
          firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "firmware.hex").url,
        );
      } else {
        if (info.keyboardType === "wireless") {
          filename = await obtainFWFiles(
            "Wireless_neuron.hex",
            firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "Wireless_neuron.hex").url,
          );
        } else {
          filename = await obtainFWFiles(
            "Wired_neuron.uf2",
            firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "Wired_neuron.uf2").url,
          );
        }
        filenameSides = await obtainFWFiles(
          "keyscanner.bin",
          firmwareList[selectedFirmware].assets.find((asset: { name: string }) => asset.name === "keyscanner.bin").url,
        );
      }
    }
  } catch (error) {
    log.warn("error when asking for FW files");
    log.error(error);
    throw new Error(error);
  }
  console.log("obtained FW's:", { fw: filename, fwSides: filenameSides });
  const result: { fw: any; fwSides: any } = { fw: filename, fwSides: filenameSides };

  return result;
};
