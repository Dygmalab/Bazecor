import React, { useMemo } from "react";
import { FaLinux } from "react-icons/fa";
import { AiFillWindows } from "react-icons/ai";
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

interface OSKeyProps {
  renderKey: string;
}

const GuiLabels: { [key: string]: string } = {
  linux: "LINUX",
  win32: "WIN",
  darwin: "⌘",
};

const GuiVerboses: { [key: string]: string } = {
  linux: "Linux",
  win32: "Windows",
  darwin: "Command",
};

const AltLabels: { [key: string]: string } = {
  linux: "ALT",
  win32: "ALT",
  darwin: "⌥",
};

const AltVerboses: { [key: string]: string } = {
  linux: "Alt",
  win32: "Alt",
  darwin: "Option",
};

const guiLabel = GuiLabels[process.platform] || "Gui";
const guiVerbose = GuiVerboses[process.platform] || "Gui";
const AltLabel = AltLabels[process.platform] || "ALT";
const AltVerbose = AltVerboses[process.platform] || "Alt";

const OSKey = ({ renderKey }: OSKeyProps) => {
  const operationSystem = process.platform;
  const operationSystemIcons = useMemo(() => {
    if (operationSystem === "darwin") {
      return {
        shift: "Shift",
        control: "Control ^",
        os: {
          icon: false,
          text: "⌘",
        },
        alt: "⌥",
        altGr: "Right ⌥",
      };
    }
    if (operationSystem === "win32") {
      return {
        shift: "Shift",
        control: "Control",
        os: {
          icon: <AiFillWindows />,
          text: false,
        },
        alt: "Alt",
        altGr: "Alt Gr.",
      };
    }
    return {
      shift: "Shift",
      control: "Control",
      os: {
        icon: <FaLinux />,
        text: false,
      },
      alt: "Alt",
      altGr: "Alt Gr.",
    };
  }, [operationSystem]);
  const { platform } = process;
  // win32, darwin, linux
  console.log(platform);
  return <div className="whitespace-nowrap">{operationSystemIcons[renderKey]}</div>;
};

export default OSKey;
