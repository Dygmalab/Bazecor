import type { Configuration } from "webpack";
import path from "path";
import rules from "./webpack.rules";
import plugins from "./webpack.plugins";

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    },
  ],
});

const rendererConfig: Configuration = {
  // No explicit `target` here: the Forge webpack plugin derives it per entry point
  // from its `nodeIntegration` flag (main_window → electron-renderer, lens_window →
  // web, since the overlay runs with nodeIntegration disabled). A hardcoded target
  // would override that for every window.
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      "@Assets": path.resolve(__dirname, "src", "static"),
      "@Renderer": path.resolve(__dirname, "src", "renderer"),
      "@Types": path.resolve(__dirname, "src", "renderer", "types"),
    },
  },
  externals: {
    "uiohook-napi": "commonjs uiohook-napi",
    serialport: "commonjs serialport",
    "@serialport": "commonjs @serialport",
    usb: "commonjs usb",
  },
};

export default rendererConfig;
