export default function rgbw2b(rgbw) {
  console.log("color received", rgbw);
  let r = rgbw.w + rgbw.r > 255 ? 255 : rgbw.w + rgbw.r;
  let g = rgbw.w + rgbw.g > 255 ? 255 : rgbw.w + rgbw.g;
  let b = rgbw.w + rgbw.b > 255 ? 255 : rgbw.w + rgbw.b;

  let result = { r, g, b };

  return result;
}
