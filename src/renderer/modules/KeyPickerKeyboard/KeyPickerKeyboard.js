import React, { Component } from "react";
import Styled from "styled-components";
import { motion } from "framer-motion";

// Internal components
// import ListModifier from "@Renderer/components/molecules/ListModifiers/ListModifiers";
import {
  IconKeysPress,
  IconKeysTapHold,
  IconKeysHold,
  IconKeys2Tap,
  IconKeys2TapHold,
  IconKeyboard,
  IconMouse,
  IconLayers,
  IconRobot,
  IconNote,
  IconThunder,
  IconSplitView,
  IconWireless,
} from "@Renderer/components/atoms/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/atoms/Tabs";
import { i18n } from "@Renderer/i18n";
import NoKeyTransparentTab from "@Renderer/modules/KeysTabs/NoKeyTransparentTab";
// eslint-disable-next-line
import LayersTab from "@Renderer/modules/KeysTabs/LayersTab";
import MacroTab from "@Renderer/modules/KeysTabs/MacroTab";
import SuperkeysTab from "@Renderer/modules/KeysTabs/SuperkeysTab";
import MediaAndLightTab from "@Renderer/modules/KeysTabs/MediaAndLightTab";
import MouseTab from "@Renderer/modules/KeysTabs/MouseTab";
import WirelessTab from "@Renderer/modules/KeysTabs/WirelessTab";
import { KeymapDB } from "../../../api/keymap";
import { Picker } from ".";

import ModPicker from "./ModPicker";
import ModifiersTab from "../KeysTabs/ModifiersTab";

// Icons

const Style = Styled.div`
width: -webkit-fill-available;
.type-card {
    min-height: 100%;
}
.select-card {
    min-height: 100%;
    padding: 0;
}
.nospacing{
    padding: 0;
    margin: 0;
}
.dropdown-menu.show {
  display: block;
  overflow-y: auto;
  height: 190px;
}
.dropdown-menu.show::-webkit-scrollbar {
  display: none;
}
.selectButton{
  .dropdown-toggle{
    text-align: left;
    margin-top: 0.375rem;
  }
}
.dropup .dropdown-toggle::after {
  border-bottom: 0;
  border-top: .3em solid;
  border-right: .3em solid transparent;
  float: right;
  border-left: .3em solid transparent;
  margin-top: 10px;
}
.rowsection {
  margin: 0;
  flex-wrap: nowrap;
}
.section {
  min-height: 100%;
  padding: 0;
}
.pickersection {
  min-height: 100%;
  padding: 0;
}
.hidden {
  visibility: hidden;
}
.menuitem {
  p {
    margin-bottom: 0;
  }
}
.overflow {
  overflow: visible;
}
.overflow::-webkit-scrollbar {
  display: none;
}
.card-title {
  margin-bottom: .3rem;
}
.card-header-tabs {
  margin: 0;
  border: 0;
}
.nav-tabs .nav-link {
  color: ${({ theme }) => theme.colors.button.text};
  background-color: ${({ theme }) => theme.colors.button.background};
  padding: .2rem 1rem;
}
.nav-tabs .nav-link.active {
  color: ${({ theme }) => theme.colors.button.text};
  background-color: ${({ theme }) => theme.card.background};
}
.ball-container {
  padding: 8px;
  width: 100%;

}
.ball-inner {
  display: flex;
  padding: 8px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.styles.standardView.superkeys.key.border};
  border-radius: 3px;
  background-color: ${({ theme }) => theme.styles.standardView.superkeys.key.background};
}
.ball-title {
  font-size: 12px;
  margin-top: 8px;
  font-weight: 600;
}
.ball{
  margin: 2px;
  text-align: center;
  padding: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: -0.03em;
  border: none;
  color: rgba(226,228,234,1);
  background: linear-gradient(90deg,rgba(255,255,255,0.1) -22.96%,rgba(255,255,255,0) 123.24%),linear-gradient(0deg,rgba(87,97,126,0.25),rgba(87,97,126,0.25)),rgba(11,2,25,0.2);
  border: none;
  border-radius: 6px;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.1);
  transition: all 300ms ease-in-out;
}
.Tabstyle {
  margin-left: 322px;
  margin-top: -31px;
  width: 280px;
  position: absolute;
  .tab-content {
    margin-top: 31px;
  }
}

.singleViewWrapper {
  .newKeyValue h4 span { display: none; }
  .modPickerButtonsList .button-config{
    font-size: 12px;
  }
  .keyBoardPickerWrapper {
    box-shadow: ${({ theme }) => theme.styles.keyboardPicker.keyEnhanceWrapperBoxShadow};
    
  }

}

.keyEnhanceInner {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}
.ModPicker {
  flex: 0 0 100%;
  &.ModPickerScroll {
    overflow: auto;
  }
  &.ModPickerScrollHidden {
    overflow: hidden;
  }
}

// .superkeyHint {
//   padding: 8px;
// }
// .superkeyItem {
//   display: flex;
//   flex-wrap: nowrap;
//   align-items: center;
//   border-radius: 3px;
//   padding: 4px;
//   justify-content: space-between;
//   background-color: ${({ theme }) => theme.styles.standardView.superkeys.item.background};
// }
// .superkeyItem + .superkeyItem  {
//   margin-top: 1px;
// }
// .superkeyTitle {
//   flex: 0 0 62px;
//   padding-right: 18px;
// }
// .superkeyTitle h5.actionTitle {
//   font-size: 8px;
//   text-transform: uppercase;
//   font-weight: 700;
//   letter-spacing: 0.04em;
//   margin: 4px 0 1px 0;
//   color: ${({ theme }) => theme.styles.standardView.superkeys.item.titleColor};
// }
// .superKey {
//   position: relative;
//   align-self: center;
//   padding: 4px;
//   flex: 0 0 calc(100% - 62px);
//   text-align: center;
//   font-size: 10px;
//   font-weight: 700;
//   border: 1px solid ${({ theme }) => theme.styles.standardView.superkeys.key.border};
//   border-radius: 3px;
//   background-color: ${({ theme }) => theme.styles.standardView.superkeys.key.background};
//   .listModifiersTags .labelModifier {
//     font-size: 8px;
//     padding: 3px 8px;
//   }
// }
// .superKey > div{
//   position: absolute;
//   bottom: -12px;
//   left: 12px;
// }

`;

