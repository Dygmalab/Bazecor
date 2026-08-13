import type { ThumbPath } from "./defy-thumb-paths";

/* Raise2 ISO's Enter key SVG silhouette, extracted verbatim from Bazecor
 * Key.tsx (the "enterKey" keyType branch). ANSI's Enter is a plain 57x57
 * rounded rect (drawn with the same rect path as every other regular key);
 * ISO's is a tall L-shape (69x124) that dog-legs down into the row below, so
 * it needs its own silhouette instead of a rect — same {base, inner} shape
 * used for the thumb wing keys (raise2-thumb-paths.ts). */

export const RAISE2_ISO_ENTER_PATH: Record<string, ThumbPath> = {
  "raise2-iso-enter": {
    base: "M69 4C69 1.79086 67.2091 0 65 0H4C1.79086 0 0 1.79086 0 4V53C0 55.2091 1.79086 57 4 57H17C19.2091 57 21 58.7909 21 61V120C21 122.209 22.7909 124 25 124H65C67.2091 124 69 122.209 69 120V4Z",
    inner:
      "M61 4C61 1.79086 59.2091 0 57 0H4C1.79086 0 0 1.79086 0 4V47C0 49.2091 1.79086 51 4 51H17C19.2091 51 21 52.7909 21 55V114C21 116.209 22.7909 118 25 118H57C59.2091 118 61 116.209 61 114V4Z",
  },
};
