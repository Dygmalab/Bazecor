export default function rgbw2b(rgbw) {
  const r = rgbw.w + rgbw.r > 255 ? 255 : rgbw.w + rgbw.r;
  const g = rgbw.w + rgbw.g > 255 ? 255 : rgbw.w + rgbw.g;
  const b = rgbw.w + rgbw.b > 255 ? 255 : rgbw.w + rgbw.b;

  const result = `rgb(${r}, ${g}, ${b})`;

  return { r, g, b, rgb: result };
}
