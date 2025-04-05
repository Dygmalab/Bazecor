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
import React, { useEffect, useRef, useState } from "react";

import Styled from "styled-components";

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
import { MacroActionsType, MacrosType, RowsRepresentation } from "@Renderer/types/macros";
import TextTab from "../KeysTabs/TextTab";
import KeysTab from "../KeysTabs/KeysTab";
import LayersTab from "../KeysTabs/LayersTab";
import MacroTab from "../KeysTabs/MacroTab";
import DelayTab from "../KeysTabs/DelayTab";
import MediaAndLightTab from "../KeysTabs/MediaAndLightTab";
import MouseTab from "../KeysTabs/MouseTab";
import { KeymapDB } from "../../../api/keymap";
import { LanguageType } from "../../../api/keymap/types";
import { addModToKey, assignColor, createConversion, revertConversion } from "./utils";

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

interface Props {
  macro: MacrosType;
  macros: MacrosType[];
  selected: number;
  addToActions: (actions: MacroActionsType[]) => void;
  selectedlanguage: LanguageType;
  triggerDeleteLastItem: any;
}

const MacroCreator = (props: Props) => {
  const { macro, macros, selected, addToActions, selectedlanguage, triggerDeleteLastItem } = props;
  const prevProps = useRef<Props>(props);
  const [keymapDB] = useState(new KeymapDB());
  const [addText, setAddText] = useState("");
  const [rows, setRows] = useState<RowsRepresentation[]>([]);
  const [currentTab, setCurrentTab] = useState("tabText");

  useEffect(() => {
    try {
      const prevAux = prevProps.current.macro.actions.map((x, id) => ({ keyCode: x.keyCode, type: x.type, id }));
      const propAux = macro.actions.map((x, id) => ({ keyCode: x.keyCode, type: x.type, id }));
      // log.info("Testing: ", JSON.parse(JSON.stringify(prevAux)), JSON.parse(JSON.stringify(propAux)));
      if (JSON.stringify(prevAux) !== JSON.stringify(propAux)) {
        const auxConv = createConversion(macro.actions, macros);
        const newRows: RowsRepresentation[] = auxConv.map((item, index) => ({ ...item, id: index }));
        setRows(newRows);
        prevProps.current = props;
      }
    } catch (e) {
      log.warn("Error Happened", e);
    }
  }, [macro.actions, macros, props]);

  const updateRows = (nRows: RowsRepresentation[]) => {
    log.info("Macro creator updaterows", nRows, rows);
    const newRows = nRows.map((item, index) => {
      const aux = item;
      aux.id = index;
      return aux;
    });
    setRows(newRows);
    addToActions(revertConversion(nRows));
  };

  const onAddText = () => {
    log.info("MacroCreator onAddText", addText);
    const aux = addText;
    let newRows: RowsRepresentation[] = [];
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
        let keyCode = keymapDB.reverse(item);
        if (upper) {
          keyCode += 2048;
        }
        let actions = [
          {
            symbol: item,
            keyCode,
            type: 8,
            id: index + newRows.length,
            color: assignColor(keyCode),
            uid: randID,
            ucolor: "transparent",
          },
        ];
        switch (true) {
          case (keyCode & 256) === 256 && (keyCode & 512) === 512:
            // Control pressed to modify (2)
            actions = addModToKey(actions, 5, 256);

            break;
          case (keyCode & 256) === 256:
            // Control pressed to modify (2)
            actions = addModToKey(actions, 2, 256);

            break;
          case (keyCode & 512) === 512:
            // Left Alt pressed to modify (4)
            actions = addModToKey(actions, 4, 512);

            break;
          case (keyCode & 1024) === 1024:
            // Right alt pressed to modify (5)
            actions = addModToKey(actions, 5, 1024);

            break;
          case (keyCode & 2048) === 2048:
            // Shift pressed to modify (0)
            actions = addModToKey(actions, 0, 2048);

            break;
          case (keyCode & 4096) === 4096:
            // Gui pressed to modify (6)
            actions = addModToKey(actions, 6, 4096);

            break;
          default:
            break;
        }
        return actions;
      }),
    );
    // log.info("TEST", JSON.stringify(newRows), JSON.stringify(macros));
    setAddText("");
    updateRows(newRows);
  };

  const onAddRecorded = (recorded: { keycode: number; action: number }[]) => {
    log.info("MacroCreator onAddRecorded", recorded);
    const newRows = [].concat(
      recorded.map(item => ({
        keyCode: item.keycode,
        type: item.action,
      })),
    );
    updateRows(createConversion(newRows, macros));
  };

  const onAddSymbol = (keyCode: number, type: number) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    const symbol = keymapDB.parse(keyCode).label;
    newRows.push({
      symbol,
      keyCode,
      type,
      id: newRows.length,
      color: assignColor(keyCode),
      uid: randID,
      ucolor: "transparent",
    });
    updateRows(newRows);
  };

  const onAddDelay = (delay: number, type: number) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    newRows.push({
      symbol: String(delay),
      keyCode: delay,
      type,
      id: newRows.length,
      color: "#faf0e3",
      uid: randID,
      ucolor: "transparent",
    });
    updateRows(newRows);
  };

  const onAddDelayRnd = (delayMin: number, delayMax: number, type: number) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    newRows.push({
      symbol: `${delayMin} - ${delayMax}`,
      keyCode: [delayMin, delayMax],
      type,
      id: newRows.length,
      color: "#faf0e3",
      uid: randID,
      ucolor: "transparent",
    });
    updateRows(newRows);
  };

  const onAddSpecial = (keyCode: number, type: number) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const newRows = [];
    const symbol = keymapDB.parse(keyCode);
    let name: string | JSX.Element;

    if (symbol.extraLabel !== undefined) {
      name = `${symbol.extraLabel} ${symbol.label}`;
    } else {
      name = symbol.label;
    }

    newRows.push({
      symbol: name,
      keyCode,
      type,
      id: newRows.length,
      color: assignColor(keyCode),
      uid: randID,
      ucolor: "transparent",
    });
    updateRows(newRows);
  };

  const onTextChange = (event: any) => {
    setAddText(event.target.value);
  };

  // onKeyPress function that pushes the received keyCode on the rows array
  const onKeyPress = (keyCode: number) => {
    onAddSymbol(keyCode, 8);
  };

  const onLayerPress = (layer: number) => {
    // log.info("layer", layer);
    onAddSpecial(layer, 5);
  };

  const onMacrosPress = (Macro: number) => {
    // log.info("Macro", Macro);
    onAddSpecial(Macro, 5);
  };

  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <Styles>
      <Tabs defaultValue="tabText" orientation="vertical" value={currentTab} onValueChange={index => setCurrentTab(index)}>
        <div className="tabWrapper grid mt-[3px] grid-cols-[minmax(auto,_240px)_1fr]">
          <div className="px-5 py-4 rounded-bl-xl bg-gray-50 dark:bg-[#2b2c43]">
            <Heading headingLevel={3} renderAs="h3">
              {i18n.general.actions}
            </Heading>
            <RecordMacroModal onAddRecorded={onAddRecorded} />
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
                  <TextTab onAddText={onAddText} onTextChange={onTextChange} addText={addText} />
                </motion.div>
              </TabsContent>
              <TabsContent value="tabKeys">
                <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                  <KeysTab onKeyPress={onKeyPress} selectedlanguage={selectedlanguage} actTab="" superkeyAction={0} />
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
                              onKeySelect={onLayerPress}
                              activeTab="macro"
                              macro={macros[selected]}
                              triggerDeleteLastItem={triggerDeleteLastItem}
                            />
                          </motion.div>
                        </TabsContent>
                        <TabsContent value="tabMacro">
                          <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                            <MacroTab macros={macros} selectedMacro={selected} onMacrosPress={onMacrosPress} actTab="super" />
                          </motion.div>
                        </TabsContent>
                        <TabsContent value="tabMedia">
                          <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                            <MediaAndLightTab onAddSpecial={onAddSpecial} keyCode={undefined} />
                          </motion.div>
                        </TabsContent>
                        <TabsContent value="tabMouse">
                          <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                            <MouseTab onAddSpecial={onAddSpecial} actTab="macro" keyCode={undefined} />
                          </motion.div>
                        </TabsContent>
                      </div>
                    </div>
                  </Tabs>
                </motion.div>
              </TabsContent>
              <TabsContent value="tabDelay">
                <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                  <DelayTab onAddDelay={onAddDelay} onAddDelayRnd={onAddDelayRnd} />
                </motion.div>
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </Styles>
  );
};

export default MacroCreator;
