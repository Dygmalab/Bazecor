import React from "react";
import flashingSM from "../controller/FlashingSM";
import { useMachine } from "@xstate/react";

// Visual components
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";

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
  const [state, send] = useMachine(
    flashingSM
    // {
    //   actions: {
    //     addEscListener: () => {
    //       document.addEventListener("keydown", _handleKeyDown);
    //     },
    //     removeEscListener: () => {
    //       document.removeEventListener("keydown", _handleKeyDown);
    //     }
    //   }
    // }
  );

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

  return (
    <Styles>
      <Container fluid className={`firmware-update`}>
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div>
          haha
          <Card>{state}</Card>
          <Dropdown onSelect={() => console.log("clicked onselect")} value={state.selectedFw} className={`custom-dropdown`}>
            <div>
              <Dropdown.Toggle id="dropdown-custom">
                <div className="dropdownItemSelected">
                  <div className="dropdownItem">{state.firmwareList[state.selectedFw].text}</div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {state.firmwareList.map((item, index) => (
                  <Dropdown.Item
                    eventKey={item.value}
                    key={index}
                    className={`${state.selectedFw == item.text ? "active" : ""}`}
                    disabled={item.disabled}
                  >
                    <div className="dropdownInner">
                      {state.selectedFw != undefined &&
                      state.selectedFw != "" > 0 &&
                      state.firmwareList &&
                      state.firmwareList.length > 0 &&
                      state.firmwareList[0].icon != undefined ? (
                        <div className="dropdownIcon">
                          <img src={item.icon} className="dropdwonIcon" />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="dropdownItem">{item.text}</div>
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
