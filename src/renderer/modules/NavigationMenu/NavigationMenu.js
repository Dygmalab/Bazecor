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

import React, { Component, version } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import SemVer from "semver";
import { Octokit } from "octokit";
import Focus from "../../../api/focus";
import i18n from "../../i18n";

// Compoments
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Tooltip from "react-bootstrap/Tooltip";
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

class NavigationMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      versions: null,
      flashing: props.flashing,
      isUpdated: true,
      isBeta: false
    };
  }

  async componentDidMount() {
    await this.contextUpdater();
  }

  async componentDidUpdate(previousProps, previousState) {
    if (this.props.flashing != previousProps.flashing) {
      this.setState({ flashing: this.props.flashing });
    }
    if (
      this.props.allowBeta === previousProps.allowBeta &&
      this.state.versions !== null &&
      this.state.versions.bazecor.length > 0 &&
      this.state.flashing === previousState.flashing
    ) {
      return;
    }
    await this.contextUpdater();
  }

  contextUpdater = async () => {
    const focus = new Focus();
    let parts = await focus.command("version");
    parts = parts.split(" ");
    let versions = {
      bazecor: parts[0],
      kaleidoscope: parts[1],
      firmware: parts[2]
    };
    let fwList = await this.getGitHubFW(focus.device.info.product);
    let isBeta = versions.bazecor.includes("beta");
    let cleanedVersion;
    if (isBeta) cleanedVersion = versions.bazecor.replace("beta", "");
    let isUpdated = SemVer.compare(fwList[0].version, cleanedVersion);
    this.setState({
      versions: versions,
      flashing: this.props.flashing,
      virtual: focus.file,
      fwList: fwList,
      isUpdated: isUpdated,
      isBeta: isBeta
    });
  };

  getGitHubFW = async product => {
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
      if (!releaseData[1].includes("beta") || this.props.allowBeta) Releases.push(newRelease);
    });
    let finalReleases = Releases.filter(release => release.name === product);
    finalReleases.sort((a, b) => {
      return SemVer.lt(SemVer.clean(a.version), SemVer.clean(b.version)) ? 1 : -1;
    });
    // console.log("data retrieved: ", finalReleases);
    return finalReleases;
  };

  renderTooltip(text) {
    return <Tooltip id="button-tooltip">{text}</Tooltip>;
  }

  render() {
    const { connected, pages, history, fwUpdate } = this.props;
    const { isUpdated, isBeta, versions, fwList } = this.state;
    const currentPage = history.location.pathname;

    // console.log("new checker for navigation", fwList, versions, isUpdated, isBeta);

    return (
      <Styles>
        <Navbar className={`left-navbar sidebar`} sticky="top">
          <NavbarBrand as={Link} to="/" className="brand-image d-lg-block">
            <img alt="" src={DygmaLogo} className="d-inline-block align-top" />
          </NavbarBrand>
          <Nav>
            {/* <Link to="/welcome" className={`list-link ${fwUpdate ? "disabled" : ""}`}>
              <WelcomeMenu
                selected={currentPage === "/welcome"}
                userMenu={i18n.app.menu.userMenu}
                drawerWidth={drawerWidth}
                onClick={() => setCurrentPage("/welcome")}
              />
            </Link> */}
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
                  <Link to="/firmware-update" className={`list-link ${fwUpdate || this.state.virtual ? "disabled" : ""}`}>
                    <NavigationButton
                      selected={currentPage === "/firmware-update"}
                      drawerWidth={drawerWidth}
                      showNotif={isUpdated != 0 ? (isUpdated > 0 ? true : false) : false}
                      buttonText={i18n.app.menu.firmwareUpdate}
                      icoSVG={<IconMemory2Stroke />}
                      disabled={fwUpdate || this.state.virtual}
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

              {/* <OverlayTrigger
                rootClose
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={this.renderTooltip("Update Bazecor")}
              >
                <div className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                  <SoftwareUpdateMenuItem
                    keyboardSelectText={i18n.app.menu.softwareUpdate}
                    drawerWidth={drawerWidth}
                    selected={currentPage === "/software-update"}
                    onClick={event => event.stopPropagation()}
                  />
                </div>
              </OverlayTrigger> */}
              {/* <OverlayTrigger
                rootClose
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={this.renderTooltip("Exit Bazecor")}
              >
                <div className={`list-link ${fwUpdate ? "disabled" : ""}`}>
                  <ExitMenuItem
                    drawerWidth={drawerWidth}
                    onClick={() => return}
                  />
                </div>
              </OverlayTrigger> */}
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
            </div>
          </Nav>
        </Navbar>
      </Styles>
    );
  }
}
NavigationMenu.propTypes = {
  connected: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pages: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired
};

export default withRouter(NavigationMenu);
