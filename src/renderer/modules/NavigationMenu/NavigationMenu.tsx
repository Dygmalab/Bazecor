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
import { Link, useLocation } from "react-router-dom";
import SemVer from "semver";
import { Octokit } from "@octokit/core";

import { Nav, Navbar, NavbarBrand } from "react-bootstrap";
import Styled from "styled-components";

import Version from "@Types/version";
import Pages from "@Types/pages";
import DygmaLogo from "@Assets/logo.svg";
import { showDevtools } from "@Renderer/devMode";
import { useDevice } from "@Renderer/DeviceContext";
import { AlertModal } from "@Renderer/component/Modal";
import { BatteryStatus } from "../Battery";
import i18n from "../../i18n";
import { NavigationButton } from "../../component/Button";

import {
  IconKeyboardSelector,
  IconKeyboard2Stroke,
  IconMemory2Stroke,
  IconRobot2Stroke,
  IconThunder2Stroke,
  IconPreferences2Stroke,
  IconBazecordevtools,
  IconWireless,
} from "../../component/Icon";

const Styles = Styled.div`
.disabled {
  pointer-events: none;
}
.brand-image {
  margin: 20px 0 32px 0;
  padding: 0 !important;
  display: block;
  width: 100%;
  text-align: center;
  -webkit-app-region: drag;
  img {
    display: block;
    margin: 0 auto;
    width: 42px;
    aspect-ratio: 1;
  }
}
.left-navbar {
  width: var(--sidebarWidth);
  height: 100%;
  position: fixed !important;
  z-index: 1100;
  padding: 12px !important;
  background-color: ${({ theme }) => theme.styles.navbar.background};
  display: flex;
  flex-direction: column;
  .navbar-nav {
    flex-wrap: wrap;
    height: inherit;
    .bottomMenu {
      margin-top: auto;
    }
    .topMenu,
    .bottomMenu {
      width: 100%;
    }
  }
}
.list-link {
  display: flex;
  &:hover {
    text-decoration: none;
  }
}
.list-link+.list-link {
  margin-top: 8px;
}
.select {
  background-color: ${({ theme }) => theme.card.backgroundActive};
  border-radius: 8px;
  width: 100%;
}
`;

interface NavigationMenuProps {
  connected: boolean;
  flashing: boolean;
  fwUpdate: boolean;
  allowBeta: boolean;
  loading: boolean;
  isSending: boolean;
  setIsSending: () => void;
  pages: Pages;
}

interface Device {
  vendor: any;
  product: any;
  keyboardType: string;
  displayName: string;
  urls: any;
}

