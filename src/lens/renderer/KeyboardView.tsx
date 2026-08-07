import React from "react";
import type { KeyboardModel } from "../shared/types";
import { SONSEI_KEYS } from "./geometry-sonsei";
import { DefyKeyboardView } from "./DefyKeyboardView";
import { Raise2KeyboardView } from "./Raise2KeyboardView";
import { decodeKey, superkeyIndex, layoutOverrides, shiftOverrides } from "./keycodes";
import { keyLabel, fg, fitFontSize, splitLongWord } from "./key-label";
import { DEFY_THUMB_ROTATION } from "./defy-thumb-paths";

interface Props {
  model: KeyboardModel;
  activeLayer: number;
  layout: string;
  layerNames?: string[];
}

const SVG_W = 1270;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SVG_H = 560; // full coordinate space (key positions reference this)
const VIEW_Y = 50; // 27 px above topmost key corners (~y=77 after 10° rotation)
const VIEW_H = 462; // bottom = 512, giving 10px below the innermost thumb key paths
// (thumb arcs extend to ~y=503 after rotation — wider than the rect bounds)
const FS = 13;
const FSS = 11; // two-line keys (Super/name, Macro/name) — same size both lines

// Outer silhouette paths for each Sonsei thumb key type (from Bazecor Key.tsx)
const THUMB_PATHS: Record<number, string> = {
  48: "M0 4.989a4 4 0 014-4h49.202a4 4 0 013.994 4.217l-2.39 43.81a4 4 0 01-3.994 3.783H4a4 4 0 01-4-4V4.989z",
  49: "M45.102 55.67a335.167 335.167 0 00-41.705-3.605 3.486 3.486 0 01-3.39-3.698L2.88 3.743A4 4 0 016.872 0h51.252c2.635 0 4.55 2.503 3.861 5.046L49.014 52.943a3.461 3.461 0 01-3.912 2.726z",
  50: "M2.662 57.508a160.536 160.536 0 0134.165 12.66 3.438 3.438 0 004.481-1.256l31.202-49.79a3.507 3.507 0 00-1.376-4.954C53.5 5.164 35.095.958 15.318.007a3.51 3.51 0 00-3.652 2.774L.078 53.406a3.485 3.485 0 002.513 4.102h.071z",
  51: "M1.484 56.77a113.488 113.488 0 0125.225 23.891 3.368 3.368 0 004.71.666l42.113-29.81a3.447 3.447 0 001.355-1.953 3.476 3.476 0 00-.225-2.374C68.256 33.426 52.758 12.032 35.99.574a3.445 3.445 0 00-2.656-.49 3.482 3.482 0 00-2.197 1.583L.519 52.063a3.522 3.522 0 00-.446 2.548c.18.876.685 1.648 1.412 2.16z",
  56: "M73.516 56.77a113.488 113.488 0 00-25.225 23.891 3.368 3.368 0 01-4.71.666L1.468 51.517a3.447 3.447 0 01-1.355-1.953 3.476 3.476 0 01.225-2.374C6.744 33.426 22.242 12.032 39.01.574a3.445 3.445 0 012.656-.49 3.482 3.482 0 012.197 1.583l30.618 50.396c.466.76.626 1.672.446 2.548a3.497 3.497 0 01-1.412 2.16z",
  57: "M70.368 57.508a160.536 160.536 0 00-34.165 12.66 3.438 3.438 0 01-4.481-1.256L.52 19.122a3.51 3.51 0 011.375-4.954C19.53 5.164 37.936.958 57.714.007a3.51 3.51 0 013.65 2.774l11.588 50.625a3.485 3.485 0 01-2.513 4.102h-.071z",
  58: "M17.25 55.67a335.168 335.168 0 0141.705-3.605 3.486 3.486 0 003.39-3.698L59.472 3.743A4 4 0 0055.48 0H4.227C1.593 0-.323 2.503.367 5.046l12.971 47.897a3.462 3.462 0 003.912 2.726z",
  59: "M57.426 4a4 4 0 00-4-4H4.224A4 4 0 00.23 4.218l2.39 43.81a4 4 0 003.994 3.782h46.812a4 4 0 004-4V4z",
};

