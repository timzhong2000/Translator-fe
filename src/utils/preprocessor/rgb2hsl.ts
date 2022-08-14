export const rgb2hsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const temp = { h: 0, s: 0, l: 0 };
  // compute H
  if (min === max) {
    temp.h = 0;
  } else if (max === r && g > b) {
    temp.h = (60 * (g - b)) / (max - min);
  } else if (max === g) {
    temp.h = (60 * (b - r)) / (max - min) + 120;
  } else if (max === b) {
    temp.h = (60 * (r - g)) / (max - min) + 240;
  }

  temp.l = (max + min) / 2;
  if (temp.l === 0 || max === min) {
    temp.s = 0;
  } else if (temp.l > 0 && temp.l <= 0.5) {
    temp.s = (max - min) / (2 * temp.l);
  } else if (temp.l > 0.5) {
    temp.s = (max - min) / (2 - 2 * temp.l);
  }
  return temp;
};

export const rgb2h = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  if (min === max) {
    h = 0;
  } else if (max === r && g >= b) {
    h = (60 * (g - b)) / (max - min);
  } else if (max === r && g < b) {
    h = (60 * (g - b)) / (max - min) + 360;
  } else if (max === g) {
    h = (60 * (b - r)) / (max - min) + 120;
  } else if (max === b) {
    h = (60 * (r - g)) / (max - min) + 240;
  }
  return h as number;
};

export const rgb2l = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return (max + min) / 2;
};

export const rgb2s = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = rgb2l(r, g, b);
  let s;
  if (l === 0 || max === min) {
    s = 0;
  } else if (l > 0 && l <= 0.5) {
    s = (max - min) / (2 * l);
  } else if (l > 0.5) {
    s = (max - min) / (2 - 2 * l);
  }
  return s as number;
};
