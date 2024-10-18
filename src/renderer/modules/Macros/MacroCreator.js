/* eslint-disable no-bitwise */
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2019  Keyboardio, Inc.
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
import React, { Component } from "react";

import Styled from "styled-components";

import { MdUnfoldLess, MdKeyboardArrowUp, MdKeyboardArrowDown, MdTimer } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/atoms/Tabs";
import { motion } from "framer-motion";
import log from "electron-log/renderer";
import { i18n } from "@Renderer/i18n";
import {
  IconKeyboard,
  IconLetterColor,
  IconMouse,
  IconLayers,
  IconRobot,
  IconNote,
  IconStopWatch,
  IconMagicStick,
} from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";
import RecordMacroModal from "@Renderer/modules/Macros/RecordMacroModal";
import TextTab from "../KeysTabs/TextTab";
import KeysTab from "../KeysTabs/KeysTab";
import LayersTab from "../KeysTabs/LayersTab";
import MacroTab from "../KeysTabs/MacroTab";
import DelayTab from "../KeysTabs/DelayTab";
import MediaAndLightTab from "../KeysTabs/MediaAndLightTab";
import MouseTab from "../KeysTabs/MouseTab";

const Styles = Styled.div`
.card {
  width: auto;
  height: 100%;
  margin: 2rem;
  padding: 0;
  overflow: auto;
  background-color: ${({ theme }) => theme.card.background};
  color: ${({ theme }) => theme.card.color};
}
.card::-webkit-scrollbar {
  display: none;
}
.macroHeaderMem{
  display: flex;
  justify-content: space-between;
}
.macroHeaderTitle {
  align-self: center;
}
.macroFreeMem {
  width: 40%;
  display: flex;
  align-items: center;
}
.memSlider {
  width: -webkit-fill-available;
  margin-left: 8px;
  margin-right: 8px;
}
.memSlider {
  .rangeslider__fill {
    background-color: lightgreen;
  }
  .rangeslider__handle {
    display: none;
  }
}
.outOfMem {
  .rangeslider__fill {
    background-color: red;
  }
  .rangeslider__handle {
    background-color: red;
  }
}
.cardcontent {
  padding: 0px;
  &:last-child {
    padding-bottom: 0px;
  }
}
.iconFloppy{
  margin-right: 6px;
  width: 27px;
}
.cardHeader {
  background-color: ${({ theme }) => theme.card.background};
  color: ${({ theme }) => theme.card.color};
}
.cardTitle {
  color: ${({ theme }) => theme.card.color};
}


.tabWrapper {
  h3 {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.styles.macro.tabTile};
  }

  .tabCategories {
    padding: 32px 14px 32px 32px;
    border-bottom-left-radius: 16px;
    background-color: ${({ theme }) => theme.styles.macro.tabCategoriesBackground};
    h5 {
      font-size: 11px;
      line-height: 32px;
      font-weight: 600;
      margin-bottom: 0;
      letter-spacing: 0.21em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.styles.macro.tabSubTitle};
    }
  }
  .tabContent {
    padding: 32px ;
    border-bottom-right-radius: 16px;
    background-color: ${({ theme }) => theme.styles.macro.tabContentBackground};
  }
  .tabContentInner {
    height: 100%;
  }
  .tab-content {
    height: inherit;
  }
  .tab-pane {
    height: calc(100% - 24px);
  }
  .tabContentWrapper {
      display: flex;
      flex-wrap: wrap;
      flex: 0 0 100%;
      height: fit-content;
  }
  .tabSaveButton {
      height: fit-content;
      margin-top: auto;
      margin-left: auto;
      display: flex;
      align-self: flex-end;
      .button {
        font-size: 14px;
        padding: 12px 24px;
        .buttonLabel {
          align-items: center;
        }
      }
  }
}
.specialTabsWrapper {
  display: grid;
  grid-template-columns: minmax(125px,170px) auto;
  grid-gap: 14px;
}
`;

class MacroCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addText: "",
      rows: [],
      currentTab: 0,
    };
    this.keymapDB = props.keymapDB;
    this.modifiers = [
      { name: "LEFT SHIFT", keyCode: 225, color: "#e1f3f7" },
      { name: "RIGHT SHIFT", keyCode: 229, color: "#e1f3f7" },
      { name: "LEFT CTRL", keyCode: 224, color: "#f5e4e4" },
      { name: "RIGHT CTRL", keyCode: 228, color: "#f5e4e4" },
      { name: "LEFT ALT", keyCode: 226, color: "#faf8e1" },
      { name: "RIGHT ALT", keyCode: 230, color: "#f2e7f5" },
      { name: "LEFT OS", keyCode: 227, color: "#e6f0e4" },
      { name: "RIGHT OS", keyCode: 231, color: "#e6f0e4" },
    ];
    this.actionTypes = [
      {
        enum: "MACRO_ACTION_END",
        name: "End macro",
        icon: <></>,
        smallIcon: <></>,
      },
      {
        enum: "MACRO_ACTION_STEP_INTERVAL",
        name: "Set Interval",
        icon: <MdTimer fontSize="large" />,
        smallIcon: <MdTimer />,
      },
      {
        enum: "MACRO_ACTION_STEP_WAIT",
        name: "Delay",
        icon: <MdTimer fontSize="large" />,
        smallIcon: <MdTimer />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYDOWN",
        name: "Function Key Press",
        icon: <MdKeyboardArrowDown fontSize="large" />,
        smallIcon: <MdKeyboardArrowDown />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYUP",
        name: "Function Key Release",
        icon: <MdKeyboardArrowUp fontSize="large" />,
        smallIcon: <MdKeyboardArrowUp />,
      },
      {
        enum: "MACRO_ACTION_STEP_TAP",
        name: "Fn. Press & Release",
        icon: <MdUnfoldLess fontSize="large" />,
        smallIcon: <MdUnfoldLess />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYCODEDOWN",
        name: "Key Press",
        icon: <MdKeyboardArrowDown fontSize="large" />,
        smallIcon: <MdKeyboardArrowDown />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYCODEUP",
        name: "Key Release",
        icon: <MdKeyboardArrowUp fontSize="large" />,
        smallIcon: <MdKeyboardArrowUp />,
      },
      {
        enum: "MACRO_ACTION_STEP_TAPCODE",
        name: "Key Press & Rel.",
        icon: <MdUnfoldLess fontSize="large" />,
        smallIcon: <MdUnfoldLess />,
      },
      {
        enum: "MACRO_ACTION_STEP_EXPLICIT_REPORT",
        name: "Explicit Report",
        icon: <></>,
        smallIcon: <></>,
      },
      {
        enum: "MACRO_ACTION_STEP_IMPLICIT_REPORT",
        name: "Implicit Report",
        icon: <></>,
        smallIcon: <></>,
      },
      { enum: "MACRO_ACTION_STEP_SEND_REPORT", id: 11, name: "Send Report" },
      {
        enum: "MACRO_ACTION_STEP_TAP_SEQUENCE",
        name: "Intervaled Special Keys",
        icon: <></>,
        smallIcon: <></>,
      },
      {
        enum: "MACRO_ACTION_STEP_TAP_CODE_SEQUENCE",
        name: "Intervaled Key Press & Release",
        icon: <></>,
        smallIcon: <></>,
      },
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      const prevAux = prevProps.macro.actions.map((x, id) => ({ keyCode: x.keyCode, type: x.type, id }));
      const propAux = this.props.macro.actions.map((x, id) => ({ keyCode: x.keyCode, type: x.type, id }));
      // log.info("Testing: ", JSON.parse(JSON.stringify(prevAux)), JSON.parse(JSON.stringify(propAux)));
      if (JSON.stringify(prevAux) !== JSON.stringify(propAux)) {
        log.info("Updating");
        const auxConv = this.createConversion(this.props.macro.actions);
        const newRows = auxConv.map((item, index) => ({ ...item, id: index }));
        this.setState({
          rows: newRows,
        });
      }
    } catch (e) {
      log.warn("Error Happened", e);
    }
  }

  onAddText = () => {
    const { addText } = this.state;
    log.info("MacroCreator onAddText", addText);
    const aux = addText;
    let newRows = [];
    newRows = newRows.concat(
      aux.split("").flatMap((symbol, index) => {
        let item = symbol.toUpperCase();
        let upper = false;
        if (symbol.toLowerCase() !== symbol) {
          upper = true;
        }
        switch (item) {
          case " ":
            item = "SPACE";
            break;
          case "    ":
            item = "TAB";
            break;
          case "\n":
            item = "ENTER";
            break;
          default:
            break;
        }
        const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
        let keyCode = this.keymapDB.reverse(item);
        if (upper) {
          keyCode += 2048;
        }
        let actions = [
          {
            symbol: item,
            keyCode,
            action: 8,
            id: index + newRows.length,
            color: this.assignColor(keyCode),
            uid: randID,
            ucolor: "transparent",
          },
        ];
        switch (true) {
          case (keyCode & 256) === 256 && (keyCode & 512) === 512:
            // Control pressed to modify (2)
            actions = this.addModToKey(actions, 5, 256);

            break;
          case (keyCode & 256) === 256:
            // Control pressed to modify (2)
            actions = this.addModToKey(actions, 2, 256);

            break;
          case (keyCode & 512) === 512:
            // Left Alt pressed to modify (4)
            actions = this.addModToKey(actions, 4, 512);

            break;
          case (keyCode & 1024) === 1024:
            // Right alt pressed to modify (5)
            actions = this.addModToKey(actions, 5, 1024);

            break;
          case (keyCode & 2048) === 2048:
            // Shift pressed to modify (0)
            actions = this.addModToKey(actions, 0, 2048);

            break;
          case (keyCode & 4096) === 4096:
            // Gui pressed to modify (6)
            actions = this.addModToKey(actions, 6, 4096);

            break;
          default:
            break;
        }
        return actions;
      }),
    );
    // log.info("TEST", JSON.stringify(newRows), JSON.stringify(this.props.macros));
    this.setState({
      addText: "",
    });
    this.updateRows(newRows);
  };

  onAddRecorded = recorded => {
    log.info("MacroCreator onAddRecorded", recorded);
    const newRows = [].concat(
      recorded.map(item => ({
        keyCode: item.keycode,
        type: item.action,
      })),
    );
    this.updateRows(this.createConversion(newRows));
  };

  createConversion = actions => {
    const converted = actions.map((action, i) => {
      const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
      let km;
      let txt;
      switch (action.type) {
        case 1:
        case 2:
          return {
            symbol: action.keyCode,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: "#faf0e3",
            uid: randID,
            ucolor: "transparent",
          };
        case 3:
        case 4:
        case 5:
          km = this.keymapDB.parse(action.keyCode);
          if (km.extraLabel !== undefined) {
            txt = `${km.extraLabel} ${km.label}`;
          } else {
            txt = km.label;
          }
          return {
            symbol: txt,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: this.assignColor(action.keyCode),
            uid: randID,
            ucolor: "transparent",
          };
        case 6:
        case 7:
        case 8:
          return {
            symbol: this.keymapDB.parse(action.keyCode).label,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: this.assignColor(action.keyCode),
            uid: randID,
            ucolor: "transparent",
          };
        default:
          break;
      }
    });
    return converted;
  };

  revertConversion = actions => {
    const converted = actions.map(({ keyCode, action, id }) => ({
      keyCode,
      type: action,
      id,
    }));
    return converted;
  };

  updateRows = rows => {
    log.info("Macro creator updaterows", rows);
    const texted = rows.map(k => this.keymapDB.parse(k.keyCode).label).join(" ");
    const newRows = rows.map((item, index) => {
      const aux = item;
      aux.id = index;
      return aux;
    });
    this.setState({
      rows: newRows,
      macro: texted,
    });

    this.props.addToActions(this.revertConversion(rows));
  };

  onAddSymbol = (keyCode, action) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    const symbol = this.keymapDB.parse(keyCode).label;
    newRows.push({
      symbol,
      keyCode,
      action,
      id: newRows.length,
      color: this.assignColor(keyCode),
      uid: randID,
      ucolor: "transparent",
    });
    this.updateRows(newRows);
  };

  onAddDelay = (delay, action) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    newRows.push({
      symbol: parseInt(delay, 10),
      keyCode: parseInt(delay, 10),
      action,
      id: newRows.length,
      color: "#faf0e3",
      uid: randID,
      ucolor: "transparent",
    });
    this.updateRows(newRows);
  };

  onAddDelayRnd = (delayMin, delayMax, action) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    newRows.push({
      symbol: `${delayMin} - ${delayMax}`,
      keyCode: [delayMin, delayMax],
      action,
      id: newRows.length,
      color: "#faf0e3",
      uid: randID,
      ucolor: "transparent",
    });
    this.updateRows(newRows);
  };

  onAddSpecial = (keyCode, action) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    let symbol = this.keymapDB.parse(keyCode);
    if (symbol.extraLabel !== undefined) {
      symbol = `${symbol.extraLabel} ${symbol.label}`;
    } else {
      symbol = symbol.label;
    }
    newRows.push({
      symbol,
      keyCode,
      action,
      id: newRows.length,
      color: this.assignColor(keyCode),
      uid: randID,
      ucolor: "transparent",
    });
    this.updateRows(newRows);
  };

  addModifier = (rowID, modifierID) => {
    const { name, keyCode, color } = this.modifiers[modifierID];
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const randColor = `#${Math.floor(Math.abs(Math.sin(randID) * 16777215) % 16777215).toString(16)}`;
    const newRows = this.state.rows;
    newRows.splice(rowID + 1, 0, {
      symbol: name,
      keyCode,
      action: 7,
      id: rowID + 1,
      color,
      uid: randID,
      ucolor: randColor,
    });
    newRows.splice(rowID, 0, {
      symbol: name,
      keyCode,
      action: 6,
      id: rowID,
      color,
      uid: randID,
      ucolor: randColor,
    });
    this.updateRows(newRows);
  };

  addModToKey = (rows, modID, modBit) => {
    const { name, keyCode, color } = this.modifiers[modID];
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const randColor = `#${Math.floor(Math.abs(Math.sin(randID) * 16777215) % 16777215).toString(16)}`;
    const actions = rows;
    actions.splice(1, 0, {
      symbol: name,
      keyCode,
      action: 7,
      id: 2,
      color,
      uid: randID,
      ucolor: randColor,
    });
    actions.splice(0, 0, {
      symbol: name,
      keyCode,
      action: 6,
      id: 0,
      color,
      uid: randID,
      ucolor: randColor,
    });
    actions[1].keyCode ^= modBit;
    actions[1].symbol = this.keymapDB.parse(actions[1].keyCode).label;
    return actions;
  };

  onTextChange = event => {
    this.setState({ addText: event.target.value });
  };

  // onKeyPress function that pushes the received keyCode on the rows array
  onKeyPress = keyCode => {
    this.onAddSymbol(keyCode, 8);
  };

  onLayerPress = layer => {
    // log.info("layer", layer);
    this.onAddSpecial(layer, 5);
  };

  onMacrosPress = Macro => {
    // log.info("Macro", Macro);
    this.onAddSpecial(Macro, 5);
  };

  assignColor = keyCode => {
    let color = this.modifiers.filter(x => x.keyCode === keyCode);
    if (color === undefined || color.length === 0) {
      color = "#ededed";
    } else {
      color = color[0].color;
    }
    return color;
  };

  render() {
    const tabVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5 } },
    };
    return (
      <Styles>
        <Tabs
          defaultValue="tabText"
          orientation="vertical"
          index={this.state.currentTab}
          onChange={index =>
            this.setState({
              currentTab: index,
            })
          }
        >
          <div className="tabWrapper grid mt-[3px] grid-cols-[minmax(auto,_240px)_1fr]">
            <div className="px-5 py-4 rounded-bl-xl bg-gray-50 dark:bg-[#2b2c43]">
              <Heading headingLevel={3} renderAs="h3">
                {i18n.general.actions}
              </Heading>
              <RecordMacroModal onAddRecorded={this.onAddRecorded} keymapDB={this.keymapDB} />
              <TabsList className="flex flex-col gap-1">
                <TabsTrigger value="tabText" variant="tab">
                  <IconLetterColor />
                  Text
                </TabsTrigger>
                <TabsTrigger value="tabKeys" variant="tab">
                  <IconKeyboard />
                  Keys
                </TabsTrigger>
                <TabsTrigger value="tabSpecial" variant="tab">
                  <IconMagicStick />
                  Special functions
                </TabsTrigger>
                <TabsTrigger value="tabDelay" variant="tab">
                  <IconStopWatch />
                  Delay
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="px-8 pt-4 pb-8 rounded-br-xl bg-gray-25 dark:bg-gray-800">
              <div className="tabContentInner">
                <Heading headingLevel={3} renderAs="h3">
                  {i18n.general.configure}
                </Heading>
                <TabsContent value="tabText">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <TextTab onAddText={this.onAddText} onTextChange={this.onTextChange} addText={this.state.addText} />
                  </motion.div>
                </TabsContent>
                <TabsContent value="tabKeys">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <KeysTab
                      onKeyPress={this.onKeyPress}
                      kbtype={this.props.kbtype}
                      selectedlanguage={this.props.selectedlanguage}
                    />
                  </motion.div>
                </TabsContent>
                <TabsContent value="tabSpecial">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <Tabs defaultValue="tabLayers" orientation="vertical">
                      <div className="grid grid-cols-[minmax(125px,_170px)_auto]">
                        <div className="pl-0 pr-5 py-3">
                          <TabsList className="flex flex-col gap-1">
                            <TabsTrigger value="tabLayers" variant="tab">
                              <IconLayers />
                              Layers
                            </TabsTrigger>
                            <TabsTrigger value="tabMacro" variant="tab">
                              <IconRobot />
                              Macro
                            </TabsTrigger>
                            <TabsTrigger value="tabMedia" variant="tab">
                              <IconNote />
                              Media & LED
                            </TabsTrigger>
                            <TabsTrigger value="tabMouse" variant="tab">
                              <IconMouse />
                              Mouse
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        <div className="px-6 py-3 rounded-md bg-gray-50/40 dark:bg-gray-900/20 mt-[-24px]">
                          <TabsContent value="tabLayers">
                            <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                              <LayersTab
                                onKeySelect={this.onLayerPress}
                                activeTab="macro"
                                macros={this.props.macros[this.props.selected]}
                                triggerDeleteLastItem={this.props.triggerDeleteLastItem}
                              />
                            </motion.div>
                          </TabsContent>
                          <TabsContent value="tabMacro">
                            <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                              <MacroTab
                                macros={this.props.macros}
                                selectedMacro={this.props.selected}
                                onMacrosPress={this.onMacrosPress}
                                actTab="super"
                              />
                            </motion.div>
                          </TabsContent>
                          <TabsContent value="tabMedia">
                            <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                              <MediaAndLightTab onAddSpecial={this.onAddSpecial} />
                            </motion.div>
                          </TabsContent>
                          <TabsContent value="tabMouse">
                            <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                              <MouseTab onAddSpecial={this.onAddSpecial} actTab="macro" />
                            </motion.div>
                          </TabsContent>
                        </div>
                      </div>
                    </Tabs>
                  </motion.div>
                </TabsContent>
                <TabsContent value="tabDelay">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <DelayTab onAddDelay={this.onAddDelay} onAddDelayRnd={this.onAddDelayRnd} />
                  </motion.div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </Styles>
    );
  }
}

export default MacroCreator;
