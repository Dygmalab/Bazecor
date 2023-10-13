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

import React, { useEffect, useState } from "react";
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
  IconHome,
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
  pages: Pages;
  fwUpdate: boolean;
  allowBeta: boolean;
}

interface Device {
  vendor: any;
  product: any;
  keyboardType: any;
  displayName: any;
  urls: any;
}

function NavigationMenu(props: NavigationMenuProps): React.JSX.Element {
  const [state, dispatch] = useDevice();
  const [versions, setVersions] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [device, setDevice] = useState<Record<string, Device>>({});
  const [virtual, setVirtual] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  const { connected, pages, fwUpdate, flashing, allowBeta } = props;

  const getGitHubFW = async (product: any) => {
    const releases: any[] = [];
    const octokit = new Octokit();
    const data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
      owner: "Dygmalab",
      repo: "Firmware-releases",
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
  };

  async function checkKeyboardMetadata() {
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
    const fwList = await getGitHubFW(currentDevice.device.info.product);
    let Beta = getVersions.bazecor.includes("beta");
    let cleanedVersion = getVersions.bazecor;
    if (Beta && !getVersions.bazecor.includes("-beta")) cleanedVersion = getVersions.bazecor.replace("beta", "");
    const semVerCheck = SemVer.compare(fwList[0].version, cleanedVersion);
    Beta = Beta || currentDevice.device.info.product !== "Raise";
    setVersions(getVersions);
    setIsUpdated(semVerCheck > 0);
    setIsBeta(Beta);
    setVirtual(currentDevice.file);
  }

  useEffect(() => {
    if (!flashing && connected) {
      checkKeyboardMetadata();
    }
  }, [flashing, connected]);

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
        <NavbarBrand as={Link} to="/" className="brand-image d-lg-block">
          <img alt="" src={DygmaLogo} className="d-inline-block align-top" />
        </NavbarBrand>
        <Nav>
          <div className="topMenu">
            {connected && (
              <>
                {pages.keymap && (
                  <>
                    <Link to="/editor" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/editor"}
                        buttonText={i18n.app.menu.editor}
                        icoSVG={<IconKeyboard2Stroke />}
                        disabled={fwUpdate}
                      />
                    </Link>
                    <Link to="/macros" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/macros"}
                        buttonText={i18n.app.menu.macros}
                        icoSVG={<IconRobot2Stroke />}
                        disabled={fwUpdate}
                      />
                    </Link>
                    <Link to="/superkeys" className={`list-link ${fwUpdate || !isBeta ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/superkeys"}
                        buttonText={i18n.app.menu.superkeys}
                        icoSVG={<IconThunder2Stroke />}
                        showNotif={isBeta}
                        notifText="BETA"
                        disabled={fwUpdate || !isBeta}
                      />
                    </Link>
                  </>
                )}
                <Link to="/firmware-update" className={`list-link ${fwUpdate || virtual ? "disabled" : ""}`}>
                  <NavigationButton
                    selected={currentPage === "/firmware-update"}
                    showNotif={isUpdated}
                    buttonText={i18n.app.menu.firmwareUpdate}
                    icoSVG={<IconMemory2Stroke />}
                    disabled={fwUpdate || virtual}
                  />
                </Link>
              </>
            )}
            <Link to="/keyboard-select" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
              <NavigationButton
                selected={currentPage === "/keyboard-select"}
                buttonText={i18n.app.menu.selectAKeyboard}
                icoSVG={<IconKeyboardSelector />}
                disabled={fwUpdate}
              />
            </Link>
          </div>
          <div className="bottomMenu">
            {showDevtools && (
              <Link to="/bazecordevtools" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                <NavigationButton
                  selected={currentPage === "/bazecordevtools"}
                  buttonText="Dev tools"
                  icoSVG={<IconBazecordevtools width={32} height={32} strokeWidth={2} />}
                  disabled={fwUpdate}
                />
              </Link>
            )}
            <Link to="/preferences" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
              <NavigationButton
                selected={currentPage === "/preferences"}
                buttonText={i18n.app.menu.preferences}
                icoSVG={<IconPreferences2Stroke />}
                disabled={fwUpdate}
              />
            </Link>
            <Link to="/device-manager" className="list-link">
              <NavigationButton
                selected={false}
                showNotif={false}
                buttonText="Device Manager"
                icoSVG={<IconHome />}
                disabled={false}
              />
            </Link>
            {connected && device && device.info && device.info.keyboardType === "wireless" && versions !== null ? (
              <>
                <Link to="/wireless" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                  <NavigationButton
                    selected={currentPage === "/wireless"}
                    buttonText={i18n.app.menu.wireless}
                    icoSVG={<IconWireless width={42} height={42} strokeWidth={2} />}
                    disabled={fwUpdate}
                  />
                </Link>
                <BatteryStatus disable={fwUpdate || virtual} />
              </>
            ) : (
              <></>
            )}
          </div>
        </Nav>
      </Navbar>
    </Styles>
  );
}

export default NavigationMenu;
