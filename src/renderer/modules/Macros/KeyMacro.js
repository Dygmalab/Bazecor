import React, { Component } from "react";

import { withTheme } from "styled-components";

import { Popover, PopoverContent, PopoverTrigger } from "@Renderer/components/atoms/Popover";
import { FaLinux } from "react-icons/fa";
import { AiFillWindows } from "react-icons/ai";
import { i18n } from "@Renderer/i18n";

import {
  IconClone,
  IconThreeDots,
  IconPress,
  IconRelease,
  IconPressAndRelease,
  IconStopWatch,
  IconDragAndDrop,
  IconDelete,
} from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";

class KeyMacro extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
      backgroundColor: this.props.theme.styles.macroKey.backgroundColorDrag,
      backgroundImage: this.props.theme.styles.macroKey.backgroundDrag,
      backgroundSize: "56.57px 56.57px",
      borderRadius: "6px",
      boxShadow: this.props.theme.styles.macroKey.boxShadowOnDrag,
    }),
  });

  shadeColor(color, percent) {
    if (color === "transparent") {
      return color;
    }
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 - percent)) / 100, 10);
    G = parseInt((G * (100 - percent)) / 100, 10);
    B = parseInt((B * (100 - percent)) / 100, 10);

    R = Math.round((R * 255) / (R + 5));
    G = Math.round((G * 255) / (G + 5));
    B = Math.round((B * 255) / (B + 5));

    const RR = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const GG = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const BB = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);

    return `#${RR}${GG}${BB}`;
  }

  render() {
    const { provided, snapshot, item, modifiers, addModifier, actionTypes, updateAction } = this.props;
    const operationSystem = process.platform;
    let operationSystemIcons = [];
    if (operationSystem === "darwin") {
      operationSystemIcons = {
        shift: "Shift",
        control: "Control ^",
        os: {
          icon: false,
          text: "⌘",
        },
        alt: "⌥",
        altGr: "Right ⌥",
      };
    } else if (operationSystem === "win32") {
      operationSystemIcons = {
        shift: "Shift",
        control: "Control",
        os: {
          icon: <AiFillWindows />,
          text: false,
        },
        alt: "Alt",
        altGr: "Alt Gr.",
      };
    } else {
      operationSystemIcons = {
        shift: "Shift",
        control: "Control",
        os: {
          icon: <FaLinux />,
          text: false,
        },
        alt: "Alt",
        altGr: "Alt Gr.",
      };
    }
    let isModifier = false;
    if (item.keyCode > 223 && item.keyCode < 232 && item.action !== 2) {
      isModifier = true;
    }

    return (
      <div>
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <div
            className={`keyMacroWrapper relative flex flex-wrap flex-col p-0 m-0 after:absolute after:content-[' '] after:w-full after:h-[1px] after:top-[71px] after:left-0 after:bg-white/80 after:dark:bg-[#2B2C43] keyCode-${item.keyCode} ${isModifier ? "isModifier" : ""} ${
              item.action === 1 || item.action === 2 ? "isDelay" : ""
            }`}
          >
            <div className="keyMacro">
              <div className="headerDrag">
                <div className="dragable">
                  <IconDragAndDrop />
                </div>
                <div className="moreOptions">
                  <Popover>
                    <PopoverTrigger>
                      <IconThreeDots />
                    </PopoverTrigger>
                    <PopoverContent align="start">
                      <div className="keyMacroMiniDashboard rounded-regular overflow-hidden">
                        <div className="keyInfo pt-[16px] pb-[12px] pl-[12px] pr-[12px] bg-gray-50/70 dark:bg-gray-800">
                          <Heading
                            headingLevel={4}
                            renderAs="h4"
                            className="m-0 uppercase !text-ssm text-gray-300 dark:text-gray-500"
                          >
                            {item.action === 1 || item.action === 2 ? i18n.editor.macros.delay : i18n.general.key}
                          </Heading>
                          <p className="keyValue text-2xl">
                            {item.symbol} {item.action === 1 || item.action === 2 ? <small>ms</small> : ""}
                          </p>
                        </div>
                        <div className="keyFunctions py-[12px] px-[8px] bg-gray-50/40 dark:bg-gray-800 divide-y divide-y-reverse divide-gray-50 dark:divide-gray-700">
                          <Heading
                            headingLevel={5}
                            renderAs="h5"
                            className="normal-case tracking-normal font-medium !text-ssm mb-[8px] text-gray-500 dark:text-gray-50"
                          >
                            Edit function
                          </Heading>
                          <div className="keyFunctionsButtons flex gap-1">
                            <Button
                              iconDirection="left"
                              variant="config"
                              icon={<IconPress size="sm" />}
                              selected={actionTypes[item.action].name === "Key Press"}
                              disabled={!!(item.action === 1 || item.action === 2)}
                              onClick={() => updateAction(item.id, 6)}
                              size="sm"
                            >
                              Press
                            </Button>
                            <Button
                              iconDirection="left"
                              variant="config"
                              icon={<IconRelease size="sm" />}
                              selected={actionTypes[item.action].name === "Key Release"}
                              disabled={!!(item.action === 1 || item.action === 2)}
                              onClick={() => updateAction(item.id, 7)}
                              size="sm"
                            >
                              Release
                            </Button>
                            <Button
                              iconDirection="left"
                              variant="config"
                              icon={<IconPressAndRelease size="sm" />}
                              selected={actionTypes[item.action].name === "Key Press & Rel."}
                              disabled={!!(item.action === 1 || item.action === 2)}
                              onClick={() => updateAction(item.id, 8)}
                              size="sm"
                            >
                              Press & Release
                            </Button>
                          </div>
                        </div>
                        <div className="keyModifiers py-[12px] px-[8px] bg-gray-25/40 dark:bg-gray-700">
                          <Heading
                            headingLevel={4}
                            renderAs="h4"
                            className="normal-case tracking-normal font-medium !text-ssm mb-[8px] text-gray-500 dark:text-gray-50"
                          >
                            Add modifier
                          </Heading>
                          <div className="keyModifiersButtons grid grid-cols-4 gap-2">
                            {modifiers.map((item, id) => (
                              <Button
                                variant="config"
                                size="sm"
                                className="w-full text-center"
                                onClick={e => {
                                  addModifier(item.id, id);
                                }}
                                key={`item-${item.name}`}
                              >
                                {item.name === "LEFT SHIFT" ? "L. Shift" : ""}
                                {item.name === "RIGHT SHIFT" ? "R. Shift" : ""}
                                {item.name === "LEFT CTRL" ? "L. Ctrl" : ""}
                                {item.name === "RIGHT CTRL" ? "R. Ctrl" : ""}
                                {item.name === "LEFT ALT" ? "L. Alt" : ""}
                                {item.name === "RIGHT ALT" ? "Alt Gr." : ""}
                                {item.name === "LEFT OS" ? "L. OS" : ""}
                                {item.name === "RIGHT OS" ? "R. OS" : ""}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="keyMacroItemOptions">
                        <Button
                          variant="link"
                          icon={<IconClone />}
                          iconDirection="left"
                          size="sm"
                          onClick={() => {
                            this.props.onCloneRow(item.id);
                          }}
                        >
                          Clone
                        </Button>
                        <Button
                          variant="link"
                          iconDirection="left"
                          icon={<IconDelete />}
                          size="sm"
                          onClick={() => {
                            this.props.onDeleteRow(item.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* <Dropdown label={i18n.editor.macros.insertModifiers} value="" size="small" className="keyMacroOptions">
                    <Dropdown.Toggle variant="primary" id="dropdown-basic" drop="up" align="end">
                      <IconThreeDots />
                    </Dropdown.Toggle>
                    <MacroKeyPortal>
                      <Dropdown.Menu>
                        <div className="keyMacroMiniDashboard">
                          <div className="keyInfo">
                            {item.action === 1 ? (
                              <Heading headingLevel={4} renderAs="h4">
                                {i18n.editor.macros.delay}
                              </Heading>
                            ) : item.action === 2 ? (
                              <Heading headingLevel={4} renderAs="h4">
                                {i18n.editor.macros.delay}
                              </Heading>
                            ) : (
                              <Heading headingLevel={4} renderAs="h4">
                                {i18n.general.key}
                              </Heading>
                            )}
                            <p className="keyValue">
                              {item.symbol} {item.action === 1 || item.action === 2 ? <small>ms</small> : ""}
                            </p>
                          </div>

                          <div className="keyFunctions">
                            <Heading headingLevel={5} renderAs="h5">
                              Edit function
                            </Heading>
                            <div className="keyFunctionsButtons flex gap-1">
                              <Button
                                iconDirection="left"
                                variant="config"
                                icon={<IconPress size="sm" />}
                                selected={actionTypes[item.action].name === "Key Press"}
                                disabled={!!(item.action === 1 || item.action === 2)}
                                onClick={() => updateAction(item.id, 6)}
                                size="sm"
                              >
                                Press
                              </Button>
                              <Button
                                iconDirection="left"
                                variant="config"
                                icon={<IconRelease size="sm" />}
                                selected={actionTypes[item.action].name === "Key Release"}
                                disabled={!!(item.action === 1 || item.action === 2)}
                                onClick={() => updateAction(item.id, 7)}
                                size="sm"
                              >
                                Release
                              </Button>
                              <Button
                                iconDirection="left"
                                variant="config"
                                icon={<IconPressAndRelease size="sm" />}
                                selected={actionTypes[item.action].name === "Key Press & Rel."}
                                disabled={!!(item.action === 1 || item.action === 2)}
                                onClick={() => updateAction(item.id, 8)}
                                size="sm"
                              >
                                Press & Release
                              </Button>
                            </div>
                          </div>

                          <div className="keyModifiers">
                            <Heading headingLevel={4} renderAs="h4">
                              Add modifier
                            </Heading>
                            <div className="keyModifiersButtons flex gap-2">
                              {modifiers.map((item, id) => (
                                <Button
                                  variant="config"
                                  size="sm"
                                  className="w-full text-center"
                                  onClick={e => {
                                    addModifier(item.id, id);
                                  }}
                                  key={`item-${item.name}`}
                                >
                                  {item.name === "LEFT SHIFT" ? "L. Shift" : ""}
                                  {item.name === "RIGHT SHIFT" ? "R. Shift" : ""}
                                  {item.name === "LEFT CTRL" ? "L. Ctrl" : ""}
                                  {item.name === "RIGHT CTRL" ? "R. Ctrl" : ""}
                                  {item.name === "LEFT ALT" ? "L. Alt" : ""}
                                  {item.name === "RIGHT ALT" ? "Alt Gr." : ""}
                                  {item.name === "LEFT OS" ? "L. OS" : ""}
                                  {item.name === "RIGHT OS" ? "R. OS" : ""}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="keyMacroItemOptions">
                          <Button
                            variant="link"
                            icon={<IconClone />}
                            iconDirection="left"
                            size="sm"
                            onClick={() => {
                              this.props.onCloneRow(item.id);
                            }}
                          >
                            Clone
                          </Button>
                          <Button
                            variant="link"
                            iconDirection="left"
                            icon={<IconDelete />}
                            size="sm"
                            onClick={() => {
                              this.props.onDeleteRow(item.id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </Dropdown.Menu>
                    </MacroKeyPortal>
                  </Dropdown> */}
                </div>
              </div>
              <div className="bodyDrag">
                <p
                  className="chip font-semibold pt-[6px] pr-0 pb-[6px] pl-[6px] bg-transparent text-ssm whitespace-nowrap text-ellipsis overflow-hidden m-0 w-[74px]"
                  style={
                    {
                      // backgroundColor: item.color,
                      // borderColor: item.color,
                      // HACK allow the text to be visible on darkTheme
                      // without completely rewriting the code which assigns the background colors
                      // color: "#000"
                    }
                  }
                >
                  {item.symbol}
                </p>
                <div className="actionicon">
                  {actionTypes[item.action].name === "Key Press" ? (
                    <IconPress size="sm" />
                  ) : actionTypes[item.action].name === "Key Release" ? (
                    <IconRelease size="sm" />
                  ) : actionTypes[item.action].name === "Key Press & Rel." ? (
                    <IconPressAndRelease size="sm" />
                  ) : actionTypes[item.action].name === "Delay" ? (
                    <IconStopWatch size="sm" />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="keyMacro keyMacroFreeSlot" />
          </div>
        </div>
      </div>
    );
  }
}

export default withTheme(KeyMacro);
