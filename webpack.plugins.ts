import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";

/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  ...(process.env.NODE_ENV === "production"
    ? sentryWebpackPlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      })
    : []),
];

export default plugins;
