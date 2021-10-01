// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

const English = {
  language: "English",
  errors: {
    deviceDisconnected: "Keyboard disconnected",
    invalidLayerFile: "Not a valid Layer file",
    exportError: "Error at Exporting: "
  },
  components: {
    layer: "Layer {0}",
    save: {
      success: "Sent!",
      saveChanges: "Send changes to the Raise",
      savePreferences: "Save preferences"
    },
    pickerColorButton: "Change color",
    underglowColorButton: "Change color of all underglows",
    keysColorButton: "Change color of all keys"
  },
  dialog: {
    ok: "Ok",
    cancel: "Cancel",
    allFiles: "All Files"
  },
  app: {
    device: "Keyboard",
    menu: {
      comingSoon: "Coming soon...",
      welcome: "Welcome",
      editor: "Layout Editor",
      macros: "Macro Editor",
      firmwareUpdate: "Firmware Update",
      keyboardSettings: "Keyboard Settings",
      preferences: "Preferences",
      selectAKeyboard: "Keyboard Selector",
      selectAnotherKeyboard: "Select another keyboard",
      softwareUpdate: "Software update",
      supportPage: "Bazecor support page",
      feedback: "Send feedback",
      exit: "Exit Bazecor",
      keyboardSection: "Raise",
      keyboardTitle: "WELCOME TO BAZECOR,",
      keyboardTitleSecondary: "DYGMA RAISE CONFIGURATOR.",
      bazecorSection: "Bazecor",
      miscSection: "Miscellaneous",
      upgradeAvailable: "An upgrade is available!"
    },
    deviceMenu: {
      Homepage: "Homepage",
      Forum: "Forum",
      Chat: "Chat"
    },
    cancelPending: {
      button: "Discard Changes",
      title: "Cancel pending changes?",
      content: "You have unsaved changes. If you proceed, they will be lost."
    }
  },
  editor: {
    keyType: "Key type",
    keyCode: "Key code",
    searchForKeyOrCategory: "Search for a key or category",
    keyConfig: "Key Config",
    keySelectorTitle: "Select Key",
    layers: {
      importTitle: "Import current layer or backup",
      exportTitle: "Export the current layer",
      exportAllTitle: "Backup all layers (Excluding Macros)",
      clearLayer: "Clear layer",
      copyFrom: "Copy from layer"
    },
    groups: {
      Letters: "Letters",
      Digits: "Digits",
      Punctuation: "Punctuation",
      Spacing: "Spacing",
      Modifiers: "Modifiers",
      Navigation: "Navigation",
      "Fx keys": "Fx keys",
      Numpad: "Numpad",
      Miscellaneous: "Miscellaneous",
      "Shift to layer": "Shift to layer",
      "Lock layer to": "Lock layer to",
      "LED Effect": "LED Effect",
      Macros: "Macros",
      Media: "Media",
      "Mouse movement": "Mouse movement",
      "Mouse button": "Mouse button",
      "Mouse wheel": "Mouse wheel",
      "Mouse warp": "Mouse warp",
      "OneShot modifiers": "OneShot modifiers",
      "OneShot layers": "OneShot layers",
      TapDance: "TapDance",
      Leader: "Leader",
      Steno: "Steno",
      SpaceCadet: "SpaceCadet",
      Blank: "Blank",
      "Unknown keycodes": "Unknown keycodes"
    },
    macros: {
      add: "Add new macro",
      applyAndExit: "Apply",
      saveName: "Save name",
      backup: "Backup All",
      backupMacro: "Backup Macros",
      backupMacroFile: "Backup Macros to file",
      copy: "Copy",
      editMacros: "Edit macros",
      delay: "Delay",
      delete: "Delete",
      errorExport: "The file is not a valid macro export",
      export: "Export",
      functions: "Functions",
      import: "Import",
      inputText: "Input Text",
      inputTextBox: "Type text into Macro editor",
      insertModifiers: "Add Modifier",
      keysAndDelays: "Keys & Delay",
      loadMacro: "Load Macros",
      loadMacroFile: "Load Macro file",
      macroName: "Macro Name",
      macroShort: "Macro Short",
      mouse: "Mouse",
      restore: "Restore All",
      restoreMacros: "Restore Macros",
      restoreMacrosFile: "Restore Macros file",
      save: "Save",
      saveMacros: "Save Macros",
      saveMacrosFile: "Save Macros file",
      selectAction: "Select Action",
      selectFunction: "Select Function",
      selectKey: "Select Key",
      selectMacro: "Select a Macro",
      selectMouseFunction: "Select Mouse Function",
      title: "Macro Editor",
      successFlash: "Succesfully sent the macros to the Raise",
      deleteModal: {
        title: "This macro is in use",
        body: "The macro you want to delete is currently in use, select how to proceed, THIS MAKES PERMANENT CHANGES.",
        cancelButton: "Cancel",
        applyButton: "Update Keyboard"
      }
    },
    oldMacroModal: {
      title: "Update your macros",
      body: "The macros in your layout need to be updated to work on this Bazecor version.",
      body2:
        "Please note that the updated macro codes won't work until you flash the new firmware",
      cancelButton: "Cancel",
      applyButton: "Update Macros"
    },
    clearLayerQuestion: "Clear layer?",
    clearLayerPrompt: "This will reset the layer to its default state.",
    pleaseSelectLayer: "Please select a layer",
    dualUse: "Modifier when held, normal key otherwise",
    dualUseLayer: "Layer shift when held, normal key otherwise",
    layoutMode: "Edit the keyboard layout",
    colormapMode: "Edit the colormap",
    importExport: "Import/Export the current layer",
    importExportDescription:
      "The data below can be freely edited, or copied elsewhere to be pasted back for importing. This is the internal representation of Bazecor state, handle with care.",
    loadDefault: "Load a default:",
    copyToClipboard: "Copy to clipboard",
    copySuccess: "Copied!",
    pasteFromClipboard: "Paste from clipboard",
    pasteSuccess: "Pasted!",
    importSuccessCurrentLayer: "Imported to current Layer succesfully",
    importSuccessAllLayers: "Imported all Layers succesfully",
    exportSuccessCurrentLayer: "Export Successful",
    exportSuccessAllLayers: "Exported all Layers succesfully"
  },
  preferences: {
    devtools: "Chrome Tools",
    language: "Select language",
    interface: "Interface",
    tooltips: {
      language: ""
    },
    advanced: "ADVANCED",
    verboseFocus: "Verbose logging",
    darkMode: {
      label: "Appearance",
      light: "Light",
      dark: "Dark",
      system: "System"
    }
  },
  keyboardSettings: {
    advanced: "Advanced",
    defaultLabel: "default",
    backupFolder: {
      header: "BACKUPS",
      title: "Backup folder",
      restoreTitle: "Select a backup to restore",
      loadWindowTitle: "Choose backup folder",
      windowButton: "Select",
      windowRestore: "Restore",
      selectButtonText: "Change",
      restoreButtonText: "Restore backup",
      storeTime: "Backup storage period",
      storeTimeTip:
        "Determines how long a backup is stored before being deleted"
    },
    keymap: {
      title: "GENERAL",
      noDefault: "No default",
      showHardcoded: "Show hardcoded layers",
      onlyCustom: "Use custom layers only",
      defaultLayer: "Default layer"
    },
    led: {
      title: "LED",
      brightness: "LED brightness",
      brightnesssub: " - From 0 to 254",
      idleDisabled: "Disabled",
      idleTimeLimit: "Time before LEDs turn off",
      idle: {
        oneMinute: "1 minute",
        twoMinutes: "2 minutes",
        threeMinutes: "3 minutes",
        fourMinutes: "4 minutes",
        fiveMinutes: "5 minutes",
        tenMinutes: "10 minutes",
        fifteenMinutes: "15 minutes",
        twentyMinutes: "20 minutes",
        thirtyMinutes: "30 minutes",
        oneHour: "1 hour"
      }
    },
    qukeys: {
      title: "DUAL FUNCTION KEY PARAMETERS",
      holdTimeout: "Adjust time to start 'when held' action",
      holdTimeoutsub: " - From 0 to 65,534 milliseconds",
      overlapThreshold:
        "Adjust overlap threshold between dual-function key and subsequent key",
      overlapThresholdsub: " - Percentage from 0 to 100"
    },
    superkeys: {
      title: "TYPING",
      timeout: "Typing speed",
      timeoutTip1: "This setting only affects Layer&Key and Superkeys.",
      timeoutTip2:
        "- If you select a slow typing speed, some functions of Layer&Key and Superkeys will take slightly more time to trigger.",
      timeoutTip3:
        "- For example, holding the key to switch to a layer or activate a modifier (like Shift, Control...).",
      timeoutTip4:
        "- If you choose a fast typing speed, you might activate those actions by mistake if you 'linger' too much on the key.",
      chordingTip1: "This setting only affects Layer&Key.",
      chordingTip2:
        "Let's say you have a Layer&Key with 'Layer 1' on hold and 'Space' on tap.",
      chordingTip3:
        "- If the slider is at 'None' and you press another key before completely releasing the Space, this will trigger the hold function.",
      chordingTip4:
        "- If the slider is at 'High', it'll take a bit more time for the hold function to activate.",
      repeat:
        "Adjust repeat time interval between the emmision of holded keys after waitfor period. (this doesn't affect all keys)",
      repeatsub: " - time from 0 to 254 milliseconds",
      waitfor:
        "Adjust time between first and subsequent emmisions of the hold keys",
      waitforsub: " - time from 0 to 65,534 milliseconds",
      holdstart: "Chording while typing",
      holdstartsub: " - time from 0 to 65,534 milliseconds",
      overlap:
        "Adjust percentage that changes the way the hold function will trigger depending on the typing speed of the previous normal key",
      overlapsub: " - Percentage from 0 to 100"
    },
    mouse: {
      title: "MOUSE KEYS",
      subtitle1: "MOUSE SPEED",
      speed: "Cursor speed",
      speedsub: " - From 0 to 254 pixels",
      speedDelay:
        "Delay between steps (the higher the number, the slower the mouse movement)",
      speedDelaysub: " - From 0 to 65,534 milliseconds",
      speedLimit: "Maximum cursor speed",
      speedLimitsub: " - From 0 to 254 pixels",
      subtitle2: "MOUSE ACCELERATION",
      accelSpeed: "Cursor acceleration",
      accelSpeedsub: " - From 0 to 254 pixels",
      accelDelay:
        "Acceleration delay between steps (the higher the number, the slower the mouse movement)",
      accelDelaysub: " - From 0 to 65,534 milliseconds",
      subtitle3: "WHEEL SPEED",
      wheelSpeed: "Wheel speed",
      wheelSpeedsub: " - From 0 to 254 pixels",
      wheelDelay:
        "Wheel delay between steps (the higher the number, the slower the mouse movement)",
      wheelDelaysub: " - From 0 to 65,534 milliseconds"
    },
    colorSettings: {
      title: "White Balance",
      visualizebutton: "VISUALIZE CHANGES",
      test: {
        quit: "Quit Test Mode",
        enter: "Enter Test Mode"
      },
      red: "Red Color",
      green: "Green Color",
      blue: "Blue Color"
    },
    advancedOps: "Advanced keyboard settings & operations",
    resetEEPROM: {
      button: "Reset keyboard to factory settings",
      dialogTitle: "Reset EEPROM to factory defaults?",
      dialogContents: `This will reset the EEPROM to factory defaults.
 You will lose all customizations made.`
    }
  },
  keyboardSelect: {
    unknown: "Unknown",
    selectPrompt: "Please select a keyboard:",
    noDevices: "No keyboards found!",
    connect: "Connect",
    disconnect: "Disconnect",
    scan: "Scan keyboards",
    installUdevRules: "Fix it",
    permissionError: `Your computer won't let BAZECOR talk to your keyboard. (You do not have read/write permissions to {{path}}.)`,
    permissionErrorSuggestion: `BAZECOR can fix this by installing a udev rules file into /etc/udev/rules.d/.`
  },
  firmwareUpdate: {
    texts: {
      advUsers: "Advanced",
      cstomFW: "Custom Firmware",
      backwds: "Back",
      cancel: "Cancel"
    },
    milestones: {
      backup: "Next",
      esc: "Press and mantain esc",
      flash: "Uploading ...",
      restore: "Done, Restoring ..."
    },
    dialog: {
      selectFirmware: "Select a firmware",
      firmwareFiles: "Firmware files",
      allFiles: "All files"
    },
    flashing: {
      error: "Error flashing the firmware",
      troubleshooting: "Troubleshooting",
      success: "Firmware flashed successfully!",
      button: "Next",
      buttonSuccess: "Updated!"
    },
    backupSuccessful: "Backup created successfully!",
    defaultFirmware: "Bazecor {0} default",
    defaultFirmwareDescription: "Minimal, without bells and whistles",
    experimentalFirmware: "Bazecor {0} experimental",
    experimentalFirmwareDescription: "Experimental, with more plugins enabled",
    selected: "Selected firmware",
    custom: "Load custom FW",
    rcustom: "Remove custom FW",
    description: `To install new features in your Raise we need to update the firmware. By clicking on the Update button, Bazecor will install a new version of your keyboard's firmware. This will overwrite your previous firmware.

To correctly update the firmware, your Raise has to be on LED Rainbow mode.

You can find the LED Rainbow mode with the "LED Next" key. In the default Dygma layout, you can find it by pressing the right Dygma key.`,
    raise: {
      reset: `Firmware Update Process`
    }
  },
  welcome: {
    title: "Welcome to Bazecor",
    contents: `Bazecor recognizes your keyboard, but needs to update its firmware before you can continue.`,
    gotoUpdate: "Update Firmware",
    reconnect: "Reconnect",
    reconnectDescription: `There's a possibility that we misdetected the capabilities of the keyboard, or that the keyboard was starting up while we connected. In this case, you can try clicking the "{0}" button to attempt a reconnect, and look for the necessary features again. Reconnecting is useful if you're sure there was a temporary failure upon previous attempts, and the problem has been resolved.`
  }
};

export { English as default };
