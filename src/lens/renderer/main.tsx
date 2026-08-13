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

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(<App />);
