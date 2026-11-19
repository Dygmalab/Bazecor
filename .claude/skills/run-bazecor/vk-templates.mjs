// Loads the virtual keyboard templates (src/api/hardware-virtual/*.ts) in
// plain Node, so the driver can write a virtual keyboard file for any model,
// Defy wired included (the app's "Create new file" list leaves that one out).
// Each .ts file is transpiled to CommonJS with the repo's own `typescript`
// and evaluated with a tiny require() that resolves relative paths and the
// `@Renderer` alias. Type-only imports disappear in the transpile.
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

const APP_DIR = path.resolve(import.meta.dirname, "../../..");
const nodeRequire = createRequire(path.join(APP_DIR, "package.json"));
const ts = nodeRequire("typescript");

const ALIASES = { "@Renderer/": path.join(APP_DIR, "src/renderer/") };
const cache = new Map();

function resolveFile(spec, fromDir) {
  let base = null;
  for (const [alias, dir] of Object.entries(ALIASES)) if (spec.startsWith(alias)) base = path.join(dir, spec.slice(alias.length));
  if (!base && spec.startsWith(".")) base = path.resolve(fromDir, spec);
  if (!base) return null;
  for (const cand of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  throw new Error(`cannot resolve ${spec} from ${fromDir}`);
}

function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const src = fs.readFileSync(file, "utf8");
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.React },
    fileName: file,
  });
  const module = { exports: {} };
  cache.set(file, module);
  const req = spec => {
    const resolved = resolveFile(spec, path.dirname(file));
    return resolved ? load(resolved) : nodeRequire(spec);
  };
  new Function("require", "module", "exports", outputText)(req, module, module.exports);
  return module.exports;
}

const TEMPLATE_FILES = {
  "raise-ansi": "RaiseANSI.ts",
  "raise-iso": "RaiseISO.ts",
  "raise2-ansi": "Raise2ANSI.ts",
  "raise2-iso": "Raise2ISO.ts",
  "defy-wired": "DefyWired.ts",
  "defy-wireless": "DefyWireless.ts",
  sonsei: "SonseiWireless.ts",
};

export const VK_MODEL_NAMES = Object.keys(TEMPLATE_FILES);

/** A deep copy of the model's template, as the app's "Create new file" makes it. */
export function vkTemplate(model) {
  const file = TEMPLATE_FILES[model];
  if (!file) throw new Error(`unknown model "${model}"; one of: ${VK_MODEL_NAMES.join(" ")}`);
  const mod = load(path.join(APP_DIR, "src/api/hardware-virtual", file));
  const vk = JSON.parse(JSON.stringify(mod.default));
  vk.virtual["hardware.chip_id"].data += `-test-${model}`;
  return vk;
}

/* One combo per kind of result, so the Combo Editor shows every way a key can
 * be labelled: plain, modified, layer, media, LED, macro, superkey, dual
 * function, one-shot, mouse, wireless, blank. Members are positions 2i, 2i+1
 * on layer 0. Names go in the neuron store, not here, so they read "C1".. */
export const COMBO_FIXTURES = [
  [4, "letter A"],
  [2052, "Shift+A"],
  [844, "Ctrl+Alt+Del"],
  [17451, "shift to layer 2"],
  [17410, "lock layer 3"],
  [17492, "move to layer 1"],
  [22709, "next track"],
  [22710, "last track"],
  [19682, "mute"],
  [23663, "display brightness +"],
  [17152, "LED next effect"],
  [53852, "macro 1"],
  [53980, "superkey 1"],
  [49173, "dual Ctrl / A"],
  [51222, "dual layer 1 / A"],
  [49153, "one-shot Ctrl"],
  [20481, "mouse up"],
  [54108, "battery level"],
  [65535, "transparent"],
  [62, "F5"],
];

/* Combos only show on firmware at or above versionRules.json's minimum for
 * the product, and the templates carry older versions. Raise the reported
 * version to that minimum (keeping the rest of the version string). */
function bumpFirmwareForCombos(vk) {
  const rules = JSON.parse(fs.readFileSync(path.join(APP_DIR, "src/versionRules.json"), "utf8"));
  const min = rules.features?.combos?.minFirmware?.[vk.device.info.product];
  if (!min || !vk.virtual.version) return;
  const current = (String(vk.virtual.version.data).match(/^v?(\d+)\.(\d+)\.(\d+)/) ?? []).slice(1).map(Number);
  const wanted = min.split(".").map(Number);
  const cmp = wanted.map((w, i) => (current[i] ?? 0) - w).find(d => d !== 0) ?? 0;
  if (current.length === 3 && cmp >= 0) return;
  vk.virtual.version.data = String(vk.virtual.version.data).replace(/^v?\d+\.\d+\.\d+/, `v${min}`);
}

export function seedCombos(vk) {
  const entry = vk.virtual["combos.map"];
  if (!entry) return false;
  bumpFirmwareForCombos(vk);
  const values = String(entry.data).trim().split(/\s+/).map(Number);
  const FIELDS = 9; // 6 members, layer, flags, action
  const count = Math.min(COMBO_FIXTURES.length, (values.length - 1) / FIELDS);
  values[0] = count;
  for (let i = 0; i < count; i += 1) {
    const base = 1 + i * FIELDS;
    values.splice(base, FIELDS, 2 * i, 2 * i + 1, 255, 255, 255, 255, 0, 1, COMBO_FIXTURES[i][0]);
  }
  entry.data = values.join(" ");
  return true;
}
