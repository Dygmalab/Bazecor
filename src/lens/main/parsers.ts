import type { LensCombo, PaletteColor } from "../shared/types";

export function parseKeymap(raw: string, keysPerLayer: number): number[][] {
  const nums = raw.trim().split(/\s+/).map(Number);
  const layers: number[][] = [];
  for (let i = 0; i < nums.length; i += keysPerLayer) {
    layers.push(nums.slice(i, i + keysPerLayer));
  }
  return layers;
}

export function parsePaletteRGB(raw: string): PaletteColor[] {
  const nums = raw.trim().split(/\s+/).map(Number);
  const out: PaletteColor[] = [];
  for (let i = 0; i + 2 < nums.length; i += 3) {
    const [r, g, b] = nums.slice(i, i + 3);
    out.push({ r, g, b, w: 0, rgb: `rgb(${r},${g},${b})` });
  }
  return out;
}

export function parsePaletteRGBW(raw: string): PaletteColor[] {
  const nums = raw.trim().split(/\s+/).map(Number);
  const out: PaletteColor[] = [];
  for (let i = 0; i + 3 < nums.length; i += 4) {
    const [r, g, b, w] = nums.slice(i, i + 4);
    // Match Bazecor's rgbw2b (src/api/color/RGBWtoRGB.ts): the white channel is
    // additive on top of r/g/b, clamped to 255. Without this, a pure white LED
    // (r=g=b=0, w=255) would render as black.
    const dr = Math.min(255, Math.max(0, r) + Math.max(0, w));
    const dg = Math.min(255, Math.max(0, g) + Math.max(0, w));
    const db = Math.min(255, Math.max(0, b) + Math.max(0, w));
    out.push({ r: dr, g: dg, b: db, w, rgb: `rgb(${dr},${dg},${db})` });
  }
  return out;
}

export function parseColormap(raw: string, layerSize: number): number[][] {
  const nums = raw.trim().split(/\s+/).map(Number);
  const layers: number[][] = [];
  for (let i = 0; i < nums.length; i += layerSize) {
    layers.push(nums.slice(i, i + layerSize));
  }
  return layers;
}

export function parseSuperkeys(raw: string): number[][] {
  if (!raw.trim()) return [];
  const nums = raw.trim().split(/\s+/).map(Number);
  const ACTIONS_PER_SUPERKEY = 5;
  const out: number[][] = [];
  for (let i = 0; i + ACTIONS_PER_SUPERKEY <= nums.length; i += ACTIONS_PER_SUPERKEY) {
    out.push(nums.slice(i, i + ACTIONS_PER_SUPERKEY));
  }
  return out;
}

/* `combos.map` wire format (Bazecor src/api/parsers/combos.ts): a count, then
 * a fixed 32 records of [p0, p1, p2, p3, layer, flags, action]. */
const COMBO_MEMBERS = 4;
const COMBO_FIELDS = COMBO_MEMBERS + 3;
const COMBO_POSITION_UNUSED = 255;
const COMBO_FLAG_ENABLED = 0x01;

/** Enabled combos with at least one key, in list order (combo N is index N-1). */
export function parseCombos(raw: string): LensCombo[] {
  if (!raw.trim()) return [];
  const nums = raw.trim().split(/\s+/).map(Number);
  const count = nums[0];
  if (!Number.isFinite(count) || count <= 0) return [];

  const out: LensCombo[] = [];
  for (let i = 0; i < count; i += 1) {
    const base = 1 + i * COMBO_FIELDS;
    if (base + COMBO_FIELDS > nums.length) break;
    const positions = nums.slice(base, base + COMBO_MEMBERS).filter(p => p !== COMBO_POSITION_UNUSED);
    const layer = nums[base + COMBO_MEMBERS];
    const flags = nums[base + COMBO_MEMBERS + 1];
    // Disabled combos keep their slot so the numbering matches Bazecor's "C<n>".
    // eslint-disable-next-line no-bitwise
    out.push({ positions: flags & COMBO_FLAG_ENABLED ? positions : [], layer });
  }
  return out;
}

export function parseNames(raw: string): string[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    /* fall through to space-split */
  }
  return raw.trim().split(/\s+/);
}

export function parseActiveLayer(raw: string): number {
  const bits = parseInt(raw.trim(), 10);
  if (Number.isNaN(bits) || bits === 0) return 0;
  return Math.floor(Math.log2(bits));
}
