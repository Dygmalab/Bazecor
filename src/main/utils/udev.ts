import { BrowserWindow, dialog, MessageBoxOptions } from "electron";
import fs from "fs";
import * as sudo from "sudo-prompt";

const checkUdev = () => {
  const filename = "/etc/udev/rules.d/10-dygma.rules";

  try {
    if (fs.existsSync(filename)) {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const installUdev = (mainWindow: BrowserWindow) => {
  const options = {
    name: "Install Udev rules",
    icns: "./build/icon.icns",
  };
  const dialogOpts: MessageBoxOptions = {
    type: "question",
    buttons: ["Cancel", "Install"],
    cancelId: 0,
    defaultId: 1,
    title: "Udev rules Installation",
    message: "Bazecor lacks write access to your Raise keyboard",
    detail: "Press install to set up the required Udev Rules, then scan keyboards again.",
  };
  dialog.showMessageBox(mainWindow, dialogOpts).then(response => {
    if (response.response === 1) {
      sudo.exec(
        `echo 'SUBSYSTEMS=="usb", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="2201", GROUP="users", MODE="0666"\nSUBSYSTEMS=="usb", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="2200", GROUP="users", MODE="0666"' > /etc/udev/rules.d/10-dygma.rules && udevadm control --reload-rules && udevadm trigger`,
        options,
        error => {
          if (error !== null) {
            console.log(`stdout: ${error.message}`);
            const errorOpts: MessageBoxOptions = {
              type: "error",
              buttons: ["Ok"],
              defaultId: 0,
              title: "Error when launching sudo prompt",
              message: "An error happened when launching a sudo prompt window",
              detail: `Your linux distribution lacks a polkit agent, installing polkit-1-auth-agent, policykit-1-gnome, or polkit-kde-1 (depending on your desktop manager) will solve this problem\n\n${error.message}`,
            };
            dialog.showMessageBox(mainWindow, errorOpts);
          }
        },
      );
    }
  });
};

export { checkUdev, installUdev };
