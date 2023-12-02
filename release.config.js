module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    [
      "@semantic-release/github",
      {
        prepare: [
          {
            path: "@semantic-release/exec",
            cmd: "mv dist/*.exe dist/bazecor-v${nextRelease.version}.exe",
          },
          {
            path: "@semantic-release/exec",
            cmd: "mv dist/*-x64.dmg dist/bazecor-v${nextRelease.version}-x64.dmg",
          },
          {
            path: "@semantic-release/exec",
            cmd: "mv dist/*-arm64.dmg dist/bazecor-v${nextRelease.version}-arm64.dmg",
          },
          {
            path: "@semantic-release/exec",
            cmd: "mv dist/*.AppImage dist/bazecor-v${nextRelease.version}.AppImage",
          },
          {
            path: "@semantic-release/exec",
            cmd: "sha256sum * > sha256sums.txt",
            execCwd: "dist",
          },
        ],
        assets: [
          {
            path: "dist/bazecor-v${nextRelease.version}.exe",
            name: "bazecor-v${nextRelease.version}.exe",
          },
          {
            path: "dist/bazecor-v${nextRelease.version}-x64.dmg",
            name: "bazecor-v${nextRelease.version}-x64.dmg",
          },
          {
            path: "dist/bazecor-v${nextRelease.version}-arm64.dmg",
            name: "bazecor-v${nextRelease.version}-arm64.dmg",
          },
          {
            path: "dist/bazecor-v${nextRelease.version}.AppImage",
            name: "bazecor-v${nextRelease.version}.AppImage",
          },
          {
            path: "dist/sha256sums.txt",
            name: "sha256sums.txt",
          },
        ],
      },
    ],
  ],
};
