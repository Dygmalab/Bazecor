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

import React from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@Renderer/components/ui/card";

import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { useDevice } from "@Renderer/DeviceContext";
import { i18n } from "@Renderer/i18n";

import { PageHeader } from "@Renderer/modules/PageHeader";
import Title from "@Renderer/component/Title";
import ToastMessage from "@Renderer/component/ToastMessage";
import { RegularButton } from "@Renderer/component/Button";
import { IconKeyboard, IconFloppyDisk } from "@Renderer/component/Icon";
import { DygmaDeviceType } from "@Renderer/types/devices";

const Styles = Styled.div`
height: inherit;
.main-container {
  overflow: hidden;
  height: 100vh;
}
.welcome {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  &.center-content {
    height: 100vh;
  }
}
.welcomeInner {
    max-width: 960px;
    width: 100%;
    margin: auto;
}
.disclaimerContent {
  font-size: 15px;
  margin-top: 32px;
  line-height: 1.5em;
  font-weight: 500;
}
.card {
    padding: 0;

}
.card-header {
    padding: 24px 32px;
    background-color: transparent;
}
.card-body {
    padding: 24px 32px;
    font-size: 14px;
    font-weight: 401;
    border-radius: 16px;
    h3 {
        margin-bottom: 16px;
    }
    ul {
        margin: 0;
    }
    a {
        color: ${({ theme }) => theme.styles.dropdown.dropdownMenu.linkColor};
    }
}
.card-footer {
    padding: 24px 32px;
    border: none;
    background-color: ${({ theme }) => theme.styles.standardView.footerBackground};
}
.firmwareButton {
    display: flex;
    justify-content: flex-end;
    grid-gap: 8px;
}

.keyboardSelected {
    display: flex;
    grid-gap: 16px;
    align-items: center;
    justify-content: space-between;
    h6 {
        opacity: 0.6;
        margin: 0;
    }
}
`;

interface WelcomeProps {
  onConnect: (currentDevice: unknown, file: null) => void;
  device: DygmaDeviceType;
}

function Welcome(props: WelcomeProps) {
  const navigate = useNavigate();
  const [state] = useDevice();
  const { onConnect, device } = props;

  const reconnect = async () => {
    try {
      if (state.currentDevice) {
        await onConnect(state.currentDevice, null);
      }
    } catch (err) {
      toast.error(<ToastMessage title={i18n.errors.preferenceFailOnSave} content={err.toString()} icon={<IconFloppyDisk />} />, {
        icon: "",
      });
    }
  };

  const reconnectButton = state.currentDevice && (
    <RegularButton onClick={reconnect} buttonText={i18n.welcome.reconnect} styles="outline transp-bg" />
  );

  const showDeviceName = () => {
    const name = state.currentDevice?.device?.info?.displayName || device?.info?.displayName;
    return (
      <div className="content">
        <Title text={name} headingLevel={4} />
        {state.currentDevice ? <Title text={state.currentDevice?.path} headingLevel={6} /> : ""}
      </div>
    );
  };

  return (
    <Styles>
      <Container fluid className="welcome center-content">
        <PageHeader text={i18n.welcome.title} />
        <div className="welcomeWrapper">
          <div className="welcomeInner">
            <Card className="welcomeCard">
              <CardHeader>
                <CardTitle className="keyboardSelected">
                  {showDeviceName()}
                  <div className="icon">
                    <IconKeyboard />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Title type="warning" text={i18n.welcome.bootloaderTitle} headingLevel={3} />
                  <p>{i18n.welcome.description}</p>

                  <span className="cardsub">
                    <ul style={{ lineHeight: "2rem" }}>
                      <li>This process will revert your keyboard&apos;s configuration back to factory settings.</li>
                      <li>
                        {"Before proceeding, we recommend that you "}
                        <a href="https://support.dygma.com/hc/en-us/articles/360014262298">export and save your layers</a>.
                      </li>
                      <li>To exit Bootloader Mode, unplug and replug the USB-C cable to your Neuron.</li>
                    </ul>
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="firmwareButton">
                  {reconnectButton}
                  <RegularButton
                    buttonText={i18n.welcome.gotoUpdate}
                    styles="primary"
                    onClick={async () => {
                      navigate("/firmware-update");
                    }}
                  />
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Container>
    </Styles>
  );
}

export default Welcome;
