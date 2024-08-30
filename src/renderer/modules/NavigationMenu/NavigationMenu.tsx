/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import log from "electron-log/renderer";
import { Octokit } from "@octokit/core";
import SemVer from "semver";

import DygmaLogo from "@Assets/logo.svg";
import { showDevtools } from "@Renderer/devMode";
import { useDevice } from "@Renderer/DeviceContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Renderer/components/atoms/AlertDialog";
import { BatteryStatus } from "@Renderer/modules/Battery";
import NavigationButton from "@Renderer/components/molecules/CustomButton/NavigationButton";
import { i18n } from "@Renderer/i18n";

// Types
import Version from "@Types/version";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { NavigationMenuProps } from "@Renderer/types/navigation";

import {
  IconKeyboard2Stroke,
  IconMemory,
  IconRobot,
  IconThunder,
  IconPreferences,
  IconBazecordevtools,
  IconHome,
} from "@Renderer/components/atoms/icons";

function NavigationMenu(props: NavigationMenuProps) {
  const { state } = useDevice();

  const [checkedVer, setCheckedVer] = useState(false);
  const [versions, setVersions] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [device, setDevice] = useState<Record<string, DygmaDeviceType>>({});
  const [virtual, setVirtual] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  const { connected, pages, fwUpdate, flashing, allowBeta, modified, loading } = props;

  const getGitHubFW = useCallback(
    async (product: any) => {
      const releases: any[] = [];
      const octokit = new Octokit();
      const data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
        owner: "Dygmalab",
        repo: "Firmware-release",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      data.data.forEach(release => {
        const releaseData = release.name.split(" ");
        const newRelease = { name: releaseData[0], version: releaseData[1] };
        if (!releaseData[1].includes("beta") || allowBeta) releases.push(newRelease);
      });
      const finalReleases = releases.filter(release => release.name === product);
      finalReleases.sort((a, b) => (SemVer.lt(SemVer.clean(a.version), SemVer.clean(b.version)) ? 1 : -1));
      // log.info("data retrieved: ", finalReleases);
      return finalReleases;
    },
    [allowBeta],
  );

  const checkKeyboardMetadata = useCallback(async () => {
    setIsUpdated(true);
    setDevice(state.currentDevice?.device);
    if (state.currentDevice?.device === undefined || state.currentDevice?.device.bootloader) return;
    let parts = await state.currentDevice?.command("version");
    parts = parts.split(" ");
    const getVersions: Version = {
      bazecor: parts[0],
      kaleidoscope: parts[1],
      firmware: parts[2],
    };
    let Beta = getVersions.bazecor.includes("beta");
    let cleanedVersion = getVersions.bazecor;
    if (Beta && !getVersions.bazecor.includes("-beta")) cleanedVersion = getVersions.bazecor.replace("beta", "");
    // Getting GitHub Data
    let fwList = [];
    try {
      fwList = await getGitHubFW(state.currentDevice?.device.info.product);
    } catch (error) {
      log.info("Error when fetching GitHub data");
      log.warn(error);
      fwList = [{ version: cleanedVersion }];
    }
    // Comparing online Data to FW version
    const semVerCheck = fwList.length > 0 ? SemVer.compare(fwList[0].version, cleanedVersion) : 0;
    Beta = Beta || state.currentDevice?.device.info.product !== "Raise";
    setVersions(getVersions);
    setIsUpdated(semVerCheck !== 1);
    setIsBeta(Beta);
    setVirtual(state.currentDevice?.file);
    setCheckedVer(true);
  }, [getGitHubFW, state.currentDevice]);

  useEffect(() => {
    if (!flashing && connected && !loading && !checkedVer) {
      checkKeyboardMetadata();
    }
  }, [flashing, connected, loading, checkKeyboardMetadata, checkedVer]);

  useEffect(() => {
    if (checkedVer && !connected) {
      setCheckedVer(false);
    }
  }, [checkedVer, connected]);

  const [showAlertModal, setShowAlertModal] = useState(false);

  function linkHandler(event: React.MouseEvent<HTMLElement>) {
    if (modified) {
      event.preventDefault();
      setShowAlertModal(true);
      // alert("you have pending changes! save or discard them before leaving.");
    }
  }
  const linkVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div>
      <div
        className={`navbar navbar-expand navbar-light sticky-top left-navbar bg-gray-25 dark:bg-[#0B0219] sidebar fixed top-0 h-full flex flex-col p-[12px] justify-start items-center transition-all z-[49] ${
          connected &&
          device &&
          state.currentDevice?.device.info &&
          (state.currentDevice?.device.info.keyboardType === "wireless" || state.currentDevice?.device.wireless) &&
          versions !== null
            ? "isWireless"
            : "wired"
        }`}
      >
        <div className="brand-image block mt-5 mb-8 mx-0 w-full text-center">
          <img alt="Dygma - Bazecor" src={DygmaLogo} className="block mx-auto my-0 w-10 aspect-square align-top" />
        </div>
        <div className="navbar-nav flex flex-wrap h-[inherit] justify-between">
          <div className="topMenu w-full flex flex-col gap-0.5">
            <AnimatePresence mode="popLayout">
              {connected && pages.keymap && (
                <motion.div initial={linkVariants.hidden} animate={linkVariants.visible} exit={linkVariants.hidden}>
                  <Link
                    to="/editor"
                    onClick={linkHandler}
                    className={`list-link flex hover:no-underline ${fwUpdate || loading ? "disabled pointer-events-none" : ""}`}
                  >
                    <NavigationButton
                      selected={currentPage === "/editor"}
                      buttonText={i18n.app.menu.editor}
                      icoSVG={<IconKeyboard2Stroke />}
                      disabled={fwUpdate || loading}
                    />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {connected && pages.keymap && (
                <motion.div initial={linkVariants.hidden} animate={linkVariants.visible} exit={linkVariants.hidden}>
                  <Link
                    to="/macros"
                    onClick={linkHandler}
                    className={`list-link flex hover:no-underline ${fwUpdate || loading ? "disabled pointer-events-none" : ""}`}
                  >
                    <NavigationButton
                      selected={currentPage === "/macros"}
                      buttonText={i18n.app.menu.macros}
                      icoSVG={<IconRobot size="lg" />}
                      disabled={fwUpdate || loading}
                    />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {connected && pages.keymap && (
                <motion.div initial={linkVariants.hidden} animate={linkVariants.visible} exit={linkVariants.hidden}>
                  <Link
                    to="/superkeys"
                    onClick={linkHandler}
                    className={`list-link flex hover:no-underline ${fwUpdate || !isBeta || loading ? "disabled pointer-events-none" : ""}`}
                  >
                    <NavigationButton
                      selected={currentPage === "/superkeys"}
                      buttonText={i18n.app.menu.superkeys}
                      icoSVG={<IconThunder size="lg" />}
                      showNotif={isBeta}
                      notifText="BETA"
                      disabled={fwUpdate || !isBeta || loading}
                    />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {connected && (
                <motion.div initial={linkVariants.hidden} animate={linkVariants.visible} exit={linkVariants.hidden}>
                  <Link
                    to="/firmware-update"
                    onClick={linkHandler}
                    className={`list-link flex hover:no-underline ${fwUpdate || virtual || loading ? "disabled pointer-events-none" : ""}`}
                  >
                    <NavigationButton
                      selected={currentPage === "/firmware-update"}
                      showNotif={!isUpdated}
                      buttonText={i18n.app.menu.firmwareUpdate}
                      icoSVG={<IconMemory />}
                      disabled={fwUpdate || virtual || loading}
                    />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <Link
              to="/device-manager"
              onClick={linkHandler}
              className={`list-link flex hover:no-underline ${loading ? "disabled pointer-events-none" : ""}`}
            >
              <NavigationButton
                selected={currentPage === "/device-manager"}
                showNotif={false}
                buttonText={i18n.deviceManager.title}
                icoSVG={<IconHome />}
                disabled={false}
              />
            </Link>
          </div>
          <div className="bottomMenu w-full flex flex-col mt-auto">
            {showDevtools && (
              <Link
                to="/bazecordevtools"
                onClick={linkHandler}
                className={`list-link flex hover:no-underline ${fwUpdate || loading ? "disabled pointer-events-none" : ""}`}
              >
                <NavigationButton
                  selected={currentPage === "/bazecordevtools"}
                  buttonText="Dev tools"
                  icoSVG={<IconBazecordevtools width={32} height={32} strokeWidth={2} />}
                  disabled={fwUpdate || loading}
                />
              </Link>
            )}
            <Link
              to="/preferences"
              onClick={linkHandler}
              className={`list-link flex hover:no-underline ${fwUpdate || loading ? "disabled pointer-events-none" : ""}`}
            >
              <NavigationButton
                selected={currentPage === "/preferences"}
                buttonText={i18n.app.menu.preferences}
                icoSVG={<IconPreferences size="lg" />}
                disabled={fwUpdate || loading}
              />
            </Link>
            {connected &&
            state.currentDevice &&
            state.currentDevice?.device.info &&
            state.currentDevice?.device.info.product !== "Raise" &&
            (state.currentDevice?.device.info.keyboardType === "wireless" || state.currentDevice?.device.wireless) &&
            versions !== null ? (
              <>
                {/* <Link to="/wireless" onClick={linkHandler} className={`list-link flex hover:no-underline${fwUpdate || loading ? "disabled" : ""}`}>
                  <NavigationButton
                    selected={currentPage === "/wireless"}
                    buttonText={i18n.app.menu.wireless}
                    icoSVG={<IconWireless width={42} height={42} strokeWidth={2} />}
                    disabled={fwUpdate || loading}
                  />
                </Link> */}
                <BatteryStatus disable={fwUpdate || virtual || loading} />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <AlertDialog open={showAlertModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{i18n.errors.alertUnsavedTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              <p>{i18n.errors.alertUnsavedDescription1}</p>
              <p>{i18n.errors.alertUnsavedDescription2}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="">
            <AlertDialogAction onClick={() => setShowAlertModal(false)} buttonVariant="secondary">
              Go back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default NavigationMenu;
