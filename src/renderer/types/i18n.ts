export interface Language {
  language: string;
  errors: Errors;
  success: Success;
  components: Components;
  dialog: LanguageDialog;
  app: App;
  editor: Editor;
  preferences: Preferences;
  wireless: LanguageWireless;
  keyboardSettings: KeyboardSettings;
  keyboardSelect: KeyboardSelect;
  firmwareUpdate: FirmwareUpdate;
  mouse: LanguageMouse;
  welcome: Welcome;
  general: General;
}

export interface App {
  device: string;
  menu: Menu;
  deviceMenu: DeviceMenu;
  cancelPending: CancelPending;
}

export interface CancelPending {
  button: string;
  title: string;
  content: string;
}

export interface DeviceMenu {
  Homepage: string;
  Forum: string;
  Chat: string;
}

export interface Menu {
  comingSoon: string;
  welcome: string;
  editor: string;
  macros: string;
  superkeys: string;
  firmwareUpdate: string;
  keyboardSettings: string;
  preferences: string;
  wireless: string;
  selectAKeyboard: string;
  selectAnotherKeyboard: string;
  softwareUpdate: string;
  supportPage: string;
  feedback: string;
  exit: string;
  keyboardTitle: string;
  bazecorSection: string;
  miscSection: string;
  upgradeAvailable: string;
  badgeNew: string;
  changeName: string;
}

export interface Components {
  layer: string;
  save: Save;
  pickerColorButton: string;
  underglowColorButton: string;
  keysColorButton: string;
}

export interface Save {
  success: string;
  savePreferences: string;
  button: string;
  saving: string;
}

export interface LanguageDialog {
  ok: string;
  cancel: string;
  allFiles: string;
  loading: string;
  applyChanges: string;
}

export interface Editor {
  keyType: string;
  keyCode: string;
  searchForKeyOrCategory: string;
  keyConfig: string;
  keySelectorTitle: string;
  keys: string;
  keysEditor: string;
  layers: EditorLayers;
  color: Color;
  groups: Groups;
  macros: EditorMacros;
  standardView: StandardView;
  superkeys: EditorSuperkeys;
  oldMacroModal: Modal;
  oldNeuronModal: Modal;
  editMode: EditMode;
  clearLayerQuestion: string;
  clearLayerPrompt: string;
  pleaseSelectLayer: string;
  dualUse: string;
  dualUseLayer: string;
  layoutMode: string;
  colormapMode: string;
  importExport: string;
  importExportDescription: string;
  loadDefault: string;
  copyToClipboard: string;
  copySuccess: string;
  pasteFromClipboard: string;
  pasteSuccess: string;
  importSuccessCurrentLayerTitle: string;
  importSuccessCurrentLayer: string;
  importSuccessAllLayers: string;
  exportSuccessCurrentLayer: string;
  exportSuccessCurrentLayerContent: string;
  exportSuccessAllLayers: string;
}

export interface Color {
  color: string;
  colorEditor: string;
  colorPalette: string;
  selectedColor: string;
  editColor: string;
  applyColor: string;
  allKeys: string;
  underglow: string;
  selectColorFirst: string;
  selectColorFirstContent: string;
}

export interface EditMode {
  title: string;
  standardView: string;
  singleView: string;
}

export interface Groups {
  Letters: string;
  Digits: string;
  Punctuation: string;
  Spacing: string;
  Modifiers: string;
  Navigation: string;
  "Fx keys": string;
  Numpad: string;
  Miscellaneous: string;
  "Shift to layer": string;
  "Lock layer to": string;
  "LED Effect": string;
  Macros: string;
  Media: string;
  "Mouse movement": string;
  "Mouse button": string;
  "Mouse wheel": string;
  "Mouse warp": string;
  "OneShot modifiers": string;
  "OneShot layers": string;
  TapDance: string;
  Leader: string;
  Steno: string;
  SpaceCadet: string;
  Blank: string;
  "Unknown keycodes": string;
}

export interface EditorLayers {
  importTitle: string;
  exportTitle: string;
  exportAllTitle: string;
  clearLayer: string;
  copyFrom: string;
  title: string;
  layerLock: string;
  layerLockDescription: string;
  exportToPdf: string;
  layerToCopy: string;
}

