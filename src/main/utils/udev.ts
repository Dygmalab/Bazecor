import { BrowserWindow, dialog, MessageBoxOptions } from "electron";
import fs from "fs";
import * as sudo from "sudo-prompt";
import log from "electron-log/main";
import path from "path";

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

const udevRuleFilename = "60-dygma.rules";

// https://www.freedesktop.org/software/systemd/man/latest/udev.html
const udevRuleDirLookup = [
  "/usr/lib/udev/rules.d/", // system rules
  "/usr/local/lib/udev/rules.d/", // system rules (alternative)
  "/run/udev/rules.d/", // volatile runtime rules
  "/etc/udev/rules.d", // local administration rules
  "/run/host/etc/udev/rules.d", // FYI: flatpak-builder `--filesystem=host-etc` bind-mounts `/etc/` to `/run/host/etc/`.
];

const hostUdevRuleFilePath = path.join("/etc/udev/rules.d", udevRuleFilename);

const checkUdev = () => {
  try {
    for (const dir of udevRuleDirLookup) {
      const filename = path.join(dir, udevRuleFilename);
      if (fs.existsSync(filename)) {
        const currentUdevRules = fs.readFileSync(filename, "utf-8");
        if (currentUdevRules.trim() === udevRulesToWrite.trim()) {
          return true;
        }
      }
    }
  } catch (err) {
    log.error(err);
  }
  return false;
};

const showMissingPolkitErrorDialog = (mainWindow: BrowserWindow, error: any) => {
  log.verbose(`stdout: ${error.message}`);

  const command = `sudo tee ${hostUdevRuleFilePath} > /dev/null << 'UDEV_RULES_EOF'
${udevRulesToWrite}
UDEV_RULES_EOF
sudo udevadm control --reload-rules
sudo udevadm trigger`;

  mainWindow.webContents.send("udev-polkit-error", { errorMessage: error.message, command });
};

const installUdev = (mainWindow: BrowserWindow) => {
  const options = {
    name: "Install Udev rules",
    icns: "./build/icon.icns",
  };
  const dialogOpts: MessageBoxOptions = {
    type: "question",
    buttons: ["Ignore", "Install"],
    cancelId: 0,
    defaultId: 1,
    title: "Udev rules Installation",
    message: "Bazecor lacks write access to your Dygma keyboard",
    detail: "Press install to set up the required Udev Rules, then scan keyboards again.",
  };
  dialog.showMessageBox(mainWindow, dialogOpts).then(response => {
    if (response.response === 1) {
      sudo.exec(
        `echo '${udevRulesToWrite}' > ${hostUdevRuleFilePath} && udevadm control --reload-rules && udevadm trigger`,
        options,
        error => {
          if (error !== undefined) {
            showMissingPolkitErrorDialog(mainWindow, error);
          }
        },
      );
    }
  });
};

export { checkUdev, installUdev };
