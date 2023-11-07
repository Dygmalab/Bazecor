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
  target: "electron-renderer",
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
    serialport: "serialport",
    "@serialport": "@serialport",
    usb: "usb",
  },
};

export default rendererConfig;
