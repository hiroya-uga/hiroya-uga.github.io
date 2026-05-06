'use client';

import { getTheme } from '@/utils/get-theme';
import { setLocalStorage } from '@/utils/local-storage';
import { useEffect, useState } from 'react';

import styles from './WikiThemeToggle.module.css';

export const WikiThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getTheme() === 'dark');
  }, []);

  const toggle = () => {
    setLocalStorage('theme', isDark ? 'light' : 'dark');
    globalThis.window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'ライトモード' : 'ダークモード'}
      className={styles.root}
    >
      <span>{isDark ? 'ライトモード' : 'ダークモード'}</span>
    </button>
  );
};
