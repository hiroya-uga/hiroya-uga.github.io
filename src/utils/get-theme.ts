import { getLocalStorage } from './local-storage';

export const getTheme = () =>
  getLocalStorage('theme') ??
  (globalThis?.window?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
