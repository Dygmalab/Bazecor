import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
];

export default plugins;