function NavigationMenu(props: NavigationMenuProps) {
  const [state] = useDevice();
  const [versions, setVersions] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [device, setDevice] = useState<Record<string, Device>>({});
  const [virtual, setVirtual] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  const { connected, pages, fwUpdate, flashing, allowBeta, loading, setIsSending, isSending } = props;

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
      // console.log("data retrieved: ", finalReleases);
      return finalReleases;
    },
    [allowBeta],
  );

  const checkKeyboardMetadata = useCallback(async () => {
    const { currentDevice } = state;
    setDevice(currentDevice.device);
    if (currentDevice.device === undefined || currentDevice.device.bootloader) return;
    let parts = await currentDevice.command("version");
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
      fwList = await getGitHubFW(currentDevice.device.info.product);
    } catch (error) {
      console.log("Error when fetching GitHub data");
      console.warn(error);
      fwList = [{ version: cleanedVersion }];
    }
    // Comparing online Data to FW version
    const semVerCheck = SemVer.compare(fwList[0].version, cleanedVersion);
    Beta = Beta || currentDevice.device.info.product !== "Raise";
    setVersions(getVersions);
    setIsUpdated(semVerCheck > 0);
    setIsBeta(Beta);
    setVirtual(currentDevice.file);
    setIsSending(false);
  }, [getGitHubFW, setIsSending, state]);

  useEffect(() => {
    if (!flashing && connected) {
      checkKeyboardMetadata();
    }
  }, [flashing, connected, checkKeyboardMetadata]);

  const [showAlertModal, setShowAlertModal] = useState(false);

  function linkHandler(event: React.MouseEvent<HTMLElement>) {
    if (inContext) {
      event.preventDefault();
      setShowAlertModal(true);
      // alert("you have pending changes! save or discard them before leaving.");
    }
  }
  return (
    <Styles>
      <Navbar
        className={`left-navbar sidebar ${
          connected && device && device.info && device.info.keyboardType === "wireless" && versions !== null
            ? "isWireless"
            : "wired"
        }`}
        sticky="top"
      >
        <NavbarBrand as={Link} onClick={linkHandler} to="/" className="brand-image d-lg-block">
          <img alt="" src={DygmaLogo} className="d-inline-block align-top" />
        </NavbarBrand>
        <Nav>
          <div className="topMenu">
            {connected && (
              <>
                {pages.keymap && (
                  <>
                    <Link to="/editor" onClick={linkHandler} className={`list-link ${fwUpdate || isSending ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/editor"}
                        buttonText={i18n.app.menu.editor}
                        icoSVG={<IconKeyboard2Stroke />}
                        disabled={fwUpdate || isSending}
                      />
                    </Link>
                    <Link to="/macros" onClick={linkHandler} className={`list-link ${fwUpdate || isSending ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/macros"}
                        buttonText={i18n.app.menu.macros}
                        icoSVG={<IconRobot2Stroke />}
                        disabled={fwUpdate || isSending}
                      />
                    </Link>
                    <Link
                      to="/superkeys"
                      onClick={linkHandler}
                      className={`list-link ${fwUpdate || !isBeta || isSending ? "disabled" : ""}`}
                    >
                      <NavigationButton
                        selected={currentPage === "/superkeys"}
                        buttonText={i18n.app.menu.superkeys}
                        icoSVG={<IconThunder2Stroke />}
                        showNotif={isBeta}
                        notifText="BETA"
                        disabled={fwUpdate || !isBeta || isSending}
                      />
                    </Link>
                  </>
                )}
                <Link
                  to="/firmware-update"
                  onClick={linkHandler}
                  className={`list-link ${
                    fwUpdate || virtual || state.currentDevice.type === "hid" || isSending ? "disabled" : ""
                  }`}
                >
                  <NavigationButton
                    selected={currentPage === "/firmware-update"}
                    showNotif={isUpdated}
                    buttonText={i18n.app.menu.firmwareUpdate}
                    icoSVG={<IconMemory2Stroke />}
                    disabled={fwUpdate || virtual || state.currentDevice.type === "hid" || isSending}
                  />
                </Link>
              </>
            )}
            <Link to="/keyboard-select" onClick={linkHandler} className={`list-link ${fwUpdate || isSending ? "disabled" : ""}`}>
              <NavigationButton
                selected={currentPage === "/keyboard-select"}
                buttonText={i18n.app.menu.selectAKeyboard}
                icoSVG={<IconKeyboardSelector />}
                disabled={fwUpdate || isSending}
              />
            </Link>
          </div>
          <div className="bottomMenu">
            {showDevtools && (
              <Link
                to="/bazecordevtools"
                onClick={linkHandler}
                className={`list-link ${fwUpdate || isSending ? "disabled" : ""}`}
              >
                <NavigationButton
                  selected={currentPage === "/bazecordevtools"}
                  buttonText="Dev tools"
                  icoSVG={<IconBazecordevtools width={32} height={32} strokeWidth={2} />}
                  disabled={fwUpdate || isSending}
                />
              </Link>
            )}
            <Link to="/preferences" onClick={linkHandler} className={`list-link ${fwUpdate || isSending ? "disabled" : ""}`}>
              <NavigationButton
                selected={currentPage === "/preferences"}
                buttonText={i18n.app.menu.preferences}
                icoSVG={<IconPreferences2Stroke />}
                disabled={fwUpdate || isSending}
              />
            </Link>
            {connected && device && device.info && device.info.keyboardType === "wireless" && versions !== null ? (
              <>
                <Link to="/wireless" onClick={linkHandler} className={`list-link ${fwUpdate || isSending ? "disabled" : ""}`}>
                  <NavigationButton
                    selected={currentPage === "/wireless"}
                    buttonText={i18n.app.menu.wireless}
                    icoSVG={<IconWireless width={42} height={42} strokeWidth={2} />}
                    disabled={fwUpdate || isSending}
                  />
                </Link>
                <BatteryStatus disable={fwUpdate || virtual || loading} />
              </>
            ) : (
              ""
            )}
          </div>
        </Nav>
      </Navbar>
      <AlertModal
        showModal={showAlertModal}
        setShowModal={setShowAlertModal}
        title={i18n.errors.alertUnsavedTitle}
        description={i18n.errors.alertUnsavedDescription}
      />
    </Styles>
  );
}

export default NavigationMenu;