export interface EditorMacros {
  actions: string;
  add: string;
  applyAndExit: string;
  saveName: string;
  backup: string;
  backupMacro: string;
  backupMacroFile: string;
  copy: string;
  editMacros: string;
  delay: string;
  delays: string;
  delayr: string;
  delete: string;
  errorExport: string;
  export: string;
  functions: string;
  ignoreDelays: string;
  import: string;
  inputText: string;
  inputTextBox: string;
  insertModifiers: string;
  keysAndDelays: string;
  loadMacro: string;
  loadMacroFile: string;
  macroName: string;
  macroShort: string;
  mouse: string;
  recordDelays: string;
  recordMacro: string;
  recordingMacro: string;
  recordingDiscard: string;
  recordingMessage: string;
  restore: string;
  restoreMacros: string;
  restoreMacrosFile: string;
  save: string;
  saveMacros: string;
  saveMacrosFile: string;
  selectAction: string;
  selectFunction: string;
  selectKey: string;
  selectMacro: string;
  selectMouseFunction: string;
  startRecord: string;
  title: string;
  timelineTitle: string;
  successFlashTitle: string;
  successFlash: string;
  previewMacro: string;
  deleteModal: Modal;
  callout: string;
  textTabs: TextTabs;
  delayTabs: DelayTabs;
  macroTab: MacroTab;
  memoryUsage: MemoryUsage;
}

export interface DelayTabs {
  title: string;
  description: string;
}

export interface Modal {
  title: string;
  body: string;
  cancelButton: string;
  applyButton: string;
  body2?: string;
}

export interface MacroTab {
  callout: string;
  label: string;
}

export interface MemoryUsage {
  title: string;
  errorTitle: string;
  errordBody: string;
  alertTitle: string;
  alertBody: string;
}

export interface TextTabs {
  title: string;
  callout: string;
  placeholder: string;
  buttonText: string;
}

export interface StandardView {
  noKeyTransparent: string;
  callOut: string;
  noKey: string;
  noKeyDescription: string;
  transparent: string;
  trans: string;
  transparentDescription: string;
  keys: Keys;
  layers: StandardViewLayers;
  macros: MediaAndLEDClass;
  mediaAndLED: MediaAndLEDClass;
  mouse: MediaAndLEDClass;
  oneShot: OneShot;
  superkeys: StandardViewSuperkeys;
  wireless: StandardViewWireless;
}

export interface Keys {
  keys: string;
  standardViewTitle: string;
  callOut: string;
  enhanceTitle: string;
  callOutEnhance: string;
  addModifiers: string;
  addModifier: string;
  descriptionModifiers: string;
  addDualFunction: string;
  dualFunctionDescription: string;
}

export interface StandardViewLayers {
  title: string;
  callOut: string;
  layerSwitch: string;
  layerSwitchDescription: string;
  layerLock: string;
  layerLockDescription: string;
}

export interface MediaAndLEDClass {
  title: string;
  callOut: string;
}

export interface OneShot {
  title: string;
  callOut: string;
  titleLayers: string;
  layersDescription: string;
  titleModifiers: string;
  modifiersDescription: string;
  leftControl: string;
  leftShift: string;
  leftAlt: string;
  leftOS: string;
  rightControl: string;
  rightShift: string;
  altGr: string;
  rightOS: string;
}

export interface StandardViewSuperkeys {
  title: string;
  callOut: string;
  label: string;
}

export interface StandardViewWireless {
  callOut: string;
  batteryPowerStatus: string;
  batteryLevel: string;
  batteryLevelDescription: string;
  savingModeDescription: string;
}

export interface EditorSuperkeys {
  add: string;
  applyAndExit: string;
  saveName: string;
  backup: string;
  backupSuperkey: string;
  backupSuperkeyFile: string;
  copy: string;
  editSuperkeys: string;
  delay: string;
  delete: string;
  errorExport: string;
  export: string;
  functions: string;
  import: string;
  inputText: string;
  inputTextBox: string;
  insertModifiers: string;
  keysAndDelays: string;
  loadSuperkey: string;
  loadSuperkeyFile: string;
  superkeyName: string;
  superkeyShort: string;
  mouse: string;
  restore: string;
  restoreSuperkeys: string;
  restoreSuperkeysFile: string;
  save: string;
  saveSuperkeys: string;
  saveSuperkeysFile: string;
  selectAction: string;
  selectFunction: string;
  selectKey: string;
  selectSuperkey: string;
  selectMouseFunction: string;
  title: string;
  successFlashTitle: string;
  successFlash: string;
  createModal: CreateModal;
  deleteModal: Modal;
  actions: Actions;
  callout: string;
  tooltip: string;
  collapse: Collapse;
  specialKeys: SpecialKeys;
}

export interface Actions {
  tapLabel: string;
  tap: string;
  holdLabel: string;
  hold: string;
  tapAndHoldLabel: string;
  tapAndHold: string;
  doubleTapLabel: string;
  doubleTap: string;
  doubleTapAndHoldLabel: string;
  doubleTapAndHold: string;
}

export interface Collapse {
  title: string;
  content: string;
}

export interface CreateModal {
  createNew: string;
  inputLabel: string;
}

