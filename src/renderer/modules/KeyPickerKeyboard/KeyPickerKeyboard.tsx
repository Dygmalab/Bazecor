/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from "react";
import Styled from "styled-components";
import { motion } from "framer-motion";
import log from "electron-log/renderer";

// Internal components
import {
  IconKeyboard,
  IconMouse,
  IconLayers,
  IconRobot,
  IconNote,
  IconThunder,
  IconSplitView,
  IconWireless,
  IconWrench,
} from "@Renderer/components/atoms/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/atoms/Tabs";
import { Button } from "@Renderer/components/atoms/Button";
import { i18n } from "@Renderer/i18n";
import NoKeyTransparentTab from "@Renderer/modules/KeysTabs/NoKeyTransparentTab";
import LayersTab from "@Renderer/modules/KeysTabs/LayersTab";
import MacroTab from "@Renderer/modules/KeysTabs/MacroTab";
import SuperkeysTab from "@Renderer/modules/KeysTabs/SuperkeysTab";
import MediaAndLightTab from "@Renderer/modules/KeysTabs/MediaAndLightTab";
import MouseTab from "@Renderer/modules/KeysTabs/MouseTab";
import WirelessTab from "@Renderer/modules/KeysTabs/WirelessTab";
import CustomKeyCodeModal from "@Renderer/components/molecules/CustomModal/ModalCustomKeycode";
import { Separator } from "@Renderer/components/atoms/Separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { MacrosType } from "@Renderer/types/macros";
import { SuperkeysType } from "@Renderer/types/superkeys";
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

interface Props {
  mouseWheel: number;
  resetScroll: () => void;
  onKeySelect: (keyCode: number) => void;
  code: SegmentedKeyType;
  macros: MacrosType[];
  superkeys: SuperkeysType[];
  keyIndex: number;
  actTab: string;
  selectedlanguage: string;
  isWireless: boolean;
}

interface State {
  tabs: string[];
  disable: boolean;
  currentTab: string;
  customModal: boolean;
}

