import { arrayShuffle } from '@/utils/array-shuffle';
import { COUNTER_LENGTH } from './constants';

export const getRandomIndexArray = (length: number) => {
  const digits = Array.from({ length }, (_, i) => i);
  return arrayShuffle(digits);
};

interface ShuffleCounterParams {
  counterTarget: HTMLSpanElement;
  isViewed: boolean;
}

const getRandomAccessCount = () => [...String(Math.floor(Math.random() * (10 ** COUNTER_LENGTH + 1)))];

export const shuffleCounter = ({ counterTarget, isViewed }: ShuffleCounterParams) => {
  let i = 0;
  let loop = 0;
  let indexArray = getRandomIndexArray(COUNTER_LENGTH);
  const finallyCount = getRandomAccessCount().join('').padStart(COUNTER_LENGTH, '0');

  const getValue = () => {
    if (loop !== 1) {
      const value = getRandomAccessCount();

      value[indexArray[0]] = indexArray[0] % 2 ? '縺' : '繝';
      value[indexArray[1]] = indexArray[1] % 2 ? '繧' : '縲';
      value[indexArray[2]] = indexArray[2] % 2 ? 'ｳ?' : 'ｶﾞ';
      value[indexArray[3]] = indexArray[3] % 2 ? '�' : '%';

      return value.join('');
    }

    return finallyCount;
  };

  let setIntervalId = -1;

  setTimeout(
    () => {
      const value = Array.from<string>({ length: COUNTER_LENGTH }).fill('0');
      let next = getValue().padStart(COUNTER_LENGTH, '0').replaceAll('0', '1');

      setIntervalId = globalThis.window.setInterval(() => {
        if (i < COUNTER_LENGTH) {
          value[indexArray[i]] = next[indexArray[i]];
          counterTarget.textContent = value.join('');
          i++;
        } else {
          if (loop < 2) {
            indexArray = getRandomIndexArray(COUNTER_LENGTH);
            next = getValue().padStart(COUNTER_LENGTH, '0');

            value[indexArray[0]] = next[indexArray[0]];
            counterTarget.textContent = value.join('');
            i = 1;
            loop++;
            return;
          }

          clearInterval(setIntervalId);
        }
      }, 60);
    },
    isViewed ? 0 : 1000,
  );

  return { finallyCount, cleanup: () => clearInterval(setIntervalId) };
};
