/* eslint-disable react/jsx-filename-extension */
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
import { Link, withRouter } from "react-router-dom";
import SemVer from "semver";
import { Octokit } from "octokit";
import Focus from "../../../api/focus";
import i18n from "../../i18n";

// Compoments
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Styled from "styled-components";

// Custom components
import { NavigationButton } from "../../component/Button";
import { IconKeyboardSelector } from "../../component/Icon";
import { IconKeyboard2Stroke } from "../../component/Icon";
import { IconMemory2Stroke } from "../../component/Icon";
import { IconRobot2Stroke } from "../../component/Icon";
import { IconThunder2Stroke } from "../../component/Icon";
import { IconPreferences2Stroke } from "../../component/Icon";

// Assets
import DygmaLogo from "../../../../static/logo.svg";
import BatteryStatus from "../BatteryStatus/BatteryStatus";

// Store loading
const Store = require("electron-store");
const store = new Store();

const drawerWidth = 64;

const Styles = Styled.div`
.disabled {
  pointer-events: none;
}
.brand-image {
  padding: 0 !important;
  margin-left: 0;
  margin-top: 20px;
  margin-bottom: 32px;
  display: block;
  width: 100%;
  text-align: center;
  -webkit-app-region: drag;
  img {
    margin: 0;
    height: ${({ theme }) => theme.drawerWidth - 16}px;
    width: ${({ theme }) => theme.drawerWidth - 16}px;
  }
}
.left-navbar {
  width: ${({ theme }) => theme.drawerWidth}px; 
  width: 120px;
  height: 100%;
  display: block !important;

  position: fixed !important;
  z-index: 1100;
  padding: 12px !important;
  background-color: ${({ theme }) => theme.styles.navbar.background};
  
  .navbar-nav {
    flex-wrap: wrap;
    height: calc(100% - 98px);
    .bottomMenu {
      margin-top: auto;
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
@media screen and (max-width: 999px) {
  .left-navbar {
    width: 90px;
  }
}
@media screen and (max-height: 719px) {
  .left-navbar {
    width: 90px;
  }
}
`;

function NavigationMenu(props) {
  const [versions, setVersions] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [device, setDevice] = useState({});
  const [virtual, setVirtual] = useState({});
  const [fwList, setFwList] = useState({});

  useEffect(() => {
    contextUpdater();
  }, []);

  useEffect(() => {
    if (props.flashing || !props.connected) return;
    contextUpdater();
  }, [props.connected, props.flashing, props.allowBeta]);

  async function contextUpdater() {
    const focus = new Focus();
    setDevice(focus.device);
    if (focus.device.bootloader) return;
    let parts = await focus.command("version");
    parts = parts.split(" ");
    let versions = {
      bazecor: parts[0],
      kaleidoscope: parts[1],
      firmware: parts[2]
    };
    let fwList = await getGitHubFW(focus.device.info.product);
    let isBeta = versions.bazecor.includes("beta");
    let cleanedVersion = versions.bazecor;
    if (isBeta) cleanedVersion = versions.bazecor.replace("beta", "");
    let isUpdated = SemVer.compare(fwList[0].version, cleanedVersion);
    isBeta = isBeta || focus.device.info.product !== "Raise";
    setVersions(versions);
    setIsUpdated(isUpdated);
    setIsBeta(isBeta);
    setVirtual(focus.file);
    setFwList(fwList);
  }

  const getGitHubFW = async product => {
    let Releases = [];
    const octokit = new Octokit();
    let data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
      owner: "Dygmalab",
      repo: "Firmware-releases",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    data.data.forEach(release => {
      const releaseData = release.name.split(" ");
      const newRelease = { name: releaseData[0], version: releaseData[1] };
      if (!releaseData[1].includes("beta") || props.allowBeta) Releases.push(newRelease);
    });
    let finalReleases = Releases.filter(release => release.name === product);
    finalReleases.sort((a, b) => {
      return SemVer.lt(SemVer.clean(a.version), SemVer.clean(b.version)) ? 1 : -1;
    });
    // console.log("data retrieved: ", finalReleases);
    return finalReleases;
  };

  const { connected, pages, history, fwUpdate } = props;
  const currentPage = history.location.pathname;

  // console.log("new checker for navigation", fwList, versions, isUpdated, isBeta);

  return (
    <Styles>
      <Navbar className={`left-navbar sidebar`} sticky="top">
        <NavbarBrand as={Link} to="/" className="brand-image d-lg-block">
          <img alt="" src={DygmaLogo} className="d-inline-block align-top" />
        </NavbarBrand>
        <Nav>
          <div className="topMenu">
            {connected && (
              <>
                {pages.keymap && (
                  <React.Fragment>
                    <Link to="/editor" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/editor"}
                        drawerWidth={drawerWidth}
                        buttonText={i18n.app.menu.editor}
                        icoSVG={<IconKeyboard2Stroke />}
                        disabled={fwUpdate}
                      />
                    </Link>
                    <Link to="/macros" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/macros"}
                        drawerWidth={drawerWidth}
                        buttonText={i18n.app.menu.macros}
                        icoSVG={<IconRobot2Stroke />}
                        disabled={fwUpdate}
                      />
                    </Link>
                    <Link to="/superkeys" className={`list-link ${fwUpdate || !isBeta ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/superkeys"}
                        drawerWidth={drawerWidth}
                        buttonText={i18n.app.menu.superkeys}
                        icoSVG={<IconThunder2Stroke />}
                        showNotif={isBeta}
                        notifText="BETA"
                        disabled={fwUpdate || !isBeta}
                      />
                    </Link>
                  </React.Fragment>
                )}
                <Link to="/firmware-update" className={`list-link ${fwUpdate || virtual ? "disabled" : ""}`}>
                  <NavigationButton
                    selected={currentPage === "/firmware-update"}
                    drawerWidth={drawerWidth}
                    showNotif={isUpdated != 0 ? (isUpdated > 0 ? true : false) : false}
                    buttonText={i18n.app.menu.firmwareUpdate}
                    icoSVG={<IconMemory2Stroke />}
                    disabled={fwUpdate || virtual}
                  />
                </Link>
              </>
            )}
            <Link to="/keyboard-select" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
              <NavigationButton
                keyboardSelectText={connected ? i18n.app.menu.selectAnotherKeyboard : i18n.app.menu.selectAKeyboard}
                drawerWidth={drawerWidth}
                selected={currentPage === "/keyboard-select"}
                buttonText={i18n.app.menu.selectAKeyboard}
                icoSVG={<IconKeyboardSelector />}
                disabled={fwUpdate}
              />
            </Link>
          </div>
          <div className="bottomMenu">
            <Link to="/preferences" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
              <NavigationButton
                drawerWidth={drawerWidth}
                selected={currentPage === "/preferences"}
                buttonText={i18n.app.menu.preferences}
                icoSVG={<IconPreferences2Stroke />}
                disabled={fwUpdate}
              />
            </Link>
            {connected && device && device.info && device.info.keyboardType === "wireless" && versions !== null ? (
              <>
                <Link to="/wireless" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                  <NavigationButton
                    drawerWidth={drawerWidth}
                    selected={currentPage === "/wireless"}
                    buttonText={i18n.app.menu.wireless}
                    icoSVG={<IconThunder2Stroke />}
                    disabled={fwUpdate}
                  />
                </Link>
                <BatteryStatus />
              </>
            ) : (
              ""
            )}
          </div>
        </Nav>
      </Navbar>
    </Styles>
  );
}

export default withRouter(NavigationMenu);
