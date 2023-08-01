import React from "react";

import Styled from "styled-components";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import Keymap, { KeymapDB } from "../../../api/keymap";

// component
import { RegularButton } from "@Renderer/component/Button";
import KeyVisualizer from "@Renderer/modules/KeyVisualizer";
import CustomTab from "@Renderer/component/Tab";
import KeysTab from "@Renderer/modules/KeysTabs/KeysTab";
import NoKeyTransparentTab from "@Renderer/modules/KeysTabs/NoKeyTransparentTab";
import LayersTab from "@Renderer/modules/KeysTabs/LayersTab";
import MacroTab from "@Renderer/modules/KeysTabs/MacroTab";
import SuperkeysTab from "@Renderer/modules/KeysTabs/SuperkeysTab";
import MediaAndLightTab from "@Renderer/modules/KeysTabs/MediaAndLightTab";
import OneShotTab from "@Renderer/modules/KeysTabs/OneShotTab";
import MouseTab from "@Renderer/modules/KeysTabs/MouseTab";
import WirelessTab from "@Renderer/modules/KeysTabs/WirelessTab";

import i18n from "@Renderer/i18n";

// Icons
import {
  IconKeyboard,
  IconNoKey,
  IconMouse,
  IconLayers,
  IconRobot,
  IconNote,
  IconOneShot,
  IconThunder,
  IconWirelessMd,
} from "@Renderer/component/Icon";

const Styles = Styled.div`
.standardView {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.styles.standardView.modalBackground};
    z-index: 500;
    padding: 32px 32px 32px 164px;
    .standardViewInner {
        width: 100%;
        height: 100%;
        display: grid;
        grid-gap: 14px;
        grid-template-columns: minmax(200px, 220px) 1fr;
    }
}
.colContentTabs {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: ${({ theme }) => theme.styles.standardView.contentBackground};
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    .contentBody {
        flex-grow: 1;
        margin-bottom: auto;
        padding: 48px 82px 32px 82px;
        padding-bottom: 102px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .contentFooter {
      position: absolute;
      bottom: 0;
        width: 100%;
        padding: 16px 24px;
        margin-top: auto;
        border-radius: 6px;
        background-color: ${({ theme }) => theme.styles.standardView.footerBackground};
        backdrop-filter: blur(6px);
        .button + .button {
            margin-left: 12px;
        }
    }
}
.KeyVisualizer {
  margin-top: 42px;
  margin-bottom: 24px;
  width: calc(100% + 20px);
  background: ${({ theme }) => theme.styles.standardView.keyVisualizer.background};
  border: ${({ theme }) => theme.styles.standardView.keyVisualizer.border};
  box-shadow: ${({ theme }) => theme.styles.standardView.keyVisualizer.boxShadow};
  border-radius: 6px;
  min-height: 262px;
  position: relative;
  z-index: 2;
}
.tabsWrapper.nav {
  position: relative;
  z-index: 2;
}

.standardViewTab {
    width: 100%;
    h3 {
        margin-bottom: 16px;
        color: ${({ theme }) => theme.styles.standardView.titleColor};
    }
    h4 {
        flex: 0 0 100%;
        width: 100%;
        margin-top: 24px;
    }
    .superkeyHint h3 {
      color: ${({ theme }) => theme.styles.standardView.superkeys.info.titleColor};
    }
    .description {
        font-size: 14px;
        color: ${({ theme }) => theme.styles.macro.descriptionColor};
        font-weight: 500;
    }
    .tabContentWrapper {
        width: 100%;
    }
    .callOut {
        margin-bottom: 16px;
    }
    .reduceMargin .callOut {
        margin-bottom: 2px;
    }
    .cardButtons {
        h4 {
            margin-top: 0;
            font-size: 14px;
        }
    }
}

@media screen and (max-height: 782px) {
    .standardView {
        padding: 16px 24px 24px 148px;
        h3 {
            font-size: 18px;
            .counterIndicator:before {
                left: -32px;
            }
        }
        .KeyVisualizer {
          margin-top: 24px;
          padding-left: 24px;
      }
    }
    .colContentTabs .contentBody {
        padding: 24px 62px 24px 62px;
        padding-bottom: 102px;
    }
}

@media (max-width: 1460px) and (min-height: 783px) {
  .standardView{
    padding: 24px 24px 24px 142px;
    .KeyVisualizer {
      margin-top: 16px;
    }
    .colContentTabs .contentBody {
      padding: 32px 32px 32px 42px;
      padding-bottom: 102px;
    }
    .counterIndicator:before {
      left: -24px;
      bottom: 3px;
      font-size: 12px;
    }
  }
}
@media (max-width: 1360px) {
  .dualFuntionWrapper {
    grid-gap: 16px;
  }
}

@media screen and (max-height: 790px) {
  .standardView{
    .KeyVisualizer {
      margin-top: 16px;
      padding-left: 24px;
      padding: 6px 12px 12px 24px;
      margin-bottom: 8px;
      min-height: 240px;
    }
  }
}
@media screen and (max-height: 719px) {
  .standardView{
    padding: 24px 24px 24px 112px;
    .KeyVisualizer {
      margin-top: 16px;
    }
    .colVisualizerTabs .nav-link {
      padding: 10px 14px;
    }
  }
}

@media screen and (max-height: 710px) {
  .standardView {
    overflow-y: auto;
    .colContentTabs {
      overflow: initial;
      .contentBody {
        padding-bottom: 24px;
        height: auto;
      }
      .contentFooter {
        position: static;
        margin-top: 0;
      }
    }
    
  }
}

`;

