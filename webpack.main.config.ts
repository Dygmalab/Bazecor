import type { Configuration } from "webpack";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";

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
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "eval-cheap-source-map",
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
  plugins:
    process.env.NODE_ENV === "production"
      ? [
          sentryWebpackPlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }),
        ]
      : [],
};

export default mainConfig;
