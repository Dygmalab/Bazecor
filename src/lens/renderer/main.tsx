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

// Linux: the compositor draws the Resize Mode frame instead of our own (see
// ".resize-border" in index.css) — its border follows the WM theme's color and
// corner rounding, which our hardcoded frame can't.
document.body.classList.toggle("platform-linux", navigator.userAgent.includes("Linux"));

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(<App />);
