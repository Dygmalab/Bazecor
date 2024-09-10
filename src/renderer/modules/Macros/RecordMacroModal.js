import React from "react";
import log from "electron-log/renderer";
import { ipcRenderer } from "electron";
import { i18n } from "@Renderer/i18n";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { Button } from "@Renderer/components/atoms/Button";
import {
  IconRecord,
  IconArrowInBoxDown,
  IconPause,
  IconUndoRestart,
  IconStopWatch,
  IconStopwatchCrossed,
} from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";
import AnimatedTimelineRecording from "./AnimatedTimelineRecording";

export default class RecordMacroModal extends React.Component {
  constructor(props) {
    super(props);
    this.buttonRecord = React.createRef();
    this.state = {
      showModal: false,
      isRecording: false,
      isDelayActive: false,
      recorded: [],
    };
    this.translator = {
      0x000e: 42,
      0x000f: 43,
      0x001c: 40,
      0x003a: 57,
      0x0e37: 70,
      0x0046: 71,
      0x0e45: 72,
      0x0001: 41,
      0x0039: 44,
      0x0e49: 75,
      0x0e51: 78,
      0x0e4f: 77,
      0x0e47: 74,
      0xe04b: 80,
      0xe048: 82,
      0xe04d: 79,
      0xe050: 81,
      0x0e52: 73,
      0x0e53: 76,
      0x0e5d: 101, // Menu key
      0x000b: 39,
      0x0002: 30,
      0x0003: 31,
      0x0004: 32,
      0x0005: 33,
      0x0006: 34,
      0x0007: 35,
      0x0008: 36,
      0x0009: 37,
      0x000a: 38,
      0x001e: 4,
      0x0030: 5,
      0x002e: 6,
      0x0020: 7,
      0x0012: 8,
      0x0021: 9,
      0x0022: 10,
      0x0023: 11,
      0x0017: 12,
      0x0024: 13,
      0x0025: 14,
      0x0026: 15,
      0x0032: 16,
      0x0031: 17,
      0x0018: 18,
      0x0019: 19,
      0x0010: 20,
      0x0013: 21,
      0x001f: 22,
      0x0014: 23,
      0x0016: 24,
      0x002f: 25,
      0x0011: 26,
      0x002d: 27,
      0x0015: 28,
      0x002c: 29,
      0x0052: 98,
      0x004f: 89,
      0x0050: 90,
      0x0051: 91,
      0x004b: 92,
      0x004c: 93,
      0x004d: 94,
      0x0047: 95,
      0x0048: 96,
      0x0049: 97,
      0x0037: 85,
      0x004e: 87,
      0x004a: 86,
      0x0053: 99,
      0x0e35: 84,
      0x0045: 83,
      0x003b: 58,
      0x003c: 59,
      0x003d: 60,
      0x003e: 61,
      0x003f: 62,
      0x0040: 63,
      0x0041: 64,
      0x0042: 65,
      0x0043: 66,
      0x0044: 67,
      0x0057: 68,
      0x0058: 69,
      0x005b: 104,
      0x005c: 105,
      0x005d: 106,
      0x0063: 107,
      0x0064: 108,
      0x0065: 109,
      0x0066: 110,
      0x0067: 111,
      0x0068: 112,
      0x0069: 113,
      0x006a: 114,
      0x006b: 115,
      0x0027: 51,
      0x000d: 46,
      0x0033: 54,
      0x000c: 45,
      0x0034: 55,
      0x0035: 56,
      0x0029: 53,
      0x001a: 47,
      0x002b: 49,
      0x001b: 48,
      0x0028: 52,
      0x001d: 224, // Left
      0x0e1d: 228,
      0x0038: 226, // Left
      0x0e38: 230,
      0x002a: 225, // Left
      0x0036: 229,
      0x0e5b: 227,
      0x0e5c: 231,
    };
  }

