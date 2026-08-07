import React from "react";
import type { DecodedKey, KeyboardModel } from "../shared/types";
import { DEFY_KEYS, DEFY_SVG_W, DEFY_VIEW_Y, DEFY_VIEW_H } from "./geometry-defy";
import { DEFY_THUMB_PATHS, DEFY_THUMB_ROTATION, DEFY_THUMB_CENTER } from "./defy-thumb-paths";
import { decodeKey, superkeyIndex, layoutOverrides, shiftOverrides } from "./keycodes";
import { keyLabel, fg } from "./key-label";

interface Props {
  model: KeyboardModel;
  activeLayer: number;
  layout: string;
  layerNames?: string[];
}

/**
 * Renders the Defy layout in the overlay. Shares Lens' key-cell look with the
 * Sonsei view (same fonts, modifier boxes, color/contrast rules) but drives it
 * from DEFY_KEYS geometry. Regular keys are rounded rects; thumb keys use their
 * real Layout-Editor silhouettes (DEFY_THUMB_PATHS: outer bezel + inset color
 * face). Unlike the Sonsei view the two halves are not rotated — the Defy
 * coordinates already bake the split-ergo stagger into their y values.
 */
export const DefyKeyboardView: React.FC<Props> = ({ model, activeLayer, layout, layerNames }) => {
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

  function getLabel(keyIndex: number): DecodedKey {
    const code = keymapLayer[keyIndex] ?? 0;
    const sk = superkeyIndex(code);
    if (sk !== null) {
      const name = model.superkeyNames?.[sk] || `SK${sk + 1}`;
      return { primary: "SUPER", subtitle: name, hold: "" };
    }
    return decodeKey(code, overrides, names, macroNames, shiftSymbols);
  }

  function renderKey(key: (typeof DEFY_KEYS)[0]) {
    const color = getColor(key.ledIndex);
    const label = getLabel(key.index);
    const fgColor = fg(color.r, color.g, color.b);
    const { x, y, w, h } = key;

    // Thumb keys: draw the editor silhouette (outer bezel + inset color face) in a
    // group translated to the key origin, so the extracted paths' local coords hold.
    const thumb = key.thumbType ? DEFY_THUMB_PATHS[key.thumbType] : undefined;
    if (thumb) {
      const fallbackCenter: [number, number] = [4 + (w - 8) / 2, (h - 8) / 2];
      const [lcx, lcy] = key.thumbType ? (DEFY_THUMB_CENTER[key.thumbType] ?? fallbackCenter) : fallbackCenter;
      const rotation = key.thumbType ? (DEFY_THUMB_ROTATION[key.thumbType] ?? 0) : 0;
      return (
        <g key={`k-${key.index}`} transform={`translate(${x},${y})`}>
          <g className="key-shadow-hover" transform="translate(0,4)">
            <path d={thumb.base} fill={color.css} />
          </g>
          <path d={thumb.base} fill="#303949" />
          <path d={thumb.base} fill="url(#lens-key-sheen)" fillOpacity="0.35" />
          <g transform="translate(4,0)">
            <g className="key-shadow-middle" transform="translate(0,12)">
              <path d={thumb.inner} fill={color.css} />
            </g>
            <path d={thumb.inner} fill={color.css} />
            <path d={thumb.inner} fill="url(#lens-key-sheen)" fillOpacity="0.45" />
          </g>
          {keyLabel(lcx, lcy, 0, h, label, fgColor, rotation)}
        </g>
      );
    }

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

  const layerName = names[layer] ?? `Layer ${layer}`;

  return (
    <div className="keyboard-view">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 ${DEFY_VIEW_Y} ${DEFY_SVG_W} ${DEFY_VIEW_H}`}
        style={{ width: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="lens-key-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="25%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g id="defy-keyshapes">{DEFY_KEYS.map(renderKey)}</g>
        <text
          x={DEFY_SVG_W / 2}
          y={DEFY_VIEW_Y + DEFY_VIEW_H - 12}
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