function KeyPickerKeyboard(props: Props) {
  const { selectedlanguage, macros, actTab, superkeys, code, onKeySelect, isWireless, keyIndex, mouseWheel, resetScroll } = props;
  const prevProps = useRef(props);

  const initialState: State = {
    tabs: [],
    disable: true,
    currentTab: undefined,
    customModal: false,
  };
  const [state, setState] = useState<State>(initialState);
  const prevState = useRef(state);
  const [keymapDB] = useState(new KeymapDB());

  const { tabs, disable, currentTab, customModal } = state;

  useEffect(() => {
    const tabList = [];
    tabList.push("tabKeys");
    tabList.push("tabLayers");
    if (actTab === "editor") tabList.push("tabModifiers");
    tabList.push("tabMacro");
    if (actTab !== "super") tabList.push("tabSuperKeys");
    tabList.push("tabMedia");
    tabList.push("tabMouse");
    if (isWireless) tabList.push("tabWireless");

    const lstate = { ...state };
    lstate.tabs = tabList;
    setState(lstate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectTab = (keyCode: number) => {
    let tab = "";
    if (keyCode < 256 || keyCode === 65535) tab = "tabKeys";
    if (keyCode >= 256 && keyCode <= 8192) tab = "tabKeys";
    if (keyCode >= 17408 && keyCode <= 17501) tab = "tabLayers";
    if (keyCode >= 49161 && keyCode <= 49168) tab = "tabLayers";
    if (keyCode >= 51218 && keyCode <= 53266) tab = "tabLayers";
    if (keyCode >= 49153 && keyCode <= 49160) tab = "tabModifiers";
    if (keyCode >= 49169 && keyCode <= 50961) tab = "tabModifiers";
    if (keyCode >= 17152 && keyCode <= 17154) tab = "tabMedia";
    if ([19682, 18552, 18834, 20865, 20866].includes(keyCode)) tab = "tabMedia";
    if (keyCode >= 22709 && keyCode <= 22733) tab = "tabMedia";
    if (keyCode >= 23663 && keyCode <= 23786) tab = "tabMedia";
    if (keyCode >= 20481 && keyCode <= 20488) tab = "tabMouse";
    if (keyCode >= 20497 && keyCode <= 20504) tab = "tabMouse";
    if (keyCode >= 20545 && keyCode <= 20560) tab = "tabMouse";
    if (keyCode >= 53852 && keyCode <= 53979) tab = "tabMacro";
    if (keyCode >= 53980 && keyCode <= 54109) tab = "tabSuperKeys";
    if (keyCode >= 54108 && keyCode <= 54112) tab = "tabWireless";

    log.info("detectedTab", keyCode, tab);

    if (state.currentTab === "tabModifiers" && tab === "tabKeys" && keyCode > 223) tab = "tabModifiers";
    return tab;
  };

  useEffect(() => {
    const keynum = code != null ? code.modified + code.base : 0;
    const keynumOld = prevProps.current.code != null ? prevProps.current.code.modified + prevProps.current.code.base : 0;

    if (keynumOld !== keynum) {
      const localdisable = keyIndex === -1;
      // log.info("This kenumOld : ", keynumOld, keynum, localdisable, keyIndex);
      const lstate = { ...state };
      lstate.disable = actTab === "super" ? false : localdisable;
      lstate.currentTab = detectTab(keynum);
      setState(lstate);
      prevState.current = state;
    }
    prevProps.current = props;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, code, keyIndex, state]);

  useEffect(() => {
    if (!disable && mouseWheel !== 0) {
      if (mouseWheel === 1) {
        const lstate = { ...state };
        const indexTab = tabs.indexOf(lstate.currentTab);
        const futureTab = indexTab === tabs.length ? 0 : indexTab + 1;
        lstate.currentTab = tabs[futureTab];
        resetScroll();
        setState(lstate);
      } else {
        const lstate = { ...state };
        const indexTab = tabs.indexOf(lstate.currentTab);
        const futureTab = indexTab === 0 ? tabs.length - 1 : indexTab - 1;
        lstate.currentTab = tabs[futureTab];
        resetScroll();
        setState(lstate);
      }
    }
  }, [state, mouseWheel, tabs, resetScroll, disable]);

  const changeTab = (tab: string) => {
    log.info("Check tab change value", tab);
    const lstate = { ...state };
    lstate.currentTab = tab;
    setState(lstate);
  };

  const toggleModal = (value?: boolean) => {
    state.customModal = value === undefined ? !state.customModal : value;
    setState({ ...state });
  };

  const KC = code.base + code.modified;
  const superk = Array(superkeys.length)
    .fill(0)
    .map((_, i) => i + 53980);

  // Render variables
  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <Style>
      <Tabs defaultValue="tabKeys" orientation="vertical" value={currentTab} onValueChange={changeTab}>
        <div className="singleViewWrapper flex gap-[20px] mt-4">
          <div className="keyEnhanceWrapper">
            <div className="keyEnhanceInner">
              <TabsList className="flex flex-col gap-0.5 tabsWrapper min-w-48">
                <TabsTrigger value="tabKeys" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                  <IconKeyboard /> Keys & Shortcuts
                </TabsTrigger>
                <TabsTrigger value="tabLayers" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                  <IconLayers size="sm" /> {i18n.editor.standardView.layers.title}
                </TabsTrigger>
                {actTab === "editor" ? (
                  <>
                    <TabsTrigger value="tabModifiers" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                      <>
                        <IconSplitView size="sm" /> Advanced Modifiers
                      </>
                    </TabsTrigger>
                  </>
                ) : (
                  ""
                )}
                <TabsTrigger value="tabMacro" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                  <IconRobot size="sm" /> Macros
                </TabsTrigger>
                {actTab !== "super" ? (
                  <>
                    <TabsTrigger value="tabSuperKeys" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                      <>
                        <IconThunder size="sm" /> {i18n.editor.standardView.superkeys.title}{" "}
                        <div className="badge badge-primary leading-none ml-1 font-bold text-[9px] text-white">BETA</div>
                      </>
                    </TabsTrigger>
                  </>
                ) : (
                  ""
                )}
                <TabsTrigger value="tabMedia" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                  <IconNote size="sm" /> {i18n.editor.standardView.mediaAndLED.title}
                </TabsTrigger>
                <TabsTrigger value="tabMouse" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                  <IconMouse size="sm" /> {i18n.editor.standardView.mouse.title}
                </TabsTrigger>
                {isWireless && (
                  <TabsTrigger value="tabWireless" variant="tab" className="text-sm [&_svg]:w-[20px] py-2" disabled={disable}>
                    <IconWireless size="sm" strokeWidth={1.2} /> {i18n.app.menu.wireless}
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
          </div>
          <div className="keyBoardPickerWrapper w-full rounded-regular py-4 px-8 bg-gray-25 dark:bg-[#25273B] shadow-lg h-[370px] overflow-auto">
            <TabsContent value="tabKeys">
              <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                <>
                  <Picker
                    key={`${disable}`}
                    disable={disable}
                    disableMods={false}
                    disableMove={false}
                    baseCode={code.base}
                    modCode={code.modified}
                    onKeySelect={onKeySelect}
                    selectedlanguage={selectedlanguage}
                  />
                  <div className="w-full flex flex-wrap items-center justify-between gap-6 mt-4">
                    <div className={`flex ${macros[KC - 53852] ? "ModPickerScrollHidden" : ""} ${disable ? "disable" : ""}`}>
                      {!superkeys[superk.indexOf(KC)] || !macros[KC - 53852] ? (
                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-4">
                          <ModPicker keyCode={code} onKeySelect={onKeySelect} isStandardView={false} />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {actTab !== "super" ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        <NoKeyTransparentTab keyCode={code} onKeySelect={onKeySelect} disabled={disable} />
                        <Separator orientation="vertical" className="mx-1 bg-gray-100 dark:bg-gray-600 block h-9" />
                        <div className="flex gap-2">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="basis-full">
                                  <Button
                                    variant="config"
                                    disabled={false}
                                    // selected={code.base + code.modified >= 20000}
                                    onClick={() => {
                                      toggleModal(false);
                                    }}
                                    size="icon"
                                    className="w-9 h-9"
                                  >
                                    <IconWrench size="sm" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent size="sm" className="max-w-xs">
                                {i18n.editor.superkeys.specialKeys.custom}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              </motion.div>
            </TabsContent>
            <TabsContent value="tabLayers" key="tabLayers">
              <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                <LayersTab
                  disabled={disable}
                  onKeySelect={onKeySelect}
                  activeTab={actTab}
                  selectedlanguage={selectedlanguage}
                  keyCode={code}
                  macros={macros}
                />
              </motion.div>
            </TabsContent>
            {actTab === "editor" ? (
              <TabsContent value="tabModifiers" key="tabModifiers">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <ModifiersTab
                    disabled={disable}
                    baseCode={code.base}
                    modCode={code.modified}
                    onKeySelect={onKeySelect}
                    selectedlanguage={selectedlanguage}
                    keyCode={code}
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
                    selectedMacro={keymapDB.parse(code.base + code.modified).extraLabel === "MACRO" ? code.base : -1}
                    onMacrosPress={onKeySelect}
                    keyCode={code}
                    disabled={disable}
                    actTab={actTab}
                  />
                  {macros[KC - 53852] ? (
                    <div className="ball-container">
                      <h5 className="ball-title">Preview macro</h5>
                      <div className="ball-inner">
                        {macros[KC - 53852].macro.split(" ").map((data, i) => (
                          <div className="ball" key={`LtrIdx-${JSON.stringify(data) + String(i)}`}>
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
                        superkeys={superkeys}
                        onKeySelect={onKeySelect}
                        macros={macros}
                        keyCode={code}
                        disabled={disable}
                      />
                    </div>
                  </motion.div>
                </TabsContent>
              </>
            )}
            <TabsContent value="tabMedia" key="tabMedia">
              <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                <MediaAndLightTab onAddSpecial={onKeySelect} keyCode={code} disabled={disable} />
              </motion.div>
            </TabsContent>
            <TabsContent value="tabMouse" key="tabMouse">
              <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                <MouseTab onAddSpecial={onKeySelect} keyCode={code} actTab={actTab} disabled={disable} />
              </motion.div>
            </TabsContent>
            {isWireless && (
              <TabsContent value="tabWireless" key="tabWireless">
                <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                  <WirelessTab keyCode={code} onKeySelect={onKeySelect} disabled={disable} />
                </motion.div>
              </TabsContent>
            )}
          </div>
        </div>
      </Tabs>
      <CustomKeyCodeModal
        show={customModal}
        name={(code.base + code.modified).toString(16)}
        toggleShow={() => toggleModal(false)}
        handleSave={data => {
          log.info("CustomKey selected key", data);
          onKeySelect(parseInt(data, 16));
          toggleModal();
        }}
        modalTitle={i18n.editor.modal.customKeyCodeModal.title}
        modalMessage={i18n.editor.modal.customKeyCodeModal.message}
        labelInput={i18n.editor.modal.customKeyCodeModal.labelInput}
      />
    </Style>
  );
}

export default KeyPickerKeyboard;
