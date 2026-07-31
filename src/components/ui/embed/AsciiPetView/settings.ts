import { LocalStorageItems, getLocalStorage, setLocalStorage } from '@/utils/local-storage';

const STORAGE_KEY = 'savedata-ascii-pet';

export type AsciiPetSettings = LocalStorageItems[typeof STORAGE_KEY];

export const readAsciiPetSettings = (): AsciiPetSettings => {
  return getLocalStorage(STORAGE_KEY) ?? {};
};

export const writeAsciiPetSettings = (patch: AsciiPetSettings): void => {
  setLocalStorage(STORAGE_KEY, { ...readAsciiPetSettings(), ...patch });
};
