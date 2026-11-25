---
name: bazecor-testing
description: Verify a Bazecor bug fix or feature before calling it done - unit tests, then the running app on every keyboard model (Raise ANSI/ISO, Raise 2 ANSI/ISO, Defy wired/wireless, Sonsei) through virtual keyboards, with screenshots of every visual change and checks of neighbouring features so nothing that worked breaks. Use after changing anything in Bazecor (renderer, keymap DB, editors, Lens), when asked to test, validate or QA a change, or before reporting a fix as finished.
---

# Bazecor testing

Every change is verified in three layers, in this order. Do not report a fix as
done until all three pass, and say which checks ran and what they showed.

1. **Static**: `npx tsc --noEmit --skipLibCheck` and `npx eslint <changed files>`.
   Compare against the same files before the change (`git stash`): only the
   errors you introduced are yours to fix; leave pre-existing ones alone and
   don't reformat lines you didn't touch.
2. **Unit**: a vitest test for any new logic (helpers, parsers, label
   decoding), then the whole suite: `npx vitest run` (root is `src/`, so
   filters are relative to it: `npx vitest run renderer/utils/`).
3. **Running app, every keyboard**: the `run-bazecor` driver
   (`.claude/skills/run-bazecor/driver.mjs`). Read that skill first for
   launching, gotchas and the command list.

## Rules

- **Always test all seven models.** A fix that only ran on one board is not
  verified. Models: `raise-ansi raise-iso raise2-ansi raise2-iso defy-wired
  defy-wireless sonsei`. Raise (1) firmware has no combos, autoshift or
  capsword; the Combo Editor is expected to be missing there.
- **Every visual change gets a screenshot, and you look at it** (Read the
  PNG). Screenshots are for your own verification only: they live in
  `%TEMP%\bazecor-shots\`, are never committed, and are not attached to the
  report unless the user asks.
- **Test around the change, not just the change.** Exercise the bug's own
  scenario, then the neighbouring paths that share code with it (see the
  table below), so a fix in one editor doesn't break another view that draws
  the same keys or reads the same data.
- **Check for renderer errors** with `console-errors` after each model.
- **Confirm before closing the user's app.** The dev app shares the
  single-instance lock and `%APPDATA%\Bazecor\config.json`. If a Bazecor or
  `electron-forge start` without CDP is running, ask before stopping it.
- A real keyboard may be connected. Virtual keyboards don't touch it, but
  never flash firmware, clear layers or save to a real board while testing.

## Start the app once, iterate against it

```bash
# background task; webpack cold start takes ~2-3 min
npx cross-env NODE_ENV=development electron-forge start -- --remote-debugging-port=9223 > "$TEMP/bazecor-shots/app-bg.log" 2>&1
# then wait for CDP (Monitor / until-loop on curl http://127.0.0.1:9223/json/version)
```

Each driver run starts with `launch`, which attaches to it. Code edits
hot-reload; if the main window reloads fully and loses the keyboard, load the
virtual keyboard again with `vk`.

## Virtual keyboards

`vk <model> [combos]` writes a fresh virtual keyboard file from the app's own
template (`src/api/hardware-virtual/*.ts`, transpiled by
`run-bazecor/vk-templates.mjs`), loads it through Keyboard Manager → Add
virtual keyboard → Load file with the native dialogs stubbed, and waits for the
Layout Editor to draw the board.

- `combos` seeds 20 combos, one per kind of result (letter, Shift+A,
  Ctrl+Alt+Del, layer shift/lock/move, next/last track, mute, display
  brightness, LED, macro, superkey, dual-function, dual-layer, one-shot, mouse,
  battery, transparent, F5; see `COMBO_FIXTURES`), and raises the reported
  firmware to the combos minimum from `src/versionRules.json` so the Combo
  Editor shows. Add fixtures there when a new key type appears.
- The first load of a model can take a minute or two (new neuron). A native
  message box would block, so watch for long waits.
- Virtual keyboards save to their JSON file only; saving is safe to test.
- Each model also adds a neuron (`...-test-<model>`) to the user's
  `%APPDATA%\Bazecor\config.json`. When testing is finished, close the app and
  run the driver with just `vk-clean` to remove them.

## The matrix: one driver run per model

Adapt the middle block to the change; keep the checks around it. Example used
for combo outputs / NO KEY / macros / device names:

```bash
for m in raise-ansi raise-iso raise2-ansi raise2-iso defy-wired defy-wireless sonsei; do
echo "######## $m"
node .claude/skills/run-bazecor/driver.mjs <<EOF 2>&1 | grep -vE "^bazecor driver|CDP already|launched\.|^> (sleep|launch)"
launch
console-errors
vk $m combos
ss main m-$m-editor
eval main "NO KEY on board: " + [...document.querySelectorAll('[data-key-index]')].filter(e=>/NO\s*KEY/.test(e.textContent)).length
go /combos
sleep 2500
combo-sheet sheet-$m
go /macros
sleep 2000
tab Delay
eval main "random delay visible: " + /Random/i.test(document.querySelector("#root").innerText)
go /device-manager
sleep 2000
eval main "wired/wireless shown: " + /wire(d|less)/i.test(document.querySelector("#root").innerText)
console-errors
EOF
done
```

Then Read the screenshots (`m-<model>-editor.png`, `sheet-<model>.png`).
`combo-sheet` prints every combo's result text and flags `[object Object]` or
empty results as `BROKEN`; its PNG is one contact sheet of every combo row.

## What to re-check, by area touched

| Area changed | Also check |
|---|---|
| Keymap DB labels (`src/api/keymap/db/*`) | Layout Editor board, Combo Editor slots + result (`combo-sheet`), key picker tabs, Superkeys editor actions, Lens labels (`lens-show`, `lens-labels`) |
| Keyboard drawing / `Key.tsx` / device `Keymap*.jsx` | Layout Editor and Combo Editor boards on all 7 models, combo badges (C1…) on keys, selected key highlight |
| Combo Editor | `combo-sheet` on 5 combo-capable models, pick a result from the picker (click result slot → tab → button), Save, leave and come back: result persists |
| Macro Editor | each tab (Text, Keys, Special functions, Delay), add a step to the timeline, Save |
| Device names / Keyboard Manager | Keyboard Manager cards, virtual keyboard dialog list, Settings device preview, Welcome screen |
| i18n strings | hover the control and read the tooltip (`hover x y`, then `eval main [...document.querySelectorAll('[role=tooltip]')].map(e=>e.textContent)`) |
| Lens | `lens-show`, `lens-layout <lang>`, `lens-labels`, `ss lens`; `quit` restores the Lens settings |

## Finding coordinates

Take `ss main` first. For controls, get centres from the DOM instead of
guessing, e.g. the combo result button:

```
eval main (()=>{const eq=[...document.querySelectorAll(".comboEditor span")].find(s=>s.textContent.trim()==="=");const r=eq.nextElementSibling.getBoundingClientRect();return Math.round(r.x+r.width/2)+" "+Math.round(r.y+r.height/2)})()
```

Board keys: `click-key <data-key-index>` works on every model.

## Reporting

State per model what passed, what was looked at in screenshots, and anything
that failed or was skipped (e.g. Raise has no Combo Editor by design). Never
claim a model was tested if its run errored.
