import type { ThumbPath } from "./defy-thumb-paths";

/* Raise2 thumb-key SVG silhouettes, extracted verbatim from Bazecor Key.tsx
 * (the "t5" / "t8" keyType branches — shared with Raise 1, whose thumb cluster
 * Raise2 reuses unchanged). `base` is the outer bezel path (drawn in the dark
 * key base color); `inner` is the inset top face (drawn at translate(4,0)
 * relative to the key origin and filled with the LED color). Unlike Defy's 16
 * unique thumb shapes, Raise2's thumb row is mostly plain rects — only these
 * two wing keys (left = t5, right = t8) have a custom silhouette. */

export const RAISE2_THUMB_PATHS: Record<string, ThumbPath> = {
  "raise2-t5": {
    base: "M1.37773 4.98057C-0.325982 3.04224 1.05038 0 3.63103 0H115C117.209 0 119 1.79086 119 4V53C119 55.2091 117.209 57 115 57H49.8154C48.0899 57 46.4479 56.2571 45.3088 54.9611L1.37773 4.98057Z",
    inner:
      "M0.930799 5.08781C-0.913514 3.18477 0.434998 0 3.0851 0H108C110.209 0 112 1.79086 112 4V47C112 49.2091 110.209 51 108 51H47.9666C46.3427 51 44.7882 50.3418 43.658 49.1756L0.930799 5.08781Z",
  },
  "raise2-t8": {
    base: "M118.378 4.98057C120.082 3.04224 118.706 0 116.125 0H4.75611C2.54697 0 0.756104 1.79086 0.756104 4V53C0.756104 55.2091 2.54696 57 4.7561 57H69.9407C71.6662 57 73.3082 56.2571 74.4473 54.9611L118.378 4.98057Z",
    inner:
      "M111.825 5.08781C113.67 3.18477 112.321 0 109.671 0H4.75611C2.54697 0 0.756104 1.79086 0.756104 4V47C0.756104 49.2091 2.54696 51 4.7561 51H64.7895C66.4134 51 67.9679 50.3418 69.0981 49.1756L111.825 5.08781Z",
  },
};
