export default function rgb2w(rgb) {
  let Ri = rgb.r;
  let Gi = rgb.g;
  let Bi = rgb.b;
  let minVal = Math.min(Ri, Math.min(Gi, Bi));

  let Wo = minVal;
  let Bo = Bi - minVal;
  let Ro = Ri - minVal;
  let Go = Gi - minVal;

  let result = { Ro, Go, Bo, Wo };

  return result;
}
