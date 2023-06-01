import React, { useState, useEffect } from "react";
import flashingSM from "../controller/FlashingSM";
import { useMachine } from "@xstate/react";

// Visual components
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

// Extra components
import { getStaticPath } from "../config";
import i18n from "../i18n";

// Bazecor components
import PageHeader from "../modules/PageHeader";
import FirmwareUpdatePanel from "../modules/FirmwareUpdatePanel";
import FirmwareUpdateProcess from "../modules/FirmwareUpdateProcess";

const Styles = Styled.div`
height: inherit;
.main-container {
  overflow: hidden;
  height: 100vh;
}
.firmware-update {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  &.center-content {
    height: 100vh;
  }
}
.disclaimerContent {
  font-size: 15px;
  margin-top: 32px;
  line-height: 1.5em;
  font-weight: 500;
}
`;

function AltFirmwareUpdate() {
  const [state, send] = useMachine(flashingSM, {
    actions: {
      addEscListener: () => {
        document.addEventListener("keydown", _handleKeyDown);
      },
      removeEscListener: () => {
        document.removeEventListener("keydown", _handleKeyDown);
      }
    }
  });

  const _handleKeyDown = event => {
    switch (event.keyCode) {
      case 27:
        console.log("esc key logged");
        send("ESCPRESSED");
        break;
      default:
        break;
    }
  };

  const rerunSM = () => {
    // cannot be done for now xDD
    console.log("nono, not willing xD", `state right now in: ${state.context.stateblock}`);
  };

  const { context } = state;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (context?.device?.version && context?.firmwareList[0] && context?.selectefirmware >= 0) {
      setLoading(false);
    }
  }, [context]);

  return (
    <Styles>
      <Container fluid className={`firmware-update`}>
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div>
          {loading && context.stateblock < 2 ? (
            "loading"
          ) : (
            <FirmwareUpdatePanel
              content={context}
              device={context.device}
              currentlyVersionRunning={context.device.version}
              latestVersionAvailable={context.firmwareList[0].version}
              firmwareList={context.firmwareList}
              firmwareFilename={null}
              disclaimerCard={0}
              selectedFirmware={context.selectefirmware}
              send={send}
            />
          )}

          <Button onClick={rerunSM}>rerunSM</Button>
          <Button onClick={() => send("CHECK")}>Check Defy Sides</Button>
          <Button onClick={() => send("SKIP")}>Skip if raise</Button>
          <Button onClick={() => send("RETRY")}>Retry when error</Button>
          <Button onClick={() => send("NEXT")}>Next state</Button>
          <Card>{JSON.stringify(context)}</Card>
          <Dropdown
            onSelect={value => send("CHANGEFW", { selected: parseInt(value) })}
            value={context.selectedFw}
            className={`custom-dropdown`}
          >
            <div>
              <Dropdown.Toggle id="dropdown-custom">
                <div className="dropdownItemSelected">
                  <div className="dropdownItem">{context.firmwareList[context.selectedFw]}</div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {context.firmwareList.map((item, index) => (
                  <Dropdown.Item
                    eventKey={index}
                    key={index}
                    className={`${context.selectedFw == item.name ? "active" : ""}`}
                    disabled={item.disabled}
                  >
                    <div className="dropdownInner">
                      {context.selectedFw != undefined &&
                      context.selectedFw != "" > 0 &&
                      context.firmwareList &&
                      context.firmwareList.length > 0 &&
                      context.firmwareList[0].icon != undefined ? (
                        <div className="dropdownIcon">
                          <img src={item.icon} className="dropdwonIcon" />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="dropdownItem">
                        {item.name}-{item.version}
                      </div>
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </div>
          </Dropdown>
        </div>
      </Container>
    </Styles>
  );
}

export default AltFirmwareUpdate;
