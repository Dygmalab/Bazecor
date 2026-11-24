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
import { vkTemplate, seedCombos, COMBO_FIXTURES } from "./vk-templates.mjs";

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
  // Collect renderer errors for `console-errors`.
  const main = pages().find(pg => pg.url().includes("main_window"));
  if (main) {
    main.on("console", m => {
      if (m.type() === "error") main.evaluate(t => (window.__errs = (window.__errs || []).concat([t])), m.text().slice(0, 300)).catch(() => {});
    });
    main.on("pageerror", e => main.evaluate(t => (window.__errs = (window.__errs || []).concat([t])), `pageerror: ${e.message}`).catch(() => {}));
  }
}

// The app uses a MemoryRouter, so there is no URL to set: click the
// navigation menu's link for that route, as a user would.
async function gotoRoute(route) {
  const p = page("main");
  await p.locator(`a[href="${route}"]`).first().click({ timeout: 10000 });
  await sleep(1200);
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

  // Real mouse input (pointerdown/mousedown/up/click), unlike click-text's DOM
  // el.click(). Needed for Radix tabs, which switch on pointer/mouse down, and
  // for the SVG keys of the keyboard drawing in the Layout Editor.
  // click <x> <y>  (CSS pixels of the main window, as in an `ss main` screenshot)
  async click(args) {
    const [x, y] = args.split(/\s+/).map(Number);
    await page("main").mouse.click(x, y);
    console.log(`clicked ${x},${y}`);
  },

  // tab <accessible name>  e.g. tab Layers and Modifiers
  async tab(name) {
    await page("main").getByRole("tab", { name, exact: true }).click({ timeout: 5000 });
    console.log("tab:", name);
  },

  // click-role <role> <accessible name>  e.g. click-role button Configure
  async "click-role"(args) {
    const [role, ...rest] = args.split(" ");
    await page("main").getByRole(role, { name: rest.join(" ") }).first().click({ timeout: 5000 });
    console.log(`clicked ${role}:`, rest.join(" "));
  },

  // viewport <w> <h>: resize the main window's page to test other window sizes.
  async viewport(args) {
    const [width, height] = args.split(/\s+/).map(Number);
    await page("main").setViewportSize({ width, height });
    console.log(`viewport ${width}x${height}`);
  },

  // overflow: every element in the main window whose content scrolls
  // (scrollHeight > clientHeight with overflow-y auto|scroll).
  async overflow() {
    const rows = await page("main").evaluate(() =>
      [...document.querySelectorAll("*")]
        .filter(el => el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY))
        .map(el => `${el.clientHeight}/${el.scrollHeight}px  ${String(el.className).slice(0, 80)}`),
    );
    console.log(rows.length ? rows.join("\n") : "no scrolling elements");
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

  // vk <model>: connect a fresh virtual keyboard built from the app's own
  // template (api/hardware-virtual), through the Keyboard Manager's
  // "Load file" path, with the native file dialog stubbed out.
  // Models: raise-ansi raise-iso raise2-ansi raise2-iso defy-wired defy-wireless sonsei
  // vk <model> [combos]: "combos" seeds one combo per kind of result (see
  // COMBO_FIXTURES in vk-templates.mjs) on boards whose firmware has combos.
  async vk(args) {
    const [model, extra] = args.split(/\s+/);
    const file = path.join(SHOT_DIR, `vk-${model}.json`);
    const vk = vkTemplate(model);
    if (extra === "combos") console.log(seedCombos(vk) ? `seeded ${COMBO_FIXTURES.length} combos` : "this model has no combos.map");
    fs.writeFileSync(file, JSON.stringify(vk, null, 2));
    const p = page("main");
    await gotoRoute("/device-manager");
    // The native open dialog can't be driven, so answer it with the file.
    await p.evaluate(f => {
      const { ipcRenderer } = require("electron");
      if (!ipcRenderer.__origInvoke) ipcRenderer.__origInvoke = ipcRenderer.invoke.bind(ipcRenderer);
      window.__vkFile = f;
      ipcRenderer.invoke = (channel, ...args) => {
        if (channel === "open-dialog") return Promise.resolve({ canceled: false, filePaths: [window.__vkFile] });
        return ipcRenderer.__origInvoke(channel, ...args);
      };
    }, file);
    await p.getByText("Use without keyboard", { exact: true }).first().click({ timeout: 10000 });
    await sleep(600);
    await p.getByRole("button", { name: "Load file" }).first().click({ timeout: 5000 });
    // Connecting reads every command of the file and opens the Layout
    // Editor, which shows a loader until the board is drawn.
    await p.locator("[data-key-index]").first().waitFor({ timeout: 120000 });
    await sleep(1500);
    console.log(`virtual ${model} connected (${file})`);
  },

  // combo-sheet [name]: in the Combo Editor, select every combo in turn, crop
  // its "keys = result" row, and save all the crops as one contact sheet
  // <name>.png. Also prints each result's text and flags the broken ones
  // ("[object Object]", or a result that renders nothing).
  async "combo-sheet"(name = "combo-sheet") {
    const p = page("main");
    await p.keyboard.press("Escape"); // close any popup left open
    await sleep(300);
    const count = await (async () => {
      await p.getByText("Combos", { exact: true }).first().click({ timeout: 5000 });
      await sleep(400);
      const n = await p.getByRole("option").count();
      await p.keyboard.press("Escape");
      await sleep(300);
      return n;
    })();
    const shots = [];
    let bad = 0;
    for (let i = 0; i < count; i += 1) {
      await p.getByText("Combos", { exact: true }).first().click({ timeout: 5000 });
      await sleep(300);
      await p.getByRole("option").nth(i).click({ timeout: 5000 });
      await sleep(500);
      const info = await p.evaluate(() => {
        const eq = [...document.querySelectorAll(".comboEditor span")].find(s => s.textContent.trim() === "=");
        const result = eq?.nextElementSibling;
        const row = eq?.closest(".grid");
        const r = row?.getBoundingClientRect();
        return {
          text: (result?.innerText || "").replace(/\s+/g, " ").trim(),
          hasIcon: Boolean(result?.querySelector("svg, img")),
          clip: r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null,
        };
      });
      const broken = info.text.includes("[object Object]") || (!info.text && !info.hasIcon);
      if (broken) bad += 1;
      console.log(`C${i + 1}: ${info.text || "(no text)"}${info.hasIcon ? " [icon]" : ""}${broken ? "  <-- BROKEN" : ""}`);
      if (info.clip) shots.push({ label: `C${i + 1}`, png: (await p.screenshot({ clip: info.clip })).toString("base64") });
    }
    // Lay the crops out on top of the page, capture, then remove the overlay.
    await p.evaluate(items => {
      const o = document.createElement("div");
      o.id = "__sheet";
      o.style.cssText =
        "position:fixed;inset:0;z-index:99999;background:#111;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;align-content:start";
      items.forEach(({ label, png }) => {
        const c = document.createElement("div");
        c.style.cssText = "position:relative";
        c.innerHTML = `<img src="data:image/png;base64,${png}" style="width:100%;display:block"><span style="position:absolute;left:4px;top:2px;color:#ff0;font:bold 12px sans-serif">${label}</span>`;
        o.appendChild(c);
      });
      document.body.appendChild(o);
    }, shots);
    await sleep(300);
    const f = path.join(SHOT_DIR, `${name}.png`);
    await p.screenshot({ path: f });
    await p.evaluate(() => document.getElementById("__sheet")?.remove());
    console.log(`${count} combos, ${bad} broken. sheet: ${f}`);
  },

  // vk-clean: drop the neurons that `vk` added to %APPDATA%\Bazecor\config.json
  // (ids ending in -test-<model>). Run it with the app closed, or the app
  // writes its own copy back over it.
  "vk-clean"() {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    const before = config.neurons?.length ?? 0;
    config.neurons = (config.neurons ?? []).filter(n => !/-test-[a-z0-9-]+$/.test(n.id));
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, "\t"));
    console.log(`removed ${before - config.neurons.length} test neurons`);
  },

  // hover <x> <y>: move the real mouse there (tooltips open on hover).
  async hover(args) {
    const [x, y] = args.split(/\s+/).map(Number);
    await page("main").mouse.move(x, y);
    console.log(`hover ${x},${y}`);
  },

  // click-key <index>: real click on the key with that data-key-index on the
  // keyboard drawing, whatever the board and window size.
  async "click-key"(index) {
    await page("main").locator(`[data-key-index="${index}"]`).first().click({ timeout: 5000 });
    console.log("clicked key", index);
  },

  // key <name>: press a key in the main window, e.g. key Escape
  async key(name) {
    await page("main").keyboard.press(name);
    console.log("pressed", name);
  },

  // go <route>: client-side navigation, e.g. go /combos, go /macros, go /editor
  async go(route) {
    await gotoRoute(route);
    console.log("at", route);
  },

  // labels: text of every key on the keyboard drawing in the main window,
  // "index:text" in DOM order (empty keys show as "index:").
  async labels() {
    const rows = await page("main").evaluate(() =>
      [...document.querySelectorAll("[data-key-index]")].map(
        el => `${el.getAttribute("data-key-index")}:${(el.textContent || "").replace(/\s+/g, " ").trim()}`,
      ),
    );
    console.log(`${rows.length} keys:`, rows.join(" | "));
  },

  // console-errors: renderer errors logged since the last call.
  async "console-errors"() {
    const errs = await page("main").evaluate(() => {
      const out = window.__errs || [];
      window.__errs = [];
      return out;
    });
    console.log(errs.length ? errs.join("\n") : "no renderer errors");
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
