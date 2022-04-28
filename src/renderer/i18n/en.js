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
    deviceDisconnectedContent:
      "Houston we have a problem! Could not connect with Neuron, configure if cables are connected and if everything is ok.",
    invalidLayerFile: "Not a valid Layer file",
    exportError: "Error at Exporting: ",
    preferenceFailOnSave: "Whoops, Something Went Wrong!",
    preferenceFailOnSaveBody: "Please try again.",
    dismiss: "Dismiss",
    troubleshooting: "Troubleshooting"
  },
  success: {
    preferencesSaved: "Your preferecens have been saved.",
    preferencesSavedBody: ""
  },
  components: {
    layer: "Layer {0}",
    save: {
      success: "Sent!",
      saveChanges: "Send changes to the Raise",
      savePreferences: "Save preferences",
      button: "Save changes"
    },
    pickerColorButton: "Change color",
    underglowColorButton: "Change color of all underglows",
    keysColorButton: "Change color of all keys"
  },
  dialog: {
    ok: "Ok",
    cancel: "Cancel",
    allFiles: "All Files",
    loading: "Loading..."
  },
  app: {
    device: "Keyboard",
    menu: {
      comingSoon: "Coming soon...",
      welcome: "Welcome",
      editor: "Layout <br>Editor",
      macros: "Macro <br>Editor",
      superkeys: "Superkeys <br>Editor",
      firmwareUpdate: "Firmware <br>Update",
      keyboardSettings: "Keyboard Settings",
      preferences: "Preferences",
      selectAKeyboard: "Keyboard <br>Selection",
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
      upgradeAvailable: "An upgrade is available!",
      badgeNew: "New"
    },
    deviceMenu: {
      Homepage: "Homepage",
      Forum: "Forum",
      Chat: "Chat"
    },
    cancelPending: {
      button: "Discard changes",
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
      importTitle: "Load single layer",
      exportTitle: "Share selected layer",
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
    superkeys: {
      add: "Add new superkey",
      applyAndExit: "Apply",
      saveName: "Save name",
      backup: "Backup All",
      backupSuperkey: "Backup Superkeys",
      backupSuperkeyFile: "Backup Superkeys to file",
      copy: "Copy",
      editSuperkeys: "Edit superkey",
      delay: "Delay",
      delete: "Delete",
      errorExport: "The file is not a valid superkey export",
      export: "Export",
      functions: "Functions",
      import: "Import",
      inputText: "Input Text",
      inputTextBox: "Type text into Superkey editor",
      insertModifiers: "Add Modifier",
      keysAndDelays: "Keys & Delay",
      loadSuperkey: "Load Superkey",
      loadSuperkeyFile: "Load Superkey file",
      superkeyName: "Superkey Name",
      superkeyShort: "Superkey Short",
      mouse: "Mouse",
      restore: "Restore All",
      restoreSuperkeys: "Restore Superkeys",
      restoreSuperkeysFile: "Restore Superkeys file",
      save: "Save",
      saveSuperkeys: "Save Superkeys",
      saveSuperkeysFile: "Save Superkeys file",
      selectAction: "Select Action",
      selectFunction: "Select Function",
      selectKey: "Select Key",
      selectSuperkey: "Select a Superkey",
      selectMouseFunction: "Select Mouse Function",
      title: "Superkeys Editor",
      successFlash: "Succesfully sent the superkeys to the Raise",
      deleteModal: {
        title: "This superkey is in use",
        // prettier-ignore
        body:"The superkey you want to delete is currently in use, by pressing remove you will replace those superkeys with NO KEY on the keyboard layout. Select how to proceed.",
        cancelButton: "Cancel",
        applyButton: "Remove"
      },
      actions: {
        tapLabel: "Tap",
        tap: "No secrets, tap once and activate the key.",
        holdLabel: "Hold",
        hold: "Hold the key top trigger a second key.",
        tapAndHoldLabel: "Tap & hold",
        tapAndHold: "Tap once, tap again and keep holding to activate another key.",
        doubleTapLabel: "2Tap",
        doubleTap: "Tap twice fast and trigger another key.",
        doubleTapAndHoldLabel: "2Tap & hold",
        doubleTapAndHold: "Tap twice fast and hold to see others keyboards crying."
      },
      callout:
        "<p>Wow! Superpowers, my friend!</p><p>Superkeys allow up to 5 different functions in a single key. You activate each function with a tap, hold, tap and hold, double-tap or double-tap and hold. This allows you to create crazy combinations to boost your workflow.</p>",
      tooltip:
        "You can edit keys in two diffferent ways. Advanced users may prefer Single View which is designed for quick key editing.",
      collapse: {
        title: "See what you are able to do",
        content: ""
      },
      specialKeys: {
        noKey: "No Key",
        transparent: "Transparent",
        playPause: "Play/Pause",
        stop: "Stop",
        rewind: "Rewind",
        forward: "Forward",
        shuffle: "Shuffle",
        soundMore: "Sound More",
        soundLess: "Sound Less",
        mute: "Mute",
        eject: "Eject",
        calculator: "calculator",
        camera: "Camera",
        brightnessMore: "Brightness More",
        brightnessLess: "Brightness Less",
        ledToggleText: "On/Off",
        ledToggleTootip: "Toggle effects",
        ledPreviousEffectTootip: "Previous light effect",
        ledNextEffectTootip: "Next light effect",
        mouseClick: "Mouse <span>Click</span>",
        mouseMovement: "Mouse <span>Movement</span>",
        mouseWheel: "Mouse <span>Wheel</span>",
        left: "Left",
        right: "Right",
        middle: "Middle",
        back: "Back",
        fwd: "Fwd.",
        up: "Up",
        down: "Down"
      }
    },
    oldMacroModal: {
      title: "Update your macros",
      body: "The macros in your layout need to be updated to work on this Bazecor version.",
      body2: "Please note that the updated macro codes won't work until you flash the new firmware",
      cancelButton: "Cancel",
      applyButton: "Update Macros"
    },
    oldNeuronModal: {
      title: "New Neuron detected",
      body: "A new Neuron was plugged in for the first time using this bazecor installation",
      body2: "Do you want to clone the names of your existing neuron or use empty names",
      cancelButton: "Cancel",
      applyButton: "Use existing names"
    },
    editMode: {
      title: "Edit mode",
      standardView: "Standard View",
      singleView: "Single View"
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
    title: "Preferences",
    devtools: "Chrome Tools",
    language: "Select language",
    interface: "Interface",
    tooltips: {
      language: ""
    },
    advanced: "Advanced",
    verboseFocus: "Verbose logging",
    hotkeys: "Enable Hotkeys",
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
      header: "Backups",
      title: "Backup folder",
      restoreTitle: "Select a backup to restore",
      loadWindowTitle: "Choose backup folder",
      windowButton: "Select",
      windowRestore: "Restore",
      selectButtonText: "Change",
      restoreButtonText: "Restore backup",
      storeTime: "Backup storage period",
      storeTimeTip: "Determines how long a backup is stored before being deleted"
    },
    neuronManager: {
      header: "Neuron Manager",
      title: "Select a Neuron",
      nameTitle: "Name",
      neuron: "{0}: {1}",
      neuronLabel: "Neuron",
      defaultNeuron: "No neuron registered",
      descriptionTitle: "Selected neuron parameters",
      deleteNeuron: "Deleting the Neuron will erase the names of your layers, macros and superkeys from the local storage",
      changeLayerTitle: "Change Neuron name",
      inputLabel: "Neuron name"
    },
    keymap: {
      title: "General",
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
      holdTimeout: "Dual-Function Keys - Hold timeout",
      holdTimeoutsub: " - From 0 to 65,534 milliseconds",
      overlapThreshold: "Dual-Function Keys- Overlap Threshold",
      overlapThresholdTip1: "This setting adjusts how much chording you are allowed without triggering the hold function.",
      overlapThresholdTip2:
        "High values let you press the next key before releasing the Dual-Function key without triggering the hold function.",
      overlapThresholdTip3:
        "Low values will mean that you’ll trigger the hold function whenever pressing a key without having totally released a Dual-Function key.",
      overlapThresholdTip4:
        "If you change it to Less, you will nearly always affect the subsequent pressed key with the dual function as it will be counting as double pressing instead of chording.",
      overlapThresholdsub: " - Percentage from 0 to 100",
      holdTimeoutTip1: "This setting determines the amount of time it takes for the “hold” function to activate.",
      holdTimeoutTip2: "With a high value, it’ll take more time to activate the hold function.",
      holdTimeoutTip3: "With a low value, you might trigger the hold function if you linger on the key too much while typing.",
      holdTimeoutTip4: "If the slider is at 'High', it'll take a bit more time for the hold function to activate."
    },
    superkeys: {
      title: "Typing",
      timeout: "Superkeys - Next tap timeout",
      timeoutTip1: "This setting determines how much a Superkey waits for the next tap.",
      timeoutTip2: "With a low value, you need to be fast pressing the next tap, or the Superkey will output the previous tap.",
      timeoutTip3: "With a high value, it will take more time for the Superkey to output the second tap.",
      timeoutTip4:
        "If you choose a fast typing speed, you might activate those actions by mistake if you 'linger' too much on the key.",
      chordingTip1: "This setting determines the amount of time it takes for the “hold” function to activate.",
      chordingTip2: "With a high value, it’ll take more time to activate the hold function.",
      chordingTip3: "With a low value, you might trigger the hold function if you linger on the key too much while typing.",
      chordingTip4: "If the slider is at 'High', it'll take a bit more time for the hold function to activate.",
      repeat:
        "Adjust repeat time interval between the emmision of holded keys after waitfor period. (this doesn't affect all keys)",
      repeatsub: " - time from 0 to 254 milliseconds",
      waitfor: "Adjust time between first and subsequent emmisions of the hold keys",
      waitforsub: " - time from 0 to 65,534 milliseconds",
      holdstart: "Superkeys - Hold timeout",
      holdstartsub: " - time from 0 to 65,534 milliseconds",
      overlap:
        "Adjust percentage that changes the way the hold function will trigger depending on the typing speed of the previous normal key",
      overlapsub: " - Percentage from 0 to 100"
    },
    mouse: {
      title: "Mouse keys",
      subtitle1: "MOUSE SPEED",
      speed: "Cursor speed",
      speedsub: " - From 0 to 254 pixels",
      speedDelay: "Delay between steps (the higher the number, the slower the mouse movement)",
      speedDelaysub: " - From 0 to 65,534 milliseconds",
      speedLimit: "Maximum cursor speed",
      speedLimitsub: " - From 0 to 254 pixels",
      subtitle2: "MOUSE ACCELERATION",
      accelSpeed: "Cursor acceleration",
      accelSpeedsub: " - From 0 to 254 pixels",
      accelDelay: "Acceleration delay between steps (the higher the number, the slower the mouse movement)",
      accelDelaysub: " - From 0 to 65,534 milliseconds",
      subtitle3: "WHEEL SPEED",
      wheelSpeed: "Wheel speed",
      wheelSpeedsub: " - From 0 to 254 pixels",
      wheelDelay: "Wheel delay between steps (the higher the number, the slower the mouse movement)",
      wheelDelaysub: " - From 0 to 65,534 milliseconds"
    },
    advancedOps: "Advanced keyboard settings & operations",
    resetEEPROM: {
      title: "Restore to factory settings",
      button: "Restore",
      dialogTitle: "Reset EEPROM to factory defaults?",
      dialogContents: `This will reset the EEPROM to factory defaults.
 You will lose all customizations made.`
    }
  },
  keyboardSelect: {
    title: "Keyboard Selection",
    unknown: "Unknown",
    selectPrompt: "Select keyboard",
    noDevices: "No keyboards found!",
    noDevicesSubtitle: "[Death metal plays in background]",
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
      cancel: "Cancel",
      letsStart: "Let's start",
      versionUpdatedTitle: "Your firmware is up to date 🤙",
      versionOutdatedTitle: "New update is avaliable",
      calloutIntroText: "Updating your Raise firmware is how we implement new cool features and bug fixes.",
      neuronUpdatedText: "[Solid as a rock!]",
      neuronOutdatedText: "[Almost is never enough]",
      versionExists: "Raise Firmware Update",
      versionNotExists: "Firmware Update Process via Bootloader Mode",
      whatsNewTitle: "See what's new in Bazecor",
      whatsNewTitleVersion: "Whats new with",
      advUsersHTML:
        "<p>For advanced users: If you have installed your own <a href='https://support.dygma.com/hc/en-us/articles/360017062197'>Custom Firmware</a>, this update will overwrite it.</p>",
      advUsersText1: "For advanced users: ",
      advUsersText2: "If you have installed your own ",
      advUsersText3: ", this update will overwrite it.",
      disclaimerTitle: "Start update process",
      disclaimerCallout:
        "If the firmware update process isn't successful, don't worry. It won't damage your Raise, but you will need to repeat the process.",
      disclaimerContent:
        "<strong>Before the update the Neuron will backup your layers and settings after that the update process will begin automatically.</strong> During the update, Neuron will pulse a blue pattern followed by a flash of multiple colors for a few seconds.",
      disclaimerCard1:
        "During the update, the Neuron will pulse a blue pattern followed by a flash of multiple colors for a few seconds.",
      disclaimerCard2:
        "If the firmware update process isn't successful, don't worry. It won't damage your Raise, but you will need to repeat the process.",
      disclaimerCard3: "Click Next to backup your layers and settings, and start the firmware update process.",
      flashCardTitle1: "Press and hold the top left key to start the firmware update.",
      flashCardTitle2: "Don't release the key until the process finishes.",
      flashCardHelp: "Why do I need to press and hold a key when updating the Raise firmware?",
      flashCardHelpTooltip:
        "<div class='text-left'><h5>Why do I need to press and hold the key?</h5><p>When updating the firmware, we require the user to physically press and hold a key in order for the Firmware to be loaded. This is for security reasons.</p><p>The update process is designed so that it will never be triggered accidentally. <strong>This makes the keyboard secure against undesired firmware modifications.</strong></p></div>",
      flashCardOverlay1: "*Why do I need to press and hold the key? ",
      flashCardOverlay2: "When updating the firmware, we require the user to physically press and hold a key",
      flashCardOverlay3: "in order for the Firmware to be loaded. This is for security reasons.",
      flashCardOverlay4: "The update process is designed so that it will never be triggered accidentally.",
      flashCardOverlay5: "This makes the keyboard secure against undesired firmware modifications.",
      progressCardStatus1: "Hold the key",
      progressCardStatus2: "Flashing!",
      progressCardStatus3: "Release the key",
      progressCardBar1: "1. Backing up your Layers",
      progressCardBar2: "2. Preparing the Keyboard",
      progressCardBar3: "3. Updating the Firmware",
      progressCardBar4: "4. Restoring your Layers",
      progressCardTitle1: "Press and hold the top left key to start the firmware update.",
      progressCardTitle2: "Don't release the key until the process finishes.",
      currentlyRunningCardTitle: "Your <span class='hidden-on-sm'>Raise's </span>firmware version",
      latestAvailableText: "Latest version <span class='hidden-on-sm'>avaliable</span>",
      latestVersionInstalled: "You are using the latest version",
      firmwareUpdatedTitle: "Firmware update!",
      firmwareUpdatedMessage: "Solid as a rock! 💪"
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
      button: "Update now",
      buttonUpdated: "Reflash",
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