// Visual center [x, y] for each thumb key label, plus the Defy keyType whose
// rotation to reuse. Sonsei's own keymap (Keymap.jsx) renders these middle
// thumb keys with the literal "defy-t2"/"defy-t3"/"defy-t4" (and
// "defy-tR2..4") keyTypes and the same rotate(10,320,680)/rotate(-10,960,680)
// half-group wrapper Lens uses below — so DEFY_THUMB_ROTATION's angles (taken
// from Bazecor's own CSS) apply here unchanged. Centers are each key's own
// SVG path bounding-box center (computed from THUMB_PATHS below), not
// eyeballed — the fanned-out keys (t4/tR4 especially) paint well outside a
// naive 57x57 cell, so a nominal-box guess put the label off-center.
const THUMB_TEXT: Record<number, [number, number, string]> = {
  48: [28.6, 26.9, ""], // sonsei-t1:  rect, horizontal (no rotation rule)
  49: [31.1, 27.9, "defy-t2"],
  50: [36.5, 35.3, "defy-t3"],
  51: [37.5, 41.0, "defy-t4"],
  56: [37.5, 41.0, "defy-tR4"],
  57: [36.5, 35.3, "defy-tR3"],
  58: [31.3, 27.9, "defy-tR2"],
  59: [28.8, 25.9, ""], // sonsei-tR1: rect, horizontal (no rotation rule)
};

