import type { Configuration } from "webpack";

import rules from "./webpack.rules";

const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  target: "electron-main",
  externals: {
    "uiohook-napi": "uiohook-napi",
    serialport: "serialport",
    "@serialport": "@serialport",
    usb: "usb",
  },
};

export default mainConfig;
