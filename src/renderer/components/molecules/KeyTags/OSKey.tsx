import React, { useMemo } from "react";
import { FaLinux } from "react-icons/fa";
import { AiFillWindows } from "react-icons/ai";
import { IconCommandMacOs } from "@Renderer/components/atoms/icons";

type OperationSystemKey = "shift" | "control" | "os" | "alt" | "altGr";

interface OSKeyProps {
  renderKey: OperationSystemKey;
  direction?: "Left" | "Right";
  size?: "xs" | "sm" | "md";
}

// Define the type for the icons object
interface OperationSystemIcons {
  shift: {
    xs: string;
    sm: string;
    md: string;
  };
  control: {
    xs: string;
    sm: string;
    md: string;
  };
  os: {
    xs: React.ReactNode;
    sm: React.ReactNode;
    md: React.ReactNode;
  };
  alt: {
    xs: string;
    sm: string;
    md: string;
  };
  altGr: {
    xs: string;
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
          xs: <IconCommandMacOs />,
          sm: <IconCommandMacOs />,
          md: <IconCommandMacOs />,
        },
        alt: {
          xs: "⌥",
          sm: "⌥",
          md: "⌥",
        },
        altGr: {
          xs: "R.⌥",
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
          xs: <AiFillWindows />,
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
        xs: <FaLinux />,
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