export const KeyboardView: React.FC<Props> = ({ model, activeLayer, layout, layerNames }) => {
  // Each product has its own geometry; dispatch to the matching view. The Sonsei
  // rendering below is the default (also covers unknown products).
  if (model.product?.toLowerCase() === "defy") {
    return <DefyKeyboardView model={model} activeLayer={activeLayer} layout={layout} layerNames={layerNames} />;
  }
  if (model.product?.toLowerCase() === "raise2") {
    return <Raise2KeyboardView model={model} activeLayer={activeLayer} layout={layout} layerNames={layerNames} />;
  }

  const overrides = layoutOverrides(layout);
  const shiftSymbols = shiftOverrides(layout);
  const layer = Math.min(activeLayer, model.keymap.length - 1);
  const keymapLayer = model.keymap[layer] ?? [];
  const colormapLayer = model.colormap[layer] ?? [];
  const { palette } = model;
  const names = model.layerNames?.length ? model.layerNames : (layerNames ?? []);
  const macroNames = model.macroNames ?? [];

  function getColor(ledIndex: number) {
    const pi = colormapLayer[ledIndex] ?? 0;
    const c = palette[pi] ?? { r: 30, g: 30, b: 30, rgb: "rgb(30,30,30)" };
    return { r: c.r, g: c.g, b: c.b, css: c.rgb };
  }

  function getLabel(keyIndex: number) {
    const code = keymapLayer[keyIndex] ?? 0;
    const sk = superkeyIndex(code);
    if (sk !== null) {
      const name = model.superkeyNames?.[sk] || `SK${sk + 1}`;
      return { primary: "SUPER", subtitle: name, hold: "" };
    }
    return decodeKey(code, overrides, names, macroNames, shiftSymbols);
  }

  function renderKey(key: (typeof SONSEI_KEYS)[0]) {
    const color = getColor(key.ledIndex);
    const label = getLabel(key.index);
    const fgColor = fg(color.r, color.g, color.b);
    const hasSub = Boolean(label.subtitle);

    const thumbPath = THUMB_PATHS[key.index];
    if (thumbPath) {
      const [tx, ty, rotKeyType] = THUMB_TEXT[key.index] ?? [28, 24, ""];
      const tr = rotKeyType ? (DEFY_THUMB_ROTATION[rotKeyType] ?? 0) : 0;
      const rot = tr === 0 ? undefined : `rotate(${tr},${tx},${ty})`;
      let thumbLabel: JSX.Element | null = null;
      if (hasSub) {
        thumbLabel = (
          <g transform={rot}>
            <text
              x={tx}
              y={ty - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fitFontSize(label.primary, FSS)}
              fontWeight="700"
              fontFamily="system-ui,-apple-system,sans-serif"
              fill={fgColor}
              pointerEvents="none"
            >
              {label.primary}
            </text>
            <text
              x={tx}
              y={ty + 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fitFontSize(label.subtitle ?? "", FSS)}
              fontWeight="700"
              fontFamily="system-ui,-apple-system,sans-serif"
              fill={fgColor}
              pointerEvents="none"
            >
              {label.subtitle}
            </text>
          </g>
        );
      } else if (label.primary) {
        const split = splitLongWord(label.primary);
        thumbLabel = split ? (
          <g transform={rot}>
            <text
              x={tx}
              y={ty - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fitFontSize(split[0], FSS)}
              fontWeight="700"
              fontFamily="system-ui,-apple-system,sans-serif"
              fill={fgColor}
              pointerEvents="none"
            >
              {split[0]}
            </text>
            <text
              x={tx}
              y={ty + 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fitFontSize(split[1], FSS)}
              fontWeight="700"
              fontFamily="system-ui,-apple-system,sans-serif"
              fill={fgColor}
              pointerEvents="none"
            >
              {split[1]}
            </text>
          </g>
        ) : (
          <text
            x={tx}
            y={ty}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={rot}
            fontSize={fitFontSize(label.primary, FS)}
            fontWeight="700"
            fontFamily="system-ui,-apple-system,sans-serif"
            fill={fgColor}
            pointerEvents="none"
          >
            {label.primary}
          </text>
        );
      }
      return (
        <g key={`k-${key.index}`} transform={`translate(${key.x},${key.y})`}>
          <g className="key-shadow-hover" transform="translate(0,4)">
            <path d={thumbPath} fill={color.css} />
          </g>
          <path d={thumbPath} fill="#303949" />
          <path d={thumbPath} fill="url(#lens-key-sheen)" fillOpacity="0.35" />
          <g className="key-shadow-middle" transform="translate(4,12)">
            <path d={thumbPath} fill={color.css} />
          </g>
          <path d={thumbPath} fill={color.css} />
          <path d={thumbPath} fill="url(#lens-key-sheen)" fillOpacity="0.45" />
          {thumbLabel}
        </g>
      );
    }

    const { x, y, w, h } = key;
    const cx = x + 4 + (w - 8) / 2;
    const cy = y + (h - 8) / 2;

    return (
      <g key={`k-${key.index}`}>
        <rect className="key-shadow-hover" x={x} y={y + 4} width={w} height={h} rx={4} fill={color.css} />
        <rect x={x} y={y} width={w} height={h} rx={4} fill="#303949" />
        <rect x={x} y={y} width={w} height={h} rx={4} fill="url(#lens-key-sheen)" fillOpacity="0.35" />
        <rect className="key-shadow-middle" x={x + 4} y={y + 12} width={w - 8} height={h - 8} rx={4} fill={color.css} />
        <rect x={x + 4} y={y} width={w - 8} height={h - 8} rx={4} fill={color.css} />
        <rect x={x + 4} y={y} width={w - 8} height={h - 8} rx={4} fill="url(#lens-key-sheen)" fillOpacity="0.45" />
        {keyLabel(cx, cy, y, h, label, fgColor)}
      </g>
    );
  }

  const leftKeys = SONSEI_KEYS.filter(k => k.group === "left");
  const rightKeys = SONSEI_KEYS.filter(k => k.group === "right");
  const layerName = names[layer] ?? `Layer ${layer}`;

  return (
    <div className="keyboard-view">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 ${VIEW_Y} ${SVG_W} ${VIEW_H}`}
        style={{ width: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="lens-key-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="25%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g id="keyshapes-left" transform="rotate(10, 320, 680)">
          {leftKeys.map(renderKey)}
        </g>
        <g id="keyshapes-right" transform="rotate(-10, 960, 680)">
          {rightKeys.map(renderKey)}
        </g>
        <text
          x={SVG_W / 2}
          y={VIEW_Y + VIEW_H - 12}
          textAnchor="middle"
          fontSize={13}
          fill="rgba(255,255,255,0.35)"
          fontFamily="system-ui,-apple-system,sans-serif"
          className="layer-label"
        >
          {layerName}
        </text>
      </svg>
    </div>
  );
};