export interface SpecialKeys {
  noKey: string;
  transparent: string;
  playPause: string;
  stop: string;
  rewind: string;
  forward: string;
  shuffle: string;
  soundMore: string;
  soundLess: string;
  mute: string;
  eject: string;
  calculator: string;
  camera: string;
  brightnessMore: string;
  brightnessLess: string;
  sleep: string;
  shutdown: string;
  ledToggleText: string;
  ledToggleTootip: string;
  ledPreviousEffectTootip: string;
  ledNextEffectTootip: string;
  mouseClick: string;
  mouseMovement: string;
  mouseWheel: string;
  left: string;
  right: string;
  middle: string;
  back: string;
  fwd: string;
  up: string;
  down: string;
  mediaTitle: string;
  mediaDescription: string;
  LEDTitle: string;
  LEDDescription: string;
  othersTitle: string;
  othersDescription: string;
}

export interface Errors {
  deviceDisconnected: string;
  deviceDisconnectedContent: string;
  invalidLayerFile: string;
  exportError: string;
  exportFailed: string;
  preferenceFailOnSave: string;
  preferenceFailOnSaveBody: string;
  dismiss: string;
  troubleshooting: string;
  alertUnsavedTitle: string;
  alertUnsavedDescription: string;
}

export interface FirmwareUpdate {
  texts: { [key: string]: string };
  milestones: Milestones;
  dialog: FirmwareUpdateDialog;
  flashing: Flashing;
  backupSuccessful: string;
  defaultFirmware: string;
  defaultFirmwareDescription: string;
  experimentalFirmware: string;
  experimentalFirmwareDescription: string;
  selected: string;
  custom: string;
  rcustom: string;
  raise: Raise;
}

export interface FirmwareUpdateDialog {
  selectFirmware: string;
  firmwareFiles: string;
  allFiles: string;
}

export interface Flashing {
  error: string;
  troubleshooting: string;
  success: string;
  button: string;
  buttonUpdated: string;
  buttonSuccess: string;
}

export interface Milestones {
  backup: string;
  esc: string;
  flash: string;
  restore: string;
  tasksPassed: string;
  readyToStart: string;
  analyzedTasks: string;
  checkLeftSide: string;
  checkRightSide: string;
  checkLeftSideBL: string;
  checkRightSideBL: string;
  checkBackup: string;
}

export interface Raise {
  reset: string;
}

export interface General {
  actions: string;
  actionRequired: string;
  add: string;
  configure: string;
  clone: string;
  create: string;
  delete: string;
  key: string;
  layer: string;
  loadFile: string;
  modifier: string;
  new: string;
  noActionRequired: string;
  noname: string;
  of: string;
  onOff: string;
  select: string;
  record: string;
  resume: string;
  retry: string;
}

export interface KeyboardSelect {
  title: string;
  unknown: string;
  selectPrompt: string;
  noDevices: string;
  noDevicesSubtitle: string;
  connect: string;
  disconnect: string;
  scan: string;
  installUdevRules: string;
  permissionError: string;
  permissionErrorSuggestion: string;
  HIDReminderOfManuallyScan: string;
  virtualKeyboard: VirtualKeyboard;
}

export interface VirtualKeyboard {
  buttonText: string;
  modaltitle: string;
  newVirtualKeyboardTitle: string;
  newVirtualKeyboardDescription: string;
  newVirtualKeyboardLabel: string;
  loadVirtualKeyboardTitle: string;
  loadVirtualKeyboardDescription: string;
  newTitle: string;
  useTitle: string;
  createButtonLabel: string;
  buttonLabel: string;
  buttonLabelSave: string;
  errorLoadingFile: string;
  backupTransform: string;
}

export interface KeyboardSettings {
  advanced: string;
  defaultLabel: string;
  backupFolder: BackupFolder;
  neuronManager: NeuronManager;
  keymap: Keymap;
  led: LED;
  qukeys: Qukeys;
  superkeys: KeyboardSettingsSuperkeys;
  mouse: KeyboardSettingsMouse;
  advancedOps: string;
  resetEEPROM: ResetEEPROM;
}

export interface BackupFolder {
  header: string;
  title: string;
  restoreTitle: string;
  loadWindowTitle: string;
  windowButton: string;
  windowRestore: string;
  selectButtonText: string;
  restoreButtonText: string;
  storeTime: string;
  storeTimeTip: string;
}

export interface Keymap {
  title: string;
  noDefault: string;
  showHardcoded: string;
  onlyCustom: string;
  defaultLayer: string;
}

export interface LED {
  title: string;
  brightness: string;
  brightnesssub: string;
  brightnessUG: string;
  idleDisabled: string;
  idleTimeLimit: string;
  idle: Idle;
}

export interface Idle {
  oneMinute: string;
  twoMinutes: string;
  threeMinutes: string;
  fourMinutes: string;
  fiveMinutes: string;
  tenMinutes: string;
  fifteenMinutes: string;
  twentyMinutes: string;
  thirtyMinutes: string;
  oneHour: string;
}