  componentDidMount() {
    ipcRenderer.on("recorded-key-down", (event, response) => {
      const { keymapDB } = this.props;
      const { isDelayActive, recorded } = this.state;
      log.info("Check key-down", response);
      const newRecorded = recorded;
      const translated = keymapDB.parse(this.translator[response.event.keycode]);
      log.info("key press", translated);
      if (isDelayActive && recorded.length > 0) {
        const timePast = response.time - recorded[recorded.length - 1].time;
        if (timePast !== undefined && timePast > 1)
          newRecorded.push({
            char: "delay",
            keycode: timePast,
            action: 2,
            time: response.time,
            isMod: translated.keyCode >= 224 && translated.keyCode <= 231,
          });
      }
      newRecorded.push({
        char: translated.label,
        keycode: translated.keyCode,
        action: 6,
        time: response.time,
        isMod: translated.keyCode >= 224 && translated.keyCode <= 231,
      });
      this.setState({
        recorded: newRecorded,
      });
    });
    ipcRenderer.on("recorded-key-up", (event, response) => {
      const { keymapDB } = this.props;
      const { isDelayActive, recorded } = this.state;
      log.info("Check key-up", response);
      const newRecorded = recorded;
      const translated = keymapDB.parse(this.translator[response.event.keycode]);
      log.info("key release", translated);
      if (isDelayActive) {
        const timePast = response.time - recorded[recorded.length - 1].time;
        if (timePast !== undefined && timePast > 1)
          newRecorded.push({
            char: "delay",
            keycode: timePast,
            action: 2,
            time: response.time,
            isMod: translated.keyCode >= 224 && translated.keyCode <= 231,
          });
      }
      newRecorded.push({
        char: translated.label,
        keycode: translated.keyCode,
        action: 7,
        time: response.time,
        isMod: translated.keyCode >= 224 && translated.keyCode <= 231,
      });
      this.setState({
        recorded: newRecorded,
      });
    });
    // ipcRenderer.on("recorded-mouse-move", (event, response) => {
    //   log.info(response);
    // });
    ipcRenderer.on("recorded-mouse-click", (event, response) => {
      log.info(response);
    });
    ipcRenderer.on("recorded-mouse-wheel", (event, response) => {
      log.info(response);
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("recorded-key-down");
    ipcRenderer.removeAllListeners("recorded-key-up");
    // ipcRenderer.removeAllListeners("recorded-mouse-move");
    ipcRenderer.removeAllListeners("recorded-mouse-click");
    ipcRenderer.removeAllListeners("recorded-mouse-wheel");
  }

  toggleIsRecording = async () => {
    const { isRecording } = this.state;
    if (this.buttonRecord.current && this.buttonRecord.current instanceof HTMLButtonElement) {
      this.buttonRecord.current.blur();
    }
    const isAccessible = await ipcRenderer.invoke("ask-for-accessibility", "");
    if (!isAccessible) {
      return;
    }
    if (!isRecording) {
      ipcRenderer.send("start-recording", "");
    } else {
      ipcRenderer.send("stop-recording", "");
    }
    this.setRecordingState(!isRecording);
  };

  setRecordingState(isRecording) {
    this.setState({ isRecording });
  }

  undoRecording = () => {
    this.setState({
      recorded: [],
    });
  };

  setDelayOn = () => {
    this.setState({
      isDelayActive: true,
    });
  };

  setDelayOff = () => {
    this.setState({
      isDelayActive: false,
    });
  };

  toggleShow = () => {
    const { showModal } = this.state;
    this.setState({
      showModal: !showModal,
      recorded: [],
    });
  };

  cleanRecorded = recorded => {
    log.info("Clean recorded", recorded);
    const newRecorded = [];
    for (let i = 1; i < recorded.length; i += 1) {
      const p = i - 1;
      log.info(`pressed key: ${recorded[i].char}`, recorded[p], recorded[i]);
      if (recorded[p].keyCode > 223 && recorded[p].keyCode < 232) {
        log.info(`Modifier detected: ${recorded[p].char}`);
        newRecorded.push(JSON.parse(JSON.stringify(recorded[p])));
        continue;
      }
      if (recorded[p].keycode === recorded[i].keycode && recorded[p].action === 6 && recorded[i].action === 7) {
        log.info(
          `pressRelease joining ${recorded[i].char} as 1 with ${recorded[p].action} as p action and ${recorded[i].action} as i action, being i:${i}, and p:${p}`,
        );
        newRecorded.push(JSON.parse(JSON.stringify(recorded[p])));
        newRecorded[newRecorded.length - 1].action = 8;
        i += 1;
        log.info("state of i", i);
        if (i >= recorded.length - 1) {
          newRecorded.push(recorded[recorded.length - 1]);
        }
        continue;
      }
      log.info(`Added as end of interaction ${recorded[p].char} to the rest of the elems`);
      newRecorded.push(recorded[p]);
      if (i === recorded.length - 1) {
        newRecorded.push(recorded[i]);
      }
    }
    if (
      newRecorded[newRecorded.length - 1].keycode === newRecorded[newRecorded.length - 2].keycode &&
      newRecorded[newRecorded.length - 2].action === 8 &&
      newRecorded[newRecorded.length - 1].action < 8
    )
      newRecorded.pop();
    log.info("Checking cleaned", newRecorded);
    return newRecorded;
  };

  sendMacro = () => {
    const { recorded, isRecording } = this.state;
    if (isRecording) {
      ipcRenderer.send("stop-recording", "");
    }
    this.props.onAddRecorded(this.cleanRecorded(recorded));
    this.toggleShow();
  };

  render() {
    const { showModal, isRecording, isDelayActive, recorded } = this.state;
    return (
      <div>
        <Button
          className="w-full rounded-regular !text-ssm !text-left !justify-start font-semibold py-[12px] pl-[8px] pr-[12px] bg-gray-25/25 hover:bg-gray-25/100 text-gray-500 hover:text-gray-600 dark:bg-gray-800/40 dark:hover:bg-gray-800/60 dark:text-gray-50 dark:hover:text-gray-25 transition-all relative flex gap-2 items-center mb-[2px] whitespace-nowrap [&_svg]:text-gray-300 [&:hover_svg]:text-primary/100 [&_svg]:transition-all"
          onClick={this.toggleShow}
          icon={<IconRecord />}
          iconDirection="left"
        >
          {i18n.editor.macros.recordMacro}
        </Button>
        <Dialog
          open={showModal}
          onOpenChange={this.toggleShow}
          className="modal modal-recordMacro focus:outline-none focus-visible:outline-none focus:border-none focus-visible:border-none"
        >
          <DialogContent
            className="modal-recordMacro focus:outline-none focus-visible:outline-none focus:border-none focus-visible:border-none"
            onInteractOutside={e => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className="flex justify-center text-center">
                {isRecording ? i18n.editor.macros.recordingMacro : i18n.editor.macros.recordMacro}
              </DialogTitle>
            </DialogHeader>
            <div className="px-0 pb-2 mt-2">
              <div className="recordMacroOptions flex items-center justify-center gap-2 mb-2">
                <Heading headingLevel={5} renderAs="h5">
                  {i18n.editor.macros.delays}
                </Heading>
                <div className="recordMacroButtons flex items-center gap-2">
                  <Button
                    variant="config"
                    size="sm"
                    onClick={this.setDelayOff}
                    disabled={isRecording}
                    selected={!isDelayActive}
                    className="flex gap-2"
                  >
                    <IconStopwatchCrossed />
                    {i18n.editor.macros.ignoreDelays}
                  </Button>
                  <Button
                    variant="config"
                    size="sm"
                    onClick={this.setDelayOn}
                    disabled={isRecording}
                    selected={isDelayActive}
                    className="flex gap-2"
                  >
                    <IconStopWatch />
                    {i18n.editor.macros.recordDelays}
                  </Button>
                </div>
              </div>
              <div className="timelineRecordTracking">
                {recorded.length === 0 ? (
                  <div className="timelineRecordSequence">...</div>
                ) : (
                  <div className={`timelineRecordSequence ${isRecording ? "isRecording" : "isPaused"}`}>
                    <div className="timelineRecordSequenceInner">
                      {recorded.map(item => {
                        let newItem = item.char;
                        if (item.action === 2) return "";
                        if (item.action === 6) newItem += "↓";
                        if (item.action === 7) newItem += "↑";
                        return newItem;
                      })}
                    </div>
                    <div className="timelinePointeText" />
                  </div>
                )}

                <AnimatedTimelineRecording isRecording={isRecording} />
              </div>
              <div className="recordMacrosButton flex justify-center gap-2 items-center -mt-6">
                {recorded.length > 0 ? (
                  <div className="ml-[-50px] relative z-10">
                    <TooltipProvider delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button variant="config" size="icon" onClick={this.undoRecording} className="!rounded-full">
                              <IconUndoRestart />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs" size="sm">
                          {i18n.editor.macros.recordingDiscard}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  ""
                )}

                <Button
                  className={`border-solid border-[3px] border-primary/100 bg-gray-25/50 hover:bg-gray-25/100 dark:bg-gray-700/30 dark:hover:bg-gray-700/60 rounded-[32px] w-[204px] relative z-[3] recordButton backdrop-blur-sm font-bold !text-primary/100 ${isRecording ? "isRecording" : ""} ${
                    recorded.length > 0 && !isRecording ? "isResume text-primary/100" : "text-primary/100"
                  }`}
                  onClick={this.toggleIsRecording}
                  ref={this.buttonRecord}
                >
                  {recorded.length === 0 && !isRecording ? (
                    i18n.editor.macros.startRecord
                  ) : isRecording ? (
                    <IconPause size="xl" />
                  ) : (
                    "Resume"
                  )}
                </Button>
              </div>
              <div className="tabSaveButton w-full flex justify-center mt-4 mb-4">
                <Button
                  icon={<IconArrowInBoxDown />}
                  iconDirection="right"
                  variant="secondary"
                  disabled={!!(recorded.length === 0 || isRecording)}
                  onClick={this.sendMacro}
                >
                  {i18n.editor.macros.textTabs.buttonText}
                </Button>
              </div>
              <p className="recordingMessage">{i18n.editor.macros.recordingMessage}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
