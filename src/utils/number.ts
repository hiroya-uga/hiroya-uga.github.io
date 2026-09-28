/** min 以上 max 以下の整数をランダムに返す */
export const getRandomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** value を min 以上 max 以下に丸める */
export const clamp = ({ value, min, max }: { value: number; min: number; max: number }) =>
  Math.min(max, Math.max(min, value));
