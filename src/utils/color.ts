import convert from 'color-convert';

export const convertRgbToHsl = ([r, g, b]: [number, number, number]) => {
  const [h, s, l] = convert.rgb.hsl(r, g, b);

  // color-convertは H:0-360, S/L:0-100 なので合わせる
  return [h / 360, s / 100, l / 100];
};

export const convertHslToHex = ([h, s, l]: [number, number, number]) => {
  // 入力が 0-1 前提なのでスケール変換
  const hex = convert.hsl.hex(h * 360, s * 100, l * 100);

  return `#${hex}`;
};

export const convertHexToRgb = (hex: string) => {
  // # を許容するために除去
  const normalized = hex.replace(/^#/, '');

  return convert.hex.rgb(normalized);
};
