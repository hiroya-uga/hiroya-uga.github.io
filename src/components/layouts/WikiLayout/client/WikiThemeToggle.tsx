'use client';

import { useThemeChange } from '@/hooks/use-theme-change';

import { THEME_SWITCH_DESCRIPTION_ID } from '@/constants/id';
import styles from './WikiThemeToggle.module.css';

const currentThemeIs = (theme: string) =>
  `現在のテーマは「${theme === 'dark' ? 'ダークモード' : 'ライトモード'}」です。`;

export const WikiThemeToggle = () => {
  const { theme, changeTheme } = useThemeChange();
  const id = THEME_SWITCH_DESCRIPTION_ID;
  const isDark = theme === 'dark';

  return (
    <>
      <button
        type="button"
        onClick={() => changeTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'ライトモード' : 'ダークモード'}
        aria-describedby={id}
        className={styles.root}
      >
        <span>{isDark ? 'ライトモード' : 'ダークモード'}</span>
      </button>
      <span id={id} aria-live="assertive" className="sr-only select-none">
        {currentThemeIs(theme)}
      </span>
    </>
  );
};