export interface KeyboardSettingsMouse {
  title: string;
  subtitle1: string;
  speed: string;
  speedsub: string;
  speedDelay: string;
  speedDelaysub: string;
  speedLimit: string;
  speedLimitsub: string;
  subtitle2: string;
  accelSpeed: string;
  accelSpeedsub: string;
  accelDelay: string;
  accelDelaysub: string;
  subtitle3: string;
  wheelSpeed: string;
  wheelSpeedsub: string;
  wheelDelay: string;
  wheelDelaysub: string;
}

export interface NeuronManager {
  header: string;
  title: string;
  nameTitle: string;
  neuron: string;
  neuronLabel: string;
  defaultNeuron: string;
  descriptionTitle: string;
  deleteNeuron: string;
  changeLayerTitle: string;
  inputLabel: string;
}

export interface Qukeys {
  title: string;
  holdTimeout: string;
  holdTimeoutsub: string;
  overlapThreshold: string;
  overlapThresholdTip1: string;
  overlapThresholdTip2: string;
  overlapThresholdTip3: string;
  overlapThresholdTip4: string;
  overlapThresholdsub: string;
  holdTimeoutTip1: string;
  holdTimeoutTip2: string;
  holdTimeoutTip3: string;
  holdTimeoutTip4: string;
}

export interface ResetEEPROM {
  title: string;
  button: string;
  dialogTitle: string;
  dialogContents: string;
}

export interface KeyboardSettingsSuperkeys {
  title: string;
  timeout: string;
  timeoutTip1: string;
  timeoutTip2: string;
  timeoutTip3: string;
  timeoutTip4: string;
  chordingTip1: string;
  chordingTip2: string;
  chordingTip3: string;
  chordingTip4: string;
  repeat: string;
  repeatsub: string;
  waitfor: string;
  waitforsub: string;
  holdstart: string;
  holdstartsub: string;
  overlap: string;
  overlapTip1: string;
  overlapTip2: string;
  overlapTip3: string;
}

export interface LanguageMouse {
  mouseClickTitle: string;
  mouseClickDescription: string;
  clickLeft: string;
  clickMiddle: string;
  clickRight: string;
  clickBack: string;
  clickForward: string;
  movementTitle: string;
  movementDescription: string;
  wheelTitle: string;
  wheelDescription: string;
}

export interface Preferences {
  title: string;
  devtools: string;
  language: string;
  interface: string;
  tooltips: Tooltips;
  advanced: string;
  verboseFocus: string;
  onlyCustom: string;
  allowBeta: string;
  darkMode: DarkMode;
}

export interface DarkMode {
  label: string;
  light: string;
  dark: string;
  system: string;
}

export interface Tooltips {
  language: string;
}

export interface Success {
  languageSaved: string;
  pairedSuccesfully: string;
  preferencesSaved: string;
  preferencesSavedBody: string;
  changesSaved: string;
  changesSavedContent: string;
}

export interface Welcome {
  bootloaderTitle: string;
  description: string;
  title: string;
  contents: string;
  gotoUpdate: string;
  reconnect: string;
  reconnectDescription: string;
}

export interface LanguageWireless {
  title: string;
  bluetooth: Bluetooth;
  energyManagement: EnergyManagement;
  batteryPreferences: BatteryPreferences;
  RFPreferences: RFPreferences;
}

export interface RFPreferences {
  RFSettings: string;
  repairChannel: string;
  reconnectSides: string;
  RFRadioSignal: string;
  repairChannelDescription: string;
}

export interface BatteryPreferences {
  battery: string;
  batteryErrorReading: string;
  batteryDisconnected: string;
  batteryFatalError: string;
  savingModeDescription: string;
}

export interface Bluetooth {
  pairingMode: string;
  pairingModeButton: string;
  pairingModeDescription: string;
  pair: string;
}

export interface EnergyManagement {
  title: string;
  advancedSettings: string;
  advancedSettingsDesc: string;
  savingMode: string;
  savingModeDesc: string;
  savingModeInfo: string;
  lowPowerMode: string;
  settings: Settings;
}

export interface Settings {
  maximumLED: string;
  maximumLEDBackLight: string;
  maximumLEDUnderglow: string;
  idleLedsTime: string;
  highBatteryImpact: string;
  mediumBatteryImpact: string;
  lowBatteryImpact: string;
  trueSleepEnabling: string;
  trueSleepEnablingDesc: string;
  trueSleepTimeDesc: string;
  highlightLayerChanging: string;
  highlightLayerChangingDesc: string;
  RFSettingTitle: string;
  manageRFSignal: string;
  reduceRFFrequency: string;
  tooltipRF: string;
}
