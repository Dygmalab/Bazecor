/* Ported from the standalone Dygma Lens app. The overlay is a mouse-driven,
 * click-through window: its drag/resize surfaces are intentionally divs (they
 * must not be focusable/tabbable), and its console logs feed the overlay
 * debugging workflow. Resize Mode (settings.resizeMode) makes the window
 * non-click-through the whole time it's on, but the blue frame/glow/handles
 * themselves only reveal once the cursor is actually over the keyboard (the
 * .hovered class here, mirrored by index.css's body.overlay.resize-mode
 * .app.hovered rules) — otherwise they'd sit on screen permanently. */
/* eslint-disable jsx-a11y/no-static-element-interactions, no-console, consistent-return, react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardView } from "./KeyboardView";
import type { KeyboardModel, LensSettings, LensState } from "../shared/types";

const RESIZE_DIRS = ["n", "s", "e", "w", "nw", "ne", "sw", "se"] as const;
type ResizeDir = (typeof RESIZE_DIRS)[number];

function ResizeFrame() {
  function startResize(dir: ResizeDir) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      document.body.classList.add("resizing");
      // Screen-absolute coords, not clientX/clientY: resizing from an n/w edge
      // moves the window itself under a physically-stationary cursor, which
      // shifts where that cursor lands in the window's own (client) coordinate
      // space — Chromium then fires a synthetic mousemove reporting that shift
      // as if the mouse had moved, which fed straight back into another
      // resize call and oscillated forever (visible as the "vibrating" jitter,
      // and never on a pure se resize, which never moves the window). screenX/
      // screenY are unaffected by the window's own position, same fix already
      // used for the move handle below.
      let lastX = e.screenX;
      let lastY = e.screenY;
      const onMove = (ev: MouseEvent) => {
        const dx = ev.screenX - lastX;
        const dy = ev.screenY - lastY;
        lastX = ev.screenX;
        lastY = ev.screenY;
        window.lens?.winResize(dir, dx, dy);
      };
      const onUp = () => {
        document.body.classList.remove("resizing");
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
  }
  return (
    <div className="resize-frame">
      <div className="resize-border" />
      {RESIZE_DIRS.map(dir => (
        <div key={dir} className={`resize-handle resize-${dir}`} onMouseDown={startResize(dir)} />
      ))}
    </div>
  );
}

export function App() {
  const [model, setModel] = useState<KeyboardModel | null>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [settings, setSettings] = useState<LensSettings | null>(null);
  const [configFound, setConfigFound] = useState(false);
  const isDragging = useRef(false);
  const appRef = useRef<HTMLDivElement>(null);
  const keyboardSizerRef = useRef<HTMLDivElement>(null);

  const setHovered = useCallback((v: boolean) => {
    if (v) appRef.current?.classList.add("hovered");
    else appRef.current?.classList.remove("hovered");
  }, []);

  useEffect(() => {
    if (!window.lens) return;

    window.lens.getState().then((s: LensState) => {
      if (s.model) setModel(s.model);
      setActiveLayer(s.activeLayer);
      setConfigFound(s.configFound);
    });
    window.lens.getSettings().then((s: LensSettings) => setSettings(s));

    const offModel = window.lens.onModel(m => {
      setModel(m);
      setConfigFound(true);
    });
    const offLayer = window.lens.onActiveLayer(l => setActiveLayer(l));
    const offSettings = window.lens.onSettings(s => setSettings(s));

    return () => {
      offModel();
      offLayer();
      offSettings();
    };
  }, []);

  // Keep the hover-revealed frame/glow in sync when Resize Mode itself gets
  // toggled mid-session (e.g. from the tray) while the cursor already happens
  // to be sitting over the keyboard, or turn it off outright when disabled.
  useEffect(() => {
    if (!settings) return;
    if (settings.resizeMode) {
      if (keyboardSizerRef.current?.matches(":hover")) setHovered(true);
    } else {
      setHovered(false);
    }
  }, [settings?.resizeMode, setHovered]);

  if (!settings) return null;

  if (!configFound || !model) {
    return (
      <div className="app">
        <div className="centered" style={{ flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#eef2f7" }}>Waiting for Bazecor…</div>
          <div style={{ fontSize: 14, color: "#6b7280", maxWidth: 320, textAlign: "center" }}>
            Open Bazecor with a Dygma keyboard connected to generate the config file.
          </div>
        </div>
      </div>
    );
  }

  const layerNames = model.layerNames?.length ? model.layerNames : settings.layerNames;

  function handleBoardMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!settings?.resizeMode || e.button !== 0) return;
    e.preventDefault();
    isDragging.current = true;
    // Capture the cursor's offset inside the window once. Each move sets the
    // window's top-left to (cursorScreen - grabOffset) absolutely, so the grab
    // point stays under the cursor and errors never accumulate (delta tracking
    // drifted because main read the position back from getBounds each frame).
    const grabX = e.screenX - window.screenX;
    const grabY = e.screenY - window.screenY;
    const onMove = (ev: MouseEvent) => {
      window.lens?.winMove(ev.screenX - grabX, ev.screenY - grabY);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      // onMouseLeave won't fire if the drag ends with the cursor outside the
      // keyboard element, so check explicitly once the drag settles.
      setTimeout(() => {
        if (!keyboardSizerRef.current?.matches(":hover") && settings?.resizeMode) setHovered(false);
      }, 50);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div ref={appRef} className="app">
      <div className="board">
        <div
          ref={keyboardSizerRef}
          className="keyboard-sizer"
          // .board fills the whole window, but the draggable-to-move area must
          // stop at the visible keyboard's own box (this element, exactly what
          // the blue resize frame outlines), not extend into any leftover
          // margin around it.
          onMouseDown={handleBoardMouseDown}
          onMouseEnter={() => {
            if (settings?.resizeMode) setHovered(true);
          }}
          onMouseLeave={() => {
            if (!isDragging.current && !document.body.classList.contains("resizing")) setHovered(false);
          }}
        >
          <KeyboardView model={model} activeLayer={activeLayer} layout={settings.layout} layerNames={layerNames} />
          <ResizeFrame />
        </div>
      </div>
    </div>
  );
}
