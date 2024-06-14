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
import { Button } from "@Renderer/components/atoms/Button";
import { i18n } from "@Renderer/i18n";

import { IconDelete, IconStopWatch } from "@Renderer/components/atoms/icons";
import PreviewMacroModal from "@Renderer/components/molecules/CustomModal/ModalPreviewMacro";
import Heading from "@Renderer/components/atoms/Heading";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { KeymapDB } from "../../../api/keymap";

import TimelineEditorForm from "./TimelineEditorForm";

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

`;
class MacroManager extends Component {
  constructor(props) {
    super(props);

    this.trackingWidth = React.createRef();
    this.portal = React.createRef();

    this.state = {
      componentWidth: 0,
    };
    this.keymapDB = new KeymapDB();

    this.parseKey = this.parseKey.bind(this);
  }

  componentDidMount() {
    // Additionally I could have just used an arrow function for the binding `this` to the component...
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }

  updateWidth = () => {
    this.setState({
      componentWidth: 50,
    });
    this.setState({
      componentWidth: this.trackingWidth.current.clientWidth,
    });
  };

  parseKey(keycode) {
    const { macros, code } = this.props;
    let macroName;
    const aux = this.keymapDB.parse(keycode);
    try {
      macroName = macros[parseInt(aux.label, 10) - 1]?.name.substr(0, 5);
    } catch (error) {
      macroName = "*NotFound*";
    }
    if (keycode >= 53852 && keycode <= 53852 + 128) {
      if (code !== null) return `${aux.extraLabel}.${macroName}`;
    }
    if (code === null) return "";
    // if (aux.label === "SPACE") return " ";
    if (React.isValidElement(aux.label)) {
      return aux.extraLabel !== undefined && aux.extraLabel !== "" ? (
        <>
          {aux.extraLabel}
          <br />
          {aux.label}
        </>
      ) : (
        <>{aux.label}</>
      );
    }
    if (aux.extraLabel !== undefined) return `${aux.extraLabel}.${aux.label}`;
    return aux.label;
  }

  render() {
    const { keymapDB, macro, macros, updateActions, clearMacro } = this.props;
    // console.log("Macro on TimelineEditorManager", macro);
    const macroID = Math.random().toString(36).substring(0, 7);

    return (
      <Styles className="timelineWrapper grid mt-4 grid-cols-[minmax(auto,_240px)_1fr] rounded-t-lg pb-[5px] bg-white/80 dark:bg-[#2B2C43]">
        <div className="timelineHeaderWrapper">
          <div className="timelineHeader flex items-baseline px-8 py-6">
            <div className="timelineHeaderContent">
              <Heading headingLevel={3} renderAs="h4" className="mb-2">
                {i18n.editor.macros.timelineTitle}
              </Heading>
              <div id="portalPreviewMacroModal" ref={this.portal} />
              {this.portal.current !== null ? (
                <PreviewMacroModal hookref={this.portal}>
                  {macro.actions.length > 0
                    ? macro.actions.map((item, index) => (
                        <span
                          key={`literal-${macroID}-${item?.id}-${index}`}
                          className={`previewKey action-${item.type} keyCode-${item.keyCode} ${
                            item.keyCode > 223 && item.keyCode < 232 && item.action !== 2 ? "isModifier" : ""
                          }`}
                        >
                          {item.type === 2 ? (
                            <>
                              <IconStopWatch size="xs" /> {item.keyCode}
                            </>
                          ) : (
                            this.parseKey(item.keyCode)
                          )}
                        </span>
                      ))
                    : ""}
                </PreviewMacroModal>
              ) : (
                ""
              )}
              <Button
                variant="outline"
                size="sm"
                iconDirection="right"
                onClick={clearMacro}
                className="px-[12px] py-[2px] w-full justify-between mt-1"
              >
                <IconDelete /> {i18n.editor.macros.clearMacro}
              </Button>
            </div>
          </div>
        </div>
        <div className="timelineBodyWrapper" ref={this.trackingWidth}>
          {macro !== null && macro.actions !== null && macro.actions.length > 0 ? (
            <TimelineEditorForm
              macro={macro}
              macros={macros}
              updateActions={updateActions}
              keymapDB={keymapDB}
              componentWidth={this.state.componentWidth}
              updateScroll={this.props.updateScroll}
              scrollPos={this.props.scrollPos}
            />
          ) : (
            <div className="loading marginCenter trackingWrapper flex flex-col justify-center h-full items-center">
              <div className="m-auto flex flex-wrap">
                <Heading headingLevel={4} renderAs="h4" className="w-full text-center">
                  Your macro is currently empty.
                </Heading>
                <Heading headingLevel={5} renderAs="paragraph-sm" className="w-full text-center text-gray-400 dark:text-gray-300">
                  Let&apos;s get started adding new action to your macro!
                </Heading>
              </div>
            </div>
          )}
          <div id="portalMacro" />
        </div>
      </Styles>
    );
  }
}

export default MacroManager;
