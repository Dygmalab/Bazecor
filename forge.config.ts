import type { ForgeConfig, ForgePackagerOptions } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
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
  icon: "./build/logo.png",
  name: "Bazecor",
  extraResource: ["NEWS.md"],
  appCopyright: "Copyright © 2018, 2023 Keyboardio Inc.; Copyright © 2018, 2023 DygmaLab SE; distributed under the GPLv3",
};

if (process.env.NODE_ENV !== "development") {
  packagerConfig.osxNotarize = {
    tool: "notarytool",
    appleId: process.env.APPLE_ID || "",
    appleIdPassword: process.env.APPLE_ID_PASSWORD || "",
    teamId: process.env.APPLE_TEAM_ID || "",
  };
  packagerConfig.osxSign = {
    optionsForFile: () => ({
      entitlements: "./build/entitlements.plist",
      hardenedRuntime: true,
    }),
  };
}

const config: ForgeConfig = {
  packagerConfig,
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: "./build/logo.ico",
    }),
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
    packageAfterPrune: async (forgeConfig, buildPath, electronVersion, platform, arch) => {
      /**
       * Serialport, usb and uiohook-napi are problematic libraries to run in Electron.
       * When Electron app is been built, these libraries are not included properly in the final executable.
       * What we do here is to install them explicitly and then remove the files that are not for the platform
       * we are building for
       */
      const packageJson = JSON.parse(fs.readFileSync(path.resolve(buildPath, "package.json")).toString());

      packageJson.dependencies = {
        serialport: "^10.5.0",
        usb: "^2.9.0",
        "uiohook-napi": "^1.5.0",
      };

      fs.writeFileSync(path.resolve(buildPath, "package.json"), JSON.stringify(packageJson));
      const npmInstall = spawnSync("npm", ["install", "--omit=dev"], {
        cwd: buildPath,
        stdio: "inherit",
        shell: true,
      });

      const prebuilds = globSync(`${buildPath}/**/prebuilds/*`);
      const matchString = new RegExp(`prebuilds/${platform}`);
      prebuilds.forEach(function (path) {
        if (!path.match(matchString)) {
          fs.rmSync(path, { recursive: true });
        }
      });
    },
  },
  publishers: [],
};

export default config;
