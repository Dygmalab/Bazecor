import React, { useMemo } from "react";
import { FaLinux } from "react-icons/fa";
import { AiFillWindows } from "react-icons/ai";
import { IconCommandMacOs } from "@Renderer/components/atoms/icons";

type OperationSystemKey = "shift" | "control" | "os" | "alt" | "altGr";

interface OSKeyProps {
  renderKey: OperationSystemKey;
  direction?: "Left" | "Right";
  size?: "sm" | "md";
}

// Define the type for the icons object
interface OperationSystemIcons {
  shift: {
    sm: string;
    md: string;
  };
  control: {
    sm: string;
    md: string;
  };
  os: {
    sm: React.ReactNode;
    md: React.ReactNode;
  };
  alt: {
    sm: string;
    md: string;
  };
  altGr: {
    sm: string;
    md: string;
  };
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
          sm: "Shift",
          md: "Shift",
        },
        control: {
          sm: "Ctrl ⌃",
          md: "Ctrl ⌃",
        },
        os: {
          sm: <IconCommandMacOs />,
          md: <IconCommandMacOs />,
        },
        alt: {
          sm: "⌥",
          md: "⌥",
        },
        altGr: {
          sm: "R. ⌥",
          md: "Right ⌥",
        },
      };
    }
    if (operationSystem === "win32") {
      return {
        shift: {
          sm: "Shift",
          md: "Shift",
        },
        control: {
          sm: "Ctrl",
          md: "Ctrl",
        },
        os: {
          sm: <AiFillWindows size={16} />,
          md: <AiFillWindows size={16} />,
        },
        alt: {
          sm: "Alt",
          md: "Alt",
        },
        altGr: {
          sm: "Alt Gr.",
          md: "Alt Gr.",
        },
      };
    }
    return {
      shift: {
        sm: "Shift",
        md: "Shift",
      },
      control: {
        sm: "Ctrl",
        md: "Ctrl",
      },
      os: {
        sm: <FaLinux />,
        md: <FaLinux />,
      },
      alt: {
        sm: "Alt",
        md: "Alt",
      },
      altGr: {
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
