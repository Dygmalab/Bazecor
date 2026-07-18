import type { ForgeConfig, ForgePackagerOptions } from "@electron-forge/shared-types";
import MakerFlatpak from "@electron-forge/maker-flatpak";
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
  extraResource: ["NEWS.md", "src/defaultBackups"],
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
    new MakerFlatpak(
      {
        options: {
          id: "com.dygma.bazecor",
          bin: "Bazecor",
          productName: "Bazecor",
          genericName: "Dygma Keyboard Configurator",
          description: "Configurator for Dygma Raise and Defy keyboards.",
          icon: "./build/logo.png",
          categories: ["Utility"],
          base: "org.electronjs.Electron2.BaseApp",
          baseFlatpakref: "https://flathub.org/repo/appstream/org.electronjs.Electron2.BaseApp.flatpakref",
          baseVersion: "25.08",
          runtime: "org.freedesktop.Platform",
          runtimeVersion: "25.08",
          sdk: "org.freedesktop.Sdk",
          modules: [
            {
              name: "eudev",
              sources: [
                {
                  type: "git",
                  url: "https://github.com/eudev-project/eudev",
                  tag: "v3.2.14",
                  commit: "9e7c4e744b9e7813af9acee64b5e8549ea1fbaa3",
                },
              ],
              cleanup: [
                "/include",
                "/etc",
                "/libexec",
                "/sbin",
                "/lib/pkgconfig",
                "/man",
                "/share/aclocal",
                "/share/doc",
                "/share/gtk-doc",
                "/share/man",
                "/share/pkgconfig",
                "*.la",
                "*.a",
              ],
            },
          ],

          files: [
            ["build/com.dygma.bazecor.desktop", "/app/share/applications/com.dygma.bazecor.desktop"],
            ["build/com.dygma.bazecor.metainfo.xml", "/app/share/metainfo/com.dygma.bazecor.metainfo.xml"],
            ["build/logo.png", "/app/share/icons/hicolor/512x512/apps/com.dygma.bazecor.png"],
          ],

          finishArgs: [
            "--device=all",
            "--env=ELECTRON_OZONE_PLATFORM_HINT=auto",
            "--env=XCURSOR_PATH=/run/host/user-share/icons:/run/host/share/icons",
            "--filesystem=/run/udev:ro",
            "--filesystem=host-etc",
            "--share=ipc",
            "--share=network",
            "--socket=fallback-x11",
            "--socket=wayland",
          ],
        },
      },
      ["linux"],
    ),
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
      const rootYarnRc = path.resolve(__dirname, ".yarnrc");
      if (fs.existsSync(rootYarnRc)) {
        fs.copyFileSync(rootYarnRc, path.resolve(buildPath, ".yarnrc"));
      }

      const rootYarnLock = path.resolve(__dirname, "yarn.lock");
      if (fs.existsSync(rootYarnLock)) {
        fs.copyFileSync(rootYarnLock, path.resolve(buildPath, "yarn.lock"));
      }

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
      spawnSync("yarn", ["install", "--production"], {
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
