import React from "react";

import Styled from "styled-components";
import { motion } from "framer-motion";
import log from "electron-log/renderer";

// component
import { Button } from "@Renderer/components/atoms/Button";
import KeyVisualizer from "@Renderer/modules/KeyVisualizer";
import KeysTab from "@Renderer/modules/KeysTabs/KeysTab";
import NoKeyTransparentTab from "@Renderer/modules/KeysTabs/NoKeyTransparentTab";
import LayersTab from "@Renderer/modules/KeysTabs/LayersTab";
import MacroTab from "@Renderer/modules/KeysTabs/MacroTab";
import SuperkeysTab from "@Renderer/modules/KeysTabs/SuperkeysTab";
import MediaAndLightTab from "@Renderer/modules/KeysTabs/MediaAndLightTab";
import OneShotTab from "@Renderer/modules/KeysTabs/OneShotTab";
import MouseTab from "@Renderer/modules/KeysTabs/MouseTab";
import WirelessTab from "@Renderer/modules/KeysTabs/WirelessTab";

import { i18n } from "@Renderer/i18n";

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
  IconWireless,
} from "@Renderer/components/atoms/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/atoms/Tabs";
import { MacrosType } from "@Renderer/types/macros";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { KeymapDB } from "../../../api/keymap";

const Styles = Styled.div`
.standardView {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.styles.standardView.modalBackground};
    z-index: 50;
    padding: 32px 32px 32px 32px;
    overflow: overlay;
    .standardViewInner {
        // width: 100%;
        // height: 100%;
        // display: grid;
        // grid-gap: 14px;
        // grid-template-columns: minmax(200px, 220px) 1fr;
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
  width: calc(100% + 32px);
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
        padding: 16px 24px 24px 32px;
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
    padding: 24px 24px 24px 32px;
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
    padding: 24px 24px 24px 32px;
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

interface StandardViewProps {
  actions: number[];
  actTab: string;
  code: SegmentedKeyType;
  closeStandardView: (stateCode: number) => void;
  handleSave: () => void;
  isStandardView: boolean;
  kbtype: any;
  keyIndex: number;
  layerData: any[];
  macros: MacrosType[];
  onKeySelect: (keycode: number) => void;
  selectedlanguage: string;
  showStandardView: boolean;
  superkeys: SuperkeysType[];
  isWireless: boolean;
}

interface StandardViewState {
  currentTab: any;
  stateCode: number;
  selected: SegmentedKeyType;
}

export default class StandardView extends React.Component<StandardViewProps, StandardViewState> {
  keymapDB: KeymapDB;
  constructor(props: StandardViewProps) {
    super(props);
    this.keymapDB = new KeymapDB();
    const selectedKey: number =
      props.actTab !== "super"
        ? props.keyIndex !== -1
          ? props.layerData[props.keyIndex].keyCode
          : 0
        : props.keyIndex !== -1
          ? props.layerData[props.keyIndex]
          : 0;
    this.state = {
      currentTab: undefined,
      stateCode: 0,
      selected: this.keymapDB.keySegmentator(selectedKey),
    };
  }

  componentDidUpdate(prevProps: StandardViewProps) {
    const { keyIndex, layerData, actTab } = this.props;
    if (keyIndex !== prevProps.keyIndex) {
      const selectedKey: number =
        actTab !== "super" ? (keyIndex !== -1 ? layerData[keyIndex].keyCode : 0) : keyIndex !== -1 ? layerData[keyIndex] : 0;
      this.setState({
        stateCode: selectedKey,
        selected: this.keymapDB.keySegmentator(selectedKey),
      });
    }
  }

  updateSelected = (newKey: number) => {
    this.setState({
      selected: this.keymapDB.keySegmentator(newKey),
    });
  };

  onAddSpecial = (keycode: number) => {
    log.info("added Special!", keycode);
    this.updateSelected(keycode);
  };

  onApplyChanges = () => {
    const { onKeySelect, handleSave } = this.props;
    const { selected } = this.state;

    onKeySelect(selected.base + selected.modified);
    handleSave();
  };

  parseKey(keycode: number) {
    const { macros, superkeys, code } = this.props;
    const aux = this.keymapDB.parse(keycode);

    let macroName;
    let superName;

    if (aux.extraLabel === "MACRO") {
      const macro = macros[parseInt(aux.label as string, 10) - 1];
      try {
        macroName = macro.name.substr(0, 5);
      } catch (error) {
        macroName = "*NotFound*";
      }
      if (keycode >= 53852 && keycode <= 53852 + 128) {
        if (code !== null) return `${aux.extraLabel} ${macroName}`;
      }
    }

    if (aux.extraLabel === "SUPER") {
      const superk = superkeys[parseInt(aux.label as string, 10) - 1];
      try {
        superName = superk.name.substr(0, 5);
      } catch (error) {
        superName = "*NotFound*";
      }
      if (keycode >= 53980 && keycode <= 53980 + 128) {
        if (code !== null) return `${aux.extraLabel} ${superName}`;
      }
    }

    if (React.isValidElement(aux.label) || React.isValidElement(aux.extraLabel))
      return aux.extraLabel !== undefined ? (
        <>
          {aux.extraLabel}
          <br />
          {aux.label}
        </>
      ) : (
        aux.label
      );
    let result;
    if (code !== null) {
      result =
        aux.extraLabel !== undefined && !(aux.extraLabel as string).includes("+")
          ? `${aux.extraLabel} ${aux.label}`.trim()
          : aux.label;
    }
    return result;
  }

  render() {
    const {
      actions,
      actTab,
      code,
      closeStandardView,
      isStandardView,
      kbtype,
      keyIndex,
      macros,
      layerData,
      selectedlanguage,
      showStandardView,
      superkeys,
      isWireless,
    } = this.props;
    const { stateCode, selected, currentTab } = this.state;
    let keyCode: number;
    if (actTab === "super") {
      keyCode = selected.base + selected.modified;
    } else {
      keyCode = selected.base + selected.modified;
    }
    const selKey = this.parseKey(keyCode);
    const oldKey = this.parseKey(stateCode);
    if (!showStandardView) return null;
    // log.info(
    //   `StandardView statecode:${stateCode} selected:${selected} actTab: ${actTab} currentTab: ${currentTab} selKey: ${selKey} oldKey: ${oldKey}, layerData: ${layerData}`,
    // );

    const tabVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    return (
      <Styles>
        <div className="standardView">
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
            <div className="standardViewInner w-full h-full grid gap-6 grid-cols-[minmax(200px,_220px)_1fr]">
              <div className="colVisualizerTabs">
                <KeyVisualizer
                  keyCode={keyCode}
                  oldKeyCode={stateCode}
                  oldValue={oldKey}
                  newValue={selKey}
                  isStandardView={isStandardView}
                  superkeyAction={actTab === "super" ? keyIndex : 5}
                />
                <TabsList className="flex flex-col gap-1 tabsWrapper">
                  <TabsTrigger value="tabKeys" variant="tab">
                    <IconKeyboard /> Keys
                  </TabsTrigger>
                  <TabsTrigger value="tabNoKeys" variant="tab">
                    <IconNoKey /> {i18n.editor.standardView.noKeyTransparent}
                  </TabsTrigger>
                  <TabsTrigger value="tabLayers" variant="tab">
                    <IconLayers /> {i18n.editor.standardView.layers.title}
                  </TabsTrigger>
                  <TabsTrigger value="tabMacro" variant="tab">
                    <IconRobot /> {i18n.editor.standardView.macros.title}
                  </TabsTrigger>
                  {actTab !== "super" ? (
                    <>
                      <TabsTrigger value="tabSuperKeys" variant="tab">
                        <>
                          <IconThunder /> {i18n.editor.standardView.superkeys.title}{" "}
                          <div className="badge badge-primary leading-none ml-1 font-bold text-[9px] text-white">BETA</div>
                        </>
                      </TabsTrigger>
                      <TabsTrigger value="tabOneShot" variant="tab">
                        <IconOneShot /> {i18n.editor.standardView.oneShot.title}
                      </TabsTrigger>
                    </>
                  ) : (
                    ""
                  )}
                  <TabsTrigger value="tabMedia" variant="tab">
                    <IconNote /> {i18n.editor.standardView.mediaAndLED.title}
                  </TabsTrigger>
                  <TabsTrigger value="tabMouse" variant="tab">
                    <IconMouse /> {i18n.editor.standardView.mouse.title}
                  </TabsTrigger>
                  {isWireless && (
                    <TabsTrigger value="tabWireless" variant="tab">
                      <IconWireless size="md" strokeWidth={1.2} /> {i18n.app.menu.wireless}
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
              <div className="colContentTabs">
                <div className="contentBody">
                  <TabsContent value="tabKeys" key="tabKeys">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <KeysTab
                        keyCode={selected}
                        code={code}
                        onKeyPress={this.updateSelected}
                        isStandardView={isStandardView}
                        superkeyAction={actTab === "super" ? keyIndex : 5}
                        actTab={actTab}
                        selectedlanguage={selectedlanguage}
                        kbtype={kbtype}
                        action={undefined}
                        actions={undefined}
                      />
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="tabNoKeys" key="tabNoKeys">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <NoKeyTransparentTab keyCode={keyCode} onKeySelect={this.updateSelected} isStandardView={isStandardView} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="tabLayers" key="tabLayers">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <LayersTab
                        onLayerPress={this.updateSelected}
                        keyCode={keyCode}
                        isStandardView={isStandardView}
                        disableMods={!!((keyIndex === 0 || keyIndex === 3) && actTab === "super")}
                      />
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="tabMacro" key="tabMacro">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <MacroTab
                        macros={macros}
                        selectedMacro={this.keymapDB.parse(keyCode).extraLabel === "MACRO" ? selected : -1}
                        onMacrosPress={this.updateSelected}
                        keyCode={keyCode}
                        isStandardView={isStandardView}
                      />
                    </motion.div>
                  </TabsContent>
                  {actTab !== "super" && (
                    <>
                      <TabsContent value="tabSuperKeys" key="tabSuperKeys">
                        <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                          <SuperkeysTab
                            actions={actions}
                            superkeys={superkeys}
                            onKeySelect={this.updateSelected}
                            macros={macros}
                            keyCode={keyCode}
                            isStandardView={isStandardView}
                          />
                        </motion.div>
                      </TabsContent>
                      <TabsContent value="tabOneShot" key="tabOneShot">
                        <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                          <OneShotTab keyCode={keyCode} onKeySelect={this.updateSelected} isStandardView={isStandardView} />
                        </motion.div>
                      </TabsContent>
                    </>
                  )}
                  <TabsContent value="tabMedia" key="tabMedia">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <MediaAndLightTab onAddSpecial={this.onAddSpecial} keyCode={keyCode} isStandardView={isStandardView} />
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="tabMouse" key="tabMouse">
                    <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                      <MouseTab
                        onAddSpecial={this.onAddSpecial}
                        keyCode={keyCode}
                        isStandardView={isStandardView}
                        actTab={actTab}
                      />
                    </motion.div>
                  </TabsContent>
                  {isWireless && (
                    <TabsContent value="tabWireless" key="tabWireless">
                      <motion.div initial="hidden" animate="visible" key="tabKeys" variants={tabVariants}>
                        <WirelessTab keyCode={keyCode} onKeySelect={this.updateSelected} isStandardView={isStandardView} />
                      </motion.div>
                    </TabsContent>
                  )}
                </div>
                <div className="contentFooter">
                  <div className="d-flex flex gap-4 justify-end">
                    <Button onClick={() => closeStandardView(undefined)} variant="outline" size="sm">
                      Discard changes
                    </Button>
                    <Button onClick={this.onApplyChanges} variant="secondary" size="sm">
                      {i18n.dialog.applyChanges}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </Styles>
    );
  }
}
