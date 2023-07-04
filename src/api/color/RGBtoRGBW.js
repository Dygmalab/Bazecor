export default function rgb2w(rgb) {
  const Ri = rgb.r;
  const Gi = rgb.g;
  const Bi = rgb.b;
  const minVal = Math.min(Ri, Math.min(Gi, Bi));

  const w = minVal;
  const b = Bi - minVal;
  const r = Ri - minVal;
  const g = Gi - minVal;

  const result = { r, g, b, w };

  return result;
}