export default class StandardView extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = React.createRef();
    this.state = {
      name: props.name,
      code: 0,
    };
    this.keymapDB = new KeymapDB();
  }

  componentDidUpdate(prevProps) {
    // console.log("StandardView componentDidUpdate", prevProps.keyIndex, this.props.keyIndex);
    // if(this.props.actTab == "editor") {

    // }
    if (prevProps.keyIndex !== this.props.keyIndex) {
      if (this.props.keyIndex !== -1) {
        if (this.props.actTab == "super") {
          this.setState({ code: this.props.layerData[this.props.keyIndex] });
        } else {
          this.setState({ code: this.props.layerData[this.props.keyIndex].keyCode });
        }
      } else {
        this.setState({ code: 0 });
      }
    }
  }

  parseKey(keycode) {
    const macro = this.props.macros[parseInt(this.keymapDB.parse(keycode).label)];
    let macroName;
    try {
      macroName = this.props.macros[parseInt(this.keymapDB.parse(keycode).label)].name.substr(0, 5);
    } catch (error) {
      macroName = "*NotFound*";
    }
    if (keycode >= 53852 && keycode <= 53852 + 128) {
      if (this.props.code !== null) return `${this.keymapDB.parse(keycode).extraLabel}.${macroName}`;
    }
    return this.props.code !== null
      ? this.keymapDB.parse(keycode).extraLabel != undefined
        ? `${this.keymapDB.parse(keycode).extraLabel}.${this.keymapDB.parse(keycode).label}`
        : this.keymapDB.parse(keycode).label
      : "";
  }

  onAddSpecial = (keycode, action) => {
    this.props.onKeySelect(keycode);
  };

  render() {
    const {
      actions,
      action,
      actTab,
      code,
      closeStandardView,
      handleSave,
      id,
      isStandardView,
      kbtype,
      keyIndex,
      layerData,
      labelInput,
      macros,
      onKeySelect,
      selectedlanguage,
      showStandardView,
      superkeys,
      isWireless,
    } = this.props;
    let keyCode;
    if (actTab == "super") {
      keyCode = keyIndex !== -1 ? layerData[keyIndex] : 0;
    } else {
      keyCode = keyIndex !== -1 ? layerData[keyIndex].keyCode : 0;
    }

    const selKey = this.parseKey(keyCode);
    const oldKey = this.parseKey(this.state.code);
    if (!showStandardView) return null;
    return (
      <Styles>
        <div className="standardView">
          <Tab.Container id="standardViewCointainer" defaultActiveKey="tabKeys">
            <div className="standardViewInner">
              <div className="colVisualizerTabs">
                <KeyVisualizer
                  keyCode={keyCode}
                  oldKeyCode={this.state.code}
                  oldValue={oldKey}
                  newValue={selKey}
                  isStandardView={isStandardView}
                  superkeyAction={`${actTab === "super" ? keyIndex : 5}`}
                />
                <Nav className="flex-column tabsWrapper">
                  <CustomTab eventKey="tabKeys" text="Keys" icon={<IconKeyboard />} />
                  <CustomTab eventKey="tabNoKeys" text={i18n.editor.standardView.noKeyTransparent} icon={<IconNoKey />} />
                  <CustomTab eventKey="tabLayers" text={i18n.editor.standardView.layers.title} icon={<IconLayers />} />
                  <CustomTab eventKey="tabMacro" text={i18n.editor.standardView.macros.title} icon={<IconRobot />} />
                  {actTab !== "super" ? (
                    <>
                      <CustomTab
                        eventKey="tabSuperKeys"
                        text={i18n.editor.standardView.superkeys.title}
                        icon={<IconThunder />}
                        notifText="BETA"
                      />
                      <CustomTab eventKey="tabOneShot" text={i18n.editor.standardView.oneShot.title} icon={<IconOneShot />} />
                    </>
                  ) : (
                    ""
                  )}
                  <CustomTab eventKey="tabMedia" text={i18n.editor.standardView.mediaAndLED.title} icon={<IconNote />} />
                  <CustomTab eventKey="tabMouse" text={i18n.editor.standardView.mouse.title} icon={<IconMouse />} />
                  {isWireless && (
                    <CustomTab eventKey="tabWireless" text={i18n.app.menu.wireless} icon={<IconWirelessMd strokeWidth={1.2} />} />
                  )}
                </Nav>
              </div>
              <div className="colContentTabs">
                <div className="contentBody">
                  <Tab.Content>
                    <Tab.Pane eventKey="tabKeys">
                      <KeysTab
                        keyCode={keyCode}
                        code={code}
                        onKeyPress={onKeySelect}
                        isStandardView={isStandardView}
                        superkeyAction={`${actTab == "super" ? keyIndex : 5}`}
                        actTab={actTab}
                        selectedlanguage={selectedlanguage}
                        kbtype={kbtype}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="tabNoKeys">
                      <NoKeyTransparentTab keyCode={keyCode} onKeySelect={onKeySelect} isStandardView={isStandardView} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="tabLayers">
                      <LayersTab
                        onLayerPress={onKeySelect}
                        keyCode={keyCode}
                        showLayerSwitch={actTab !== "super"}
                        isStandardView={isStandardView}
                        actTab={actTab}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="tabMacro">
                      <MacroTab
                        macros={macros}
                        selectedMacro={this.state.selected}
                        onMacrosPress={onKeySelect}
                        keyCode={keyCode}
                        isStandardView={isStandardView}
                      />
                    </Tab.Pane>
                    {actTab !== "super" ? (
                      <Tab.Pane eventKey="tabSuperKeys">
                        <SuperkeysTab
                          actions={actions}
                          superkeys={superkeys}
                          onKeySelect={onKeySelect}
                          macros={macros}
                          keyCode={keyCode}
                          isStandardView={isStandardView}
                        />
                      </Tab.Pane>
                    ) : (
                      ""
                    )}
                    {actTab !== "super" ? (
                      <Tab.Pane eventKey="tabOneShot">
                        <OneShotTab keyCode={keyCode} onKeySelect={onKeySelect} isStandardView={isStandardView} />
                      </Tab.Pane>
                    ) : (
                      ""
                    )}
                    <Tab.Pane eventKey="tabMedia">
                      <MediaAndLightTab onAddSpecial={this.onAddSpecial} keyCode={keyCode} isStandardView={isStandardView} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="tabMouse">
                      <MouseTab onAddSpecial={this.onAddSpecial} keyCode={keyCode} isStandardView={isStandardView} />
                    </Tab.Pane>
                    {isWireless && (
                      <Tab.Pane eventKey="tabWireless">
                        <WirelessTab keyCode={keyCode} onKeySelect={onKeySelect} isStandardView={isStandardView} />
                      </Tab.Pane>
                    )}
                  </Tab.Content>
                </div>
                <div className="contentFooter">
                  <div className="d-flex justify-content-end">
                    <RegularButton
                      onClick={() => closeStandardView(this.state.code)}
                      styles="outline transp-bg"
                      size="sm"
                      buttonText={i18n.app.cancelPending.button}
                    />
                    <RegularButton
                      onClick={handleSave}
                      styles="outline gradient"
                      size="sm"
                      buttonText={i18n.dialog.applyChanges}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab.Container>
        </div>
      </Styles>
    );
  }
}
