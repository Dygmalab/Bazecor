import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

// Chromium sends wheel+ctrlKey for trackpad pinch-to-zoom. Block it so the
// overlay never zooms and the resize frame stays correctly sized.
window.addEventListener(
  "wheel",
  e => {
    if (e.ctrlKey) e.preventDefault();
  },
  { passive: false },
);

// Linux has no native window opacity, so the main process sends it here and the
// whole page is faded instead (the window itself is transparent). Registered
// before the first render so the value sent on ready-to-show is never missed.
window.lens.onOpacity(v => {
  document.documentElement.style.opacity = String(v);
});

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(<App />);
