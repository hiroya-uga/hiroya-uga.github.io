/** min 以上 max 以下の整数をランダムに返す */
export const getRandomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
