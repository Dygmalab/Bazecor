import { BrowserWindow, dialog, MessageBoxOptions } from "electron";
import fs from "fs";
import { execSync, spawn } from "child_process";
import * as sudo from "sudo-prompt";
import log from "electron-log/main";

const udevRulesToWrite = `\
# Dygma Raise
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="2200", MODE="0660", TAG+="uaccess"
# bootloader mode
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="2201", MODE="0660", TAG+="uaccess"

# Dygma USB Keyboards Vendor ID
SUBSYSTEMS=="usb", ATTRS{idVendor}=="35ef", MODE="0660", TAG+="uaccess"
# bootloader mode
SUBSYSTEMS=="usb", ATTRS{idVendor}=="35ef", MODE="0660", TAG+="uaccess"

# Dygma HID Keyboards Vendor ID
KERNEL=="hidraw*", ATTRS{idVendor}=="35ef", MODE="0660", TAG+="uaccess"
# bootloader mode
KERNEL=="hidraw*", ATTRS{idVendor}=="35ef", MODE="0660", TAG+="uaccess"
`;

const filename = "/etc/udev/rules.d/60-dygma.rules";

// Known polkit agent binaries in preference order (lightweight agents first)
const POLKIT_AGENT_PATHS = [
  "/usr/bin/lxpolkit",
  "/usr/bin/xfce-polkit",
  "/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1",
  "/usr/libexec/polkit-gnome-authentication-agent-1",
  "/usr/lib/polkit-gnome-authentication-agent-1",
  "/usr/libexec/kf6/polkit-kde-authentication-agent-1",
  "/usr/lib/polkit-kde-authentication-agent-1",
  "/usr/libexec/hyprpolkitagent",
  "/usr/lib/hyprpolkitagent",
];

const DISTRO_HINTS: Array<{ ids: string[]; cmd: string }> = [
  { ids: ["fedora", "rhel", "centos"],       cmd: "sudo dnf install lxpolkit" },
  { ids: ["arch", "manjaro", "endeavouros"], cmd: "sudo pacman -S lxsession" },
  { ids: ["debian", "ubuntu", "linuxmint"],  cmd: "sudo apt install policykit-1-gnome" },
  { ids: ["opensuse", "suse"],               cmd: "sudo zypper install lxpolkit" },
];

const FALLBACK_HINT = "install a polkit agent for your desktop environment (e.g. lxpolkit)";

const checkUdev = () => {
  try {
    if (fs.existsSync(filename)) {
      const currentUdevRules = fs.readFileSync(filename, "utf-8");
      if (currentUdevRules.trim() !== udevRulesToWrite.trim()) {
        return false;
      }
      return true;
    }
  } catch (err) {
    log.error(err);
  }
  return false;
};

const isPolkitAgentRunning = (): boolean => {
  try {
    execSync(`pgrep -f "polkit.*agent|lxpolkit|hyprpolkitagent|xfce-polkit"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
};

const tryStartPolkitAgent = (): boolean => {
  for (const agentPath of POLKIT_AGENT_PATHS) {
    if (fs.existsSync(agentPath)) {
      try {
        spawn(agentPath, [], { detached: true, stdio: "ignore" }).unref();
        log.info(`Auto-started polkit agent: ${agentPath}`);
        return true;
      } catch (err) {
        log.warn(`Failed to start polkit agent at ${agentPath}:`, err);
      }
    }
  }
  return false;
};

const getDistroInstallHint = (): string => {
  try {
    const osRelease = fs.readFileSync("/etc/os-release", "utf-8");
    const id = osRelease.match(/^ID=(.+)$/m)?.[1]?.replace(/"/g, "").toLowerCase() ?? "";
    const idLike = osRelease.match(/^ID_LIKE=(.+)$/m)?.[1]?.replace(/"/g, "").toLowerCase() ?? "";
    const match = DISTRO_HINTS.find(({ ids }) => ids.some(d => id === d || idLike.includes(d)));
    return match?.cmd ?? FALLBACK_HINT;
  } catch {
    return FALLBACK_HINT;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const installUdev = async (mainWindow: BrowserWindow) => {
  const dialogOpts: MessageBoxOptions = {
    type: "question",
    buttons: ["Ignore", "Install"],
    cancelId: 0,
    defaultId: 1,
    title: "Udev rules Installation",
    message: "Bazecor lacks write access to your Dygma keyboard",
    detail: "Press install to set up the required Udev Rules, then scan keyboards again.",
  };

  const response = await dialog.showMessageBox(mainWindow, dialogOpts);
  if (response.response !== 1) return;

  if (!isPolkitAgentRunning()) {
    const started = tryStartPolkitAgent();
    if (started) {
      // Give the agent time to register on D-Bus before pkexec tries to use it.
      await sleep(1500);
    } else {
      const hint = getDistroInstallHint();
      dialog.showMessageBox(mainWindow, {
        type: "error",
        buttons: ["Ok"],
        defaultId: 0,
        title: "No polkit agent found",
        message: "Cannot request administrator privileges",
        detail: `No polkit authentication agent is installed or running. Bazecor needs one to write udev rules.\n\nTo fix this, open a terminal and run:\n  ${hint}\n\nThen start the agent and relaunch Bazecor.`,
      });
      return;
    }
  }

  const options = {
    name: "Install Udev rules",
    icns: "./build/icon.icns",
  };

  sudo.exec(
    `echo '${udevRulesToWrite}' > ${filename} && udevadm control --reload-rules && udevadm trigger`,
    options,
    error => {
      if (error !== null) {
        log.verbose(`stdout: ${error.message}`);
        const hint = getDistroInstallHint();
        const errorOpts: MessageBoxOptions = {
          type: "error",
          buttons: ["Ok"],
          defaultId: 0,
          title: "Error when launching sudo prompt",
          message: "An error happened when launching a sudo prompt window",
          detail: `Could not authenticate. A polkit agent may not be running or may have failed to start.\n\nTo fix this, open a terminal and run:\n  ${hint}\n\nThen start the agent and relaunch Bazecor.\n\n${error.message}`,
        };
        dialog.showMessageBox(mainWindow, errorOpts);
      }
    },
  );
};

export { checkUdev, installUdev };
