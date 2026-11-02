---
name: run-bazecor
description: Build, run, and drive the Bazecor Electron app and its Layer Lens overlay. Use when asked to start Bazecor, launch the app, screenshot the main window or the Lens overlay, switch the Lens keyboard layout/language, call an ipcMain handler, or verify a UI change in the running app.
---

Bazecor is an Electron (Forge + webpack) app with two windows: the main
window (`main_window`) and the Layer Lens overlay (`lens_window`). Drive it
with `.claude/skills/run-bazecor/driver.mjs`: it starts the dev app with a
Chrome DevTools Protocol (CDP) port, attaches Playwright over CDP, and runs one
command per stdin line, in order.

All paths are relative to the repo root. Verified on Windows 11 with a real
desktop session. No xvfb was used.

## Prerequisites

You need Node 22.14 (from `.nvmrc`) and yarn 1 (from the `packageManager`
field). Native modules such as `drivelist`, `usb` and `serialport` are built
with the Visual Studio 2022 Build Tools. With fnm, in Git Bash:

```bash
eval "$(fnm env --shell bash)" && fnm use 22.14.0
```

## Setup

```bash
yarn install --frozen-lockfile
```

The driver uses this repo's own `playwright-core`, so nothing else needs
installing.

## Run (agent path)

Pipe a heredoc of commands. The driver builds and launches the app, runs the
commands, then stops the whole process tree:

```bash
node .claude/skills/run-bazecor/driver.mjs <<'EOF'
launch
windows
ss main 01-main
lens-show
lens-layout fr-FR
lens-labels
ss lens 02-lens-fr
quit
EOF
```

- Screenshots and the app log (`app.log`) go to `%TEMP%\bazecor-shots\`
  (override with `SCREENSHOT_DIR`).
- The CDP port is 9223 (override with `CDP_PORT`).
- `launch` takes about 45 s on a warm webpack cache, and 135–170 s cold (for
  example, right after a reinstall). It waits up to 6 minutes.
- If the CDP port is already up, `launch` attaches to the running app instead
  of starting a new one.

| command | what it does |
|---|---|
| `launch` | `electron-forge start -- --remote-debugging-port=9223`, wait for CDP, attach |
| `windows` | list the attached page URLs |
| `ss <main\|lens> [name]` | screenshot that window to `<name>.png` |
| `eval <main\|lens> <js>` | evaluate an expression in that window and print the result as JSON |
| `text [main\|lens]` | print `document.body.innerText` |
| `click-text <text>` | DOM-click a button, link, or tab in the main window |
| `ipc <channel> [json ...]` | `ipcRenderer.invoke` from the main window, e.g. `ipc lens:set-layout "de-DE"` |
| `lens-show` | put the Lens overlay on screen |
| `lens-layout <lang>` | set the Lens layout (a Bazecor language tag such as `es-ES` or `fr-XX-bepo`) and wait for the repaint |
| `lens-labels` | print every key label the overlay draws, in DOM order |
| `sleep <ms>` | wait |
| `quit` | stop the app (`taskkill /T`) and restore the Lens settings the driver changed |

Lines starting with `#` are ignored. A failed command prints `ERROR: ...` and
the driver moves on to the next line.

## Run (human path)

`npm start` is the same Forge command without the CDP port. It opens both
windows, and Ctrl-C stops Forge.

## Test

```bash
npx vitest run lens/
```

`vite.config.mts` sets `root: 'src'`, so test filters are relative to `src/`.

## Gotchas

- **The dev app uses your real profile.** It reads and writes
  `%APPDATA%\Bazecor\config.json`, the same file the installed Bazecor uses.
  That means two things:
  - Quit any installed Bazecor first. It holds the single-instance lock, and
    the dev copy exits immediately.
  - `lens-show` and `lens-layout` save `lens.overlayShown`, `lens.layout` and
    `lens.resizeMode` to that file. `quit` puts back the values from before the
    first such command. If the driver dies before `quit`, fix those three
    fields by hand.
- **Killing `npx` leaves `electron.exe` running.** Forge starts Electron as a
  grandchild process, so stopping the background npx task left five
  `electron.exe` processes alive. `quit` uses `taskkill /PID <pid> /T /F` for
  this reason.
- **Lens needs a keyboard model.** Without one, the overlay shows "Waiting for
  Bazecor" and `lens-labels` comes back nearly empty. It draws the keyboard
  when `config.json` has `lens.keyboards` with a valid `backupFolder` (taken
  from the latest backup), or when a Dygma board is connected.
- **Showing Lens takes a workaround.** No IPC simply shows the overlay, the
  tray item can't be reached over CDP, and the global shortcut was removed.
  `lens-show` turns Resize Mode on, which calls `ensureVisible()`, then turns
  it off again.
- **`ipcRenderer` only works from `main`.** The main window has
  `nodeIntegration: true` and `contextIsolation: false`, so `require("electron")`
  works there. The Lens window is context-isolated and only exposes
  `window.lens`.
- **Arguments after `--` go to Electron, not to Forge.** That is how
  `--remote-debugging-port` reaches the app.
- **A one-off webpack overlay on a cold start.** On the first cold-build run,
  `ss main` captured the webpack-dev-server overlay "Uncaught runtime errors:
  no access" (`TypeError` from `realpathSync` while resolving a `require` in
  the renderer). On the next launch it did not appear and the UI loaded
  normally. Check `eval main document.querySelector("#root")?.innerText` before
  trusting a main-window screenshot.

## Troubleshooting

- **`LNK1117: error de sintaxis en la opción 'opt:lldltojobs=2'` while
  building `drivelist`**: you ran `yarn install` on Node 26. Its node-gyp
  config passes an lld-only flag to the MSVC linker. Switch to Node 22.14 (see
  Prerequisites) and install again.
- **`npm install` rewrote `yarn.lock` and created `package-lock.json`**: this
  is a yarn project. Run `git checkout -- yarn.lock`, delete
  `package-lock.json`, and install again with yarn. npm 11 also skips native
  install scripts unless they are approved.
- **`Passing args to a child process with shell option true` (DEP0190)**:
  passing an args array together with `shell: true` triggers this warning. The
  driver passes one command string instead.
