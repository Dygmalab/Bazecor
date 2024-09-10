import React, { useMemo } from "react";
import { FaLinux } from "react-icons/fa";
import { AiFillWindows } from "react-icons/ai";
import { IconCommandMacOs } from "@Renderer/components/atoms/icons";
import { OperationSystemIcons } from "@Types/layout";

type OperationSystemKey = "shift" | "control" | "os" | "alt" | "altGr";

interface OSKeyProps {
  renderKey: OperationSystemKey;
  direction?: "Left" | "Right";
  size?: "xs" | "sm" | "md";
}

// const GuiLabels: { [key: string]: string } = {
//   linux: "LINUX",
//   win32: "WIN",
//   darwin: "⌘",
// };

// const GuiVerboses: { [key: string]: string } = {
//   linux: "Linux",
//   win32: "Windows",
//   darwin: "Command",
// };

// const AltLabels: { [key: string]: string } = {
//   linux: "ALT",
//   win32: "ALT",
//   darwin: "⌥",
// };

// const AltVerboses: { [key: string]: string } = {
//   linux: "Alt",
//   win32: "Alt",
//   darwin: "Option",
// };

// const guiLabel = GuiLabels[process.platform] || "Gui";
// const guiVerbose = GuiVerboses[process.platform] || "Gui";
// const AltLabel = AltLabels[process.platform] || "ALT";
// const AltVerbose = AltVerboses[process.platform] || "Alt";

const OSKey = ({ renderKey, direction, size = "md" }: OSKeyProps) => {
  const operationSystem = process.platform;
  const operationSystemIcons = useMemo<OperationSystemIcons>(() => {
    if (operationSystem === "darwin") {
      return {
        shift: {
          xs: "s",
          sm: "Shift",
          md: "Shift",
        },
        control: {
          xs: "c",
          sm: "CTRL ^",
          md: "Control ^",
        },
        os: {
          xs: "⌘",
          sm: <IconCommandMacOs />,
          md: <IconCommandMacOs />,
        },
        alt: {
          xs: "⌥",
          sm: "⌥",
          md: "⌥",
        },
        altGr: {
          xs: "r.⌥",
          sm: "R. ⌥",
          md: "Right ⌥",
        },
      };
    }
    if (operationSystem === "win32") {
      return {
        shift: {
          xs: "s",
          sm: "Shift",
          md: "Shift",
        },
        control: {
          xs: "c",
          sm: "CTRL",
          md: "Control",
        },
        os: {
          xs: <AiFillWindows size={10} />,
          sm: <AiFillWindows />,
          md: <AiFillWindows />,
        },
        alt: {
          xs: "a",
          sm: "Alt",
          md: "Alt",
        },
        altGr: {
          xs: "aGr",
          sm: "Alt Gr.",
          md: "Alt Gr.",
        },
      };
    }
    return {
      shift: {
        xs: "s",
        sm: "Shift",
        md: "Shift",
      },
      control: {
        xs: "c",
        sm: "CTRL",
        md: "Control",
      },
      os: {
        xs: <FaLinux size={10} />,
        sm: <FaLinux />,
        md: <FaLinux />,
      },
      alt: {
        xs: "a",
        sm: "Alt",
        md: "Alt",
      },
      altGr: {
        xs: "aGr",
        sm: "Alt Gr.",
        md: "Alt Gr.",
      },
    };
  }, [operationSystem]);

  // win32, darwin, linux
  // console.log(platform);
  return (
    <div className="whitespace-nowrap flex gap-0.5 items-center">
      {renderKey !== "altGr" && direction && size === "md" ? `${direction} ` : null}
      {renderKey !== "altGr" && direction === "Left" && size === "sm" ? "L. " : null}
      {renderKey !== "altGr" && direction === "Right" && size === "sm" ? "R. " : null}
      {operationSystemIcons[renderKey][size]}
    </div>
  );
};

export default OSKey;