class KeyPickerKeyboard extends Component {
  constructor(props) {
    super(props);

    this.keymapDB = new KeymapDB();

    const tempModifs = Array(5);
    let tempActions = props.actions;
    if (props.actions === undefined) {
      tempActions = [[0], [0], [0], [0], [0]];
    } else {
      tempActions = props.actions;
    }
    tempActions.forEach((element, i) => {
      if (element > 255 && element < 8192) {
        tempModifs[i] = 0;
      } else {
        tempModifs[i] = [];
      }
    });

    this.state = {
      action: Number.isInteger(props.action) ? props.action : 0,
      actions: tempActions,
      modifs: tempModifs,
      disable: props.keyIndex === -1,
      selectdual: 0,
      selectlayer: 0,
      activeTab: "editor",
      layerData: 0,
      showKB: false,
      pastkeyindex: props.keyIndex,
      superName: props.superName,
      currentTab: undefined,
    };

    this.parseAction = this.parseAction.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  componentDidUpdate(prevProps) {
    let selectdual = 0;
    const disable = this.props.keyIndex === -1;
    const keynum = this.props.code != null ? this.props.code.modified + this.props.code.base : 0;
    if (keynum >= 51218 && keynum <= 53266) {
      selectdual = (this.props.code.modified >>> 8) << 8;
      if (selectdual >= 51218 - 18) {
        selectdual += 18;
      } else {
        selectdual += 17;
      }
    } else {
      selectdual = 0;
    }
    let layerData = 0;
    if ((keynum >= 17450 && keynum <= 17501) || (keynum >= 49161 && keynum <= 49168)) {
      layerData = keynum;
    } else {
      layerData = 0;
    }

    const tempModifs = Array(5);
    let tempActions;
    if (this.props.actions === undefined) {
      tempActions = [0, 0, 0, 0, 0];
    } else {
      tempActions = this.props.actions;
    }
    tempActions.forEach((element, i) => {
      if (element > 255 && element < 8448) {
        tempModifs[i] = 0;
      } else {
        tempModifs[i] = [];
      }
    });
    let activeTab = "editor";
    if (
      keynum < 256 ||
      (keynum > 53851 && keynum < 53852 + 128) ||
      (keynum > 49152 && keynum < 49161) ||
      keynum === 65535 ||
      disable
    ) {
      activeTab = "editor";
    } else if (layerData > 0 || selectdual > 0) {
      activeTab = "layer";
    } else {
      activeTab = "super";
    }
    if (JSON.stringify(this.state.actions) !== JSON.stringify(tempActions) || prevProps.keyIndex !== this.props.keyIndex) {
      this.setState({
        action: this.props.keyIndex !== this.state.pastkeyindex ? 0 : this.state.action,
        actions: tempActions,
        selectdual,
        layerData,
        disable,
        modifs: tempModifs,
        pastkeyindex: this.props.keyIndex,
        activeTab,
        superName: this.props.superName,
      });
    }
  }

  parseKey(keycode) {
    if (keycode >= 53980 && keycode < 54108) {
      let superk = "";
      // console.log(this.props.superkeys[keycode - 53980]);
      superk = `SUPER\n${
        this.props.superkeys[keycode - 53980] ? this.props.superkeys[keycode - 53980].name : keycode - 53980 + 1
      }`;
      return superk;
    }
    if (keycode > 53851 && keycode < 53979) {
      let macroN = "";
      // console.log(this.props.macros[keycode - 53852]);
      macroN = `MACRO\n${this.props.macros[keycode - 53852] ? this.props.macros[keycode - 53852].name : keycode - 53852}`;
      return macroN;
    }
    if (React.isValidElement(this.keymapDB.parse(keycode).label) || React.isValidElement(this.keymapDB.parse(keycode).extraLabel))
      return (
        <>
          {this.keymapDB.parse(keycode).extraLabel}
          <br />
          {this.keymapDB.parse(keycode).label}
        </>
      );
    return this.props.code !== null
      ? this.keymapDB.parse(keycode).extraLabel !== undefined && !this.keymapDB.parse(keycode).extraLabel.includes("+")
        ? `${this.keymapDB.parse(keycode).extraLabel} ${this.keymapDB.parse(keycode).label}`.trim()
        : this.keymapDB.parse(keycode).label
      : "";
  }

  parseAction(action) {
    let aux;
    try {
      aux = this.parseKey(this.state.actions[action]);
    } catch (error) {
      aux = 0;
    }
    return aux;
  }

  changeTab(tab) {
    this.setState({ activeTab: tab, action: 0 });
  }

  translateSuperKeyAction = superkeysSelected => {
    let aux;
    if (superkeysSelected === undefined) {
      return null;
    }
    if (superkeysSelected === 1) {
      aux = this.keymapDB.parse(0);
    } else {
      aux = this.keymapDB.parse(superkeysSelected);
    }
    let translatedAction = "";
    // console.log("Try to translate superkey actions inside SuperKeiItem: ", aux);

    if (aux.extraLabel === "MACRO") {
      if (this.props.macros.length > parseInt(aux.label) && this.props.macros[parseInt(aux.label)].name.substr(0, 5) !== "") {
        translatedAction = aux.label = this.props.macros[parseInt(aux.label)].name.substr(0, 5).toLowerCase();
      }
    }
    if (aux.label) {
      if (React.isValidElement(aux.label)) return aux.label;
      translatedAction = (aux.extraLabel !== undefined ? `${aux.extraLabel} ` : "") + aux.label;
    }
    return translatedAction;
  };

  render() {
    const { action, actions, showKB, modifs, superName, disable, Keymap, layoutSelectorPosition, currentTab } = this.state;
    const { selectedlanguage, kbtype, macros, actTab, superkeys, code, onKeySelect, isWireless, keyIndex, dragLimits } =
      this.props;
    const activeTab = actTab !== undefined ? actTab : this.state.activeTab;
    const selKey = this.parseKey(code.base + code.modified);
    const selKeys = actions.map((a, i) => this.parseAction(i));

    const KC = code.base + code.modified;
    const superk = Array(superkeys.length)
      .fill()
      .map((_, i) => i + 53980);

    const adjactions = actions;
    if (adjactions.length < 5) {
      while (adjactions.length < 5) {
        adjactions.push(0);
      }
    }

    const superKeysActions = [
      {
        title: "TAP",
        icon: <IconKeysPress />,
      },
      {
        title: "HOLD",
        icon: <IconKeysTapHold />,
      },
      {
        title: "TAP & HOLD",
        icon: <IconKeysHold />,
      },
      {
        title: "2TAP",
        icon: <IconKeys2Tap />,
      },
      {
        title: "2TAP & HOLD",
        icon: <IconKeys2TapHold />,
      },
    ];

    // Render variables
    const tabVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    console.log("Action: ", action);

    return (
      <Style>
        <Tabs
          defaultValue="tabKeys"
          orientation="vertical"
          value={currentTab}
          onChange={index =>
            this.setState({
              currentTab: index,
            })
          }
        >
          <div className="singleViewWrapper flex gap-[20px] mt-4">
            <div className="keyEnhanceWrapper">
              <div className="keyEnhanceInner">
                <TabsList className="flex flex-col gap-0.5 tabsWrapper min-w-48">
                  <TabsTrigger value="tabKeys" variant="tab" className="text-ssm [&_svg]:w-[20px] py-2" disabled={disable}>
                    <IconKeyboard /> Keys & Shortcuts
                  </TabsTrigger>
                  <TabsTrigger value="tabLayers" variant="tab" className="text-ssm [&_svg]:w-[20px] py-2" disabled={disable}>
                    <IconLayers size="sm" /> {i18n.editor.standardView.layers.title}
                  </TabsTrigger>
                  {actTab === "editor" ? (
                    <>
                      <TabsTrigger
                        value="tabModifiers"
                        variant="tab"
                        className="text-ssm [&_svg]:w-[20px] py-2"
                        disabled={disable}
                      >
                        <>
                          <IconSplitView size="sm" /> Advanced Modifiers
                        </>
                      </TabsTrigger>
                    </>
                  ) : (
                    ""
                  )}
                  <TabsTrigger value="tabMacro" variant="tab" className="text-ssm [&_svg]:w-[20px] py-2" disabled={disable}>
                    <IconRobot /> {i18n.editor.standardView.macros.title}
                  </TabsTrigger>
                  {actTab !== "super" ? (
                    <>
                      <TabsTrigger
                        value="tabSuperKeys"
                        variant="tab"
                        className="text-ssm [&_svg]:w-[20px] py-2"
                        disabled={disable}
                      >
                        <>
                          <IconThunder size="sm" /> {i18n.editor.standardView.superkeys.title}{" "}
                          <div className="badge badge-primary leading-none ml-1 font-bold text-[9px] text-white">BETA</div>
                        </>
                      </TabsTrigger>
                    </>
                  ) : (
                    ""
                  )}
                  <TabsTrigger value="tabMedia" variant="tab" className="text-ssm [&_svg]:w-[20px] py-2" disabled={disable}>
                    <IconNote size="sm" /> {i18n.editor.standardView.mediaAndLED.title}
                  </TabsTrigger>
                  <TabsTrigger value="tabMouse" variant="tab" className="text-ssm [&_svg]:w-[20px] py-2" disabled={disable}>
                    <IconMouse size="sm" /> {i18n.editor.standardView.mouse.title}
                  </TabsTrigger>
                  {isWireless && (
                    <TabsTrigger value="tabWireless" variant="tab" className="text-ssm [&_svg]:w-[20px] py-2" disabled={disable}>
                      <IconWireless size="sm" strokeWidth={1.2} /> {i18n.app.menu.wireless}
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
            </div>
            <div className="keyBoardPickerWrapper w-full rounded-regular py-4 px-8 bg-gray-25 dark:bg-[#25273B] shadow-lg">
              <TabsContent value="tabKeys">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <>
                    <Picker
                      actions={actions}
                      action={action}
                      disable={disable}
                      baseCode={code.base}
                      modCode={code.modified}
                      onKeySelect={onKeySelect}
                      activeTab={activeTab}
                      selectedlanguage={selectedlanguage}
                      selKeys={selKeys}
                      superkeys={superkeys}
                      kbtype={kbtype}
                      keyCode={code}
                      macros={macros}
                      isWireless={isWireless}
                    />
                    <div
                      className={`ModPicker w-full bg-gray-25 dark:bg-gray-600/50 rounded-b-regular ${this.props.macros[KC - 53852] ? "ModPickerScrollHidden" : ""} ${
                        disable ? "disable" : ""
                      }`}
                    >
                      {!superkeys[superk.indexOf(KC)] || !this.props.macros[KC - 53852] ? (
                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-4 py-4">
                          <ModPicker key={code} keyCode={code} onKeySelect={onKeySelect} />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {actTab !== "super" ? (
                      <div className="w-full px-3">
                        <NoKeyTransparentTab keyCode={code} onKeySelect={onKeySelect} isStandardView disabled={disable} />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </motion.div>
              </TabsContent>
              <TabsContent value="tabLayers" key="tabLayers">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <LayersTab
                    isStandardView
                    disableMods={!!((action === 0 || action === 3) && actTab === "super")}
                    disabled={disable}
                    actions={actions}
                    action={action}
                    baseCode={code.base}
                    modCode={code.modified}
                    onKeySelect={onKeySelect}
                    activeTab={actTab}
                    selectedlanguage={selectedlanguage}
                    superkeys={superkeys}
                    kbtype={kbtype}
                    keyCode={code}
                    macros={macros}
                    isWireless={isWireless}
                  />
                </motion.div>
              </TabsContent>
              {actTab === "editor" ? (
                <TabsContent value="tabModifiers" key="tabModifiers">
                  <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                    <ModifiersTab
                      isStandardView
                      disabled={disable}
                      actions={actions}
                      action={action}
                      baseCode={code.base}
                      modCode={code.modified}
                      onKeySelect={onKeySelect}
                      activeTab={actTab}
                      selectedlanguage={selectedlanguage}
                      superkeys={superkeys}
                      kbtype={kbtype}
                      keyCode={code}
                      macros={macros}
                      isWireless={isWireless}
                    />
                  </motion.div>
                </TabsContent>
              ) : (
                ""
              )}
              <TabsContent value="tabMacro" key="tabMacro">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <>
                    <MacroTab
                      macros={macros}
                      selectedMacro={this.keymapDB.parse(code).extraLabel === "MACRO" ? code : -1}
                      onMacrosPress={onKeySelect}
                      keyCode={code}
                      isStandardView
                      disabled={disable}
                    />
                    {this.props.macros[KC - 53852] ? (
                      <div className="ball-container">
                        <h5 className="ball-title">Preview macro</h5>
                        <div className="ball-inner">
                          {this.props.macros[KC - 53852].macro.split(" ").map((data, index) => (
                            <div className="ball" key={`LtrIdx-${index}`}>
                              {data}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </motion.div>
              </TabsContent>
              {actTab !== "super" && (
                <>
                  <TabsContent value="tabSuperKeys" key="tabSuperKeys">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <div className="">
                        <SuperkeysTab
                          actions={actions}
                          superkeys={superkeys}
                          onKeySelect={onKeySelect}
                          macros={macros}
                          keyCode={code}
                          isStandardView
                          disabled={disable}
                        />
                        {/* {superkeys[superk.indexOf(KC)] ? (
                          <div className="superkeyHint">
                            {superKeysActions.map((item, index) => (
                              <div className="superkeyItem" key={`superHint-${index}`}>
                                <div className="superkeyTitle">
                                  <h5 className="actionTitle">{item.title}</h5>
                                </div>
                                <div className="superKey">
                                  {this.translateSuperKeyAction(superkeys[superk.indexOf(KC)].actions[index])}
                                  <ListModifier keyCode={superkeys[superk.indexOf(KC)].actions[index]} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          ""
                        )} */}
                      </div>
                    </motion.div>
                  </TabsContent>
                </>
              )}
              <TabsContent value="tabMedia" key="tabMedia">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <MediaAndLightTab onAddSpecial={onKeySelect} keyCode={code} isStandardView disabled={disable} />
                </motion.div>
              </TabsContent>
              <TabsContent value="tabMouse" key="tabMouse">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <MouseTab onAddSpecial={onKeySelect} keyCode={code} isStandardView actTab={actTab} disabled={disable} />
                </motion.div>
              </TabsContent>
              {isWireless && (
                <TabsContent value="tabWireless" key="tabWireless">
                  <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                    <WirelessTab keyCode={code} onKeySelect={onKeySelect} isStandardView disabled={disable} />
                  </motion.div>
                </TabsContent>
              )}
            </div>
          </div>
        </Tabs>
      </Style>
    );
  }
}

export default KeyPickerKeyboard;
