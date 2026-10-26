// Command driver for the Bazecor dev app (main window + Layer Lens overlay).
// Launches `electron-forge start` with a CDP port, attaches Playwright over CDP,
// then runs one command per stdin line, in order. Pipe a heredoc of commands
// for a scripted run, or type them interactively. `quit` stops the whole
// process tree (killing npx alone leaves electron.exe running on Windows).
import { spawn, execSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as readline from "node:readline";
import { createRequire } from "node:module";

const APP_DIR = path.resolve(import.meta.dirname, "../../..");
const { chromium } = createRequire(path.join(APP_DIR, "package.json"))("playwright-core");

const PORT = Number(process.env.CDP_PORT || 9223);
const SHOT_DIR = process.env.SCREENSHOT_DIR || path.join(os.tmpdir(), "bazecor-shots");
const LOG_FILE = path.join(SHOT_DIR, "app.log");
const LAUNCH_TIMEOUT_MS = 6 * 60_000; // first webpack build is slow
fs.mkdirSync(SHOT_DIR, { recursive: true });

let child = null;
let browser = null;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// The dev app shares the installed app's userData, and lens-show/lens-layout
// persist into it. Snapshot the touched fields and put them back on quit, once
// the app can no longer overwrite the file.
const CONFIG_FILE = path.join(process.env.APPDATA || path.join(os.homedir(), ".config"), "Bazecor", "config.json");
let savedLens = null;

function snapshotLens() {
  if (savedLens || !fs.existsSync(CONFIG_FILE)) return;
  const { lens = {} } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  savedLens = { layout: lens.layout, overlayShown: lens.overlayShown, resizeMode: lens.resizeMode };
}

function restoreLens() {
  if (!savedLens) return;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  config.lens = { ...config.lens, ...savedLens };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, "\t"));
  console.log("restored lens settings:", JSON.stringify(savedLens));
  savedLens = null;
}

async function cdpUp() {
  try {
    return (await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok;
  } catch {
    return false;
  }
}

function pages() {
  return browser ? browser.contexts().flatMap(c => c.pages()) : [];
}

// "main" -> Bazecor window, "lens" -> Layer Lens overlay.
function page(which = "main") {
  const p = pages().find(pg => pg.url().includes(which === "lens" ? "lens_window" : "main_window"));
  if (!p) throw new Error(`${which} window not found (have: ${pages().map(pg => pg.url()).join(", ") || "none"})`);
  return p;
}

// The main window has nodeIntegration, so it can reach every ipcMain handler.
const invoke = (channel, ...args) =>
  page("main").evaluate(([c, a]) => require("electron").ipcRenderer.invoke(c, ...a), [channel, args]);

async function attach() {
  browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
  // Renderer pages register a moment after the CDP port opens.
  for (let i = 0; i < 60 && !pages().some(p => p.url().includes("main_window")); i += 1) await sleep(500);
}

const COMMANDS = {
  async launch() {
    if (await cdpUp()) {
      console.log(`CDP already listening on ${PORT}; attaching to the running app`);
    } else {
      const out = fs.openSync(LOG_FILE, "w");
      child = spawn(`npx cross-env NODE_ENV=development electron-forge start -- --remote-debugging-port=${PORT}`, {
        cwd: APP_DIR,
        shell: true,
        stdio: ["ignore", out, out],
      });
      const t0 = Date.now();
      while (!(await cdpUp())) {
        if (child.exitCode !== null) throw new Error(`forge exited (${child.exitCode}); see ${LOG_FILE}`);
        if (Date.now() - t0 > LAUNCH_TIMEOUT_MS) throw new Error(`no CDP after ${LAUNCH_TIMEOUT_MS / 1000}s; see ${LOG_FILE}`);
        await sleep(1000);
      }
      console.log(`app up in ${Math.round((Date.now() - t0) / 1000)}s (log: ${LOG_FILE})`);
    }
    await attach();
    console.log("launched. windows:", pages().map(p => p.url()).join("  "));
  },

  windows() {
    for (const p of pages()) console.log(" ", p.url());
  },

  // ss <main|lens> [name]
  async ss(args) {
    const [which = "main", name = `${which}-${Date.now()}`] = args.split(/\s+/).filter(Boolean);
    const f = path.join(SHOT_DIR, `${name}.png`);
    await page(which).screenshot({ path: f });
    console.log("screenshot:", f);
  },

  // eval <main|lens> <js expression>
  async eval(args) {
    const [which, ...rest] = args.split(" ");
    console.log(JSON.stringify(await page(which).evaluate(rest.join(" "))));
  },

  // ipc <channel> [json-arg ...]  e.g. ipc lens:set-layout "de-DE"
  async ipc(args) {
    const [channel, ...rest] = args.split(/\s+/);
    console.log(JSON.stringify(await invoke(channel, ...rest.map(a => JSON.parse(a)))));
  },

  async "click-text"(text) {
    const r = await page("main").evaluate(t => {
      const els = [...document.querySelectorAll('button, a, [role="button"], [role="tab"]')];
      const el = els.find(e => e.textContent?.trim() === t) ?? els.find(e => e.textContent?.includes(t));
      if (!el) return "NOT_FOUND";
      el.click();
      return `OK: ${el.tagName}`;
    }, text);
    console.log("click-text", JSON.stringify(text), "->", r);
  },

  async text(which = "main") {
    console.log(await page(which || "main").evaluate(() => document.body.innerText));
  },

  // Puts the Lens overlay on screen. Resize Mode goes through ensureVisible();
  // turning it back off leaves the overlay showing.
  async "lens-show"() {
    snapshotLens();
    await invoke("lens:set-resize-mode", true);
    await sleep(800);
    await invoke("lens:set-resize-mode", false);
    await sleep(500);
    console.log("lens shown");
  },

  async "lens-layout"(layout) {
    snapshotLens();
    await invoke("lens:set-layout", layout);
    await sleep(900); // settings broadcast + React repaint
    console.log("lens layout:", layout);
  },

  // Every text label the overlay currently draws, in DOM order.
  async "lens-labels"() {
    const labels = await page("lens").evaluate(() =>
      [...document.querySelectorAll(".keyboard-view svg text")].map(t => t.textContent.trim()).filter(Boolean),
    );
    console.log(`${labels.length} labels:`, labels.join(" | "));
  },

  async sleep(ms) {
    await sleep(Number(ms) || 1000);
  },

  async quit() {
    if (browser) await browser.close().catch(() => {});
    browser = null;
    if (child) {
      // /T: forge spawns electron.exe as a grandchild that outlives npx.
      if (process.platform === "win32") execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: "ignore" });
      else process.kill(-child.pid, "SIGTERM");
      child = null;
      console.log("app stopped");
      await sleep(1500); // let electron.exe release config.json
    }
    restoreLens();
  },

  help() {
    console.log("commands:", Object.keys(COMMANDS).join(", "));
  },
};

const rl = readline.createInterface({ input: process.stdin, terminal: false });
console.log(`bazecor driver ready (screenshots: ${SHOT_DIR}) - "help" for commands`);
for await (const line of rl) {
  const [cmd, ...rest] = line.trim().split(" ");
  if (!cmd || cmd.startsWith("#")) continue;
  const fn = COMMANDS[cmd];
  console.log(`> ${line.trim()}`);
  if (!fn) {
    console.log("unknown:", cmd, "- try: help");
    continue;
  }
  try {
    await fn(rest.join(" ").trim());
  } catch (e) {
    console.log("ERROR:", e.message);
  }
  if (cmd === "quit") break;
}
await COMMANDS.quit();
process.exit(0);
