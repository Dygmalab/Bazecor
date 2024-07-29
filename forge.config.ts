import type { ForgeConfig, ForgePackagerOptions } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import fs from "fs";
import path from "path";
import { globSync } from "glob";
import { spawnSync } from "child_process";
import rendererConfig from "./webpack.renderer.config";
import mainConfig from "./webpack.main.config";

const packagerConfig: ForgePackagerOptions = {
  appBundleId: "com.dygmalab.bazecor",
  darwinDarkModeSupport: true,
  asar: false,
  icon: "./build/logo",
  name: "Bazecor",
  osxUniversal: {
    x64ArchFiles: "*",
  },
  extraResource: ["NEWS.md"],
  appCopyright: "Copyright © 2018, 2023 DygmaLab SL; distributed under the GPLv3",
};

if (process.env["NODE_ENV"] !== "development") {
  packagerConfig.osxSign = {
    optionsForFile: () => ({
      app: "com.dygmalab.bazecor",
      identity: process.env["APPLE_IDENTITY"],
      // entitlements: "./build/entitlements.plist",
      "gatekeeper-assess": false,
      hardenedRuntime: true,
    }),
  };
  packagerConfig.osxNotarize = {
    appleId: process.env["APPLE_ID"] || "",
    appleIdPassword: process.env["APPLE_ID_PASSWORD"] || "",
    teamId: process.env["APPLE_TEAM_ID"] || "",
  };
}

const config: ForgeConfig = {
  packagerConfig,
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "bazecor",
      setupIcon: "./build/logo.ico",
    }),
    new MakerZIP({}, ["darwin"]),
    {
      name: "@electron-forge/maker-dmg",
      config: {
        icon: "./build/logo.icns",
      },
    },
    {
      name: "@reforged/maker-appimage",
      config: {
        options: {
          bin: "Bazecor",
          categories: ["Utility"],
          icon: "./build/logo.png",
        },
      },
    },
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: "connect-src 'self' *.github.com github.com objects.githubusercontent.com 'unsafe-eval';",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/renderer/index.html",
            js: "./src/renderer/index.tsx",
            name: "main_window",
            preload: {
              js: "./src/preload/preload.ts",
            },
          },
        ],
      },
    }),
  ],
  hooks: {
    packageAfterPrune: async (_forgeConfig, buildPath, _electronVersion, platform, _arch) => {
      /**
       * Serialport, usb and uiohook-napi are problematic libraries to run in Electron.
       * When Electron app is been built, these libraries are not included properly in the final executable.
       * What we do here is to install them explicitly and then remove the files that are not for the platform
       * we are building for
       */
      const packageJson = JSON.parse(fs.readFileSync(path.resolve(buildPath, "package.json")).toString());

      packageJson.dependencies = {
        serialport: "^12.0.0",
        usb: "^2.9.0",
        "uiohook-napi": "^1.5.4",
      };

      fs.writeFileSync(path.resolve(buildPath, "package.json"), JSON.stringify(packageJson));
      spawnSync("npm", ["install", "--omit=dev"], {
        cwd: buildPath,
        stdio: "inherit",
        shell: true,
      });

      const prebuilds = globSync(`${buildPath}/**/prebuilds/*`);
      prebuilds.forEach(function (path) {
        if (!path.includes(platform)) {
          fs.rmSync(path, { recursive: true });
        }
      });
    },
  },
  publishers: [],
};

export default config;
