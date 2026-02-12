'use client';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';
import { useCallback, useEffect, useId, useMemo, useRef, useSyncExternalStore } from 'react';

const { window } = globalThis;

export const ThemeSwitch = () => {
  const id = useId();
  const styleElement = useMemo(() => {
    if (window === undefined) {
      return null;
    }

    const style = document.createElement('style');

    style.textContent = `
      * {
        transition-property: color, background-color, border-color, box-shadow, text-decoration-color, fill, stroke, filter !important;
        transition-duration: 0.3s!important;
        transition-timing-function: ease-out!important;
      }
    `;

    return style;
  }, []);
  const setTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | number>(-1);

  const changeTheme = useCallback(
    (newTheme: string) => {
      if (newTheme !== 'light' && newTheme !== 'dark') return;
      if (styleElement instanceof HTMLStyleElement) {
        clearTimeout(setTimeoutIdRef.current);
        document.head.appendChild(styleElement);
        setTimeoutIdRef.current = globalThis.setTimeout(() => {
          styleElement.remove();
        }, 300);
      }

      document.documentElement.dataset.theme = newTheme;

      // 同じタブ内で変更を反映させるため、storageイベントを手動で発火
      globalThis.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
    },
    [styleElement],
  );

  const theme = useSyncExternalStore(
    (callback) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'theme') {
          callback();
        }
      };

      globalThis.addEventListener('storage', handleStorageChange);

      return () => {
        globalThis.removeEventListener('storage', handleStorageChange);
      };
    },
    () => getLocalStorage('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    () => 'light',
  );

  useEffect(() => {
    changeTheme(theme);
  }, [theme, changeTheme]);

  return (
    <>
      <button
        type="button"
        className={clsx([
          'border-high-contrast bg-tertiary relative block h-8 w-16 rounded-full border',
          'after:bg-secondary after:border-high-contrast after:-top-1PX after:-left-1PX after:pointer-events-none after:absolute after:size-8 after:translate-x-8 after:rounded-full after:border after:transition-[translate] after:duration-300',
          'dark:after:translate-x-0',
        ])}
        onClick={() => {
          const newTheme = theme === 'dark' ? 'light' : 'dark';
          changeTheme(newTheme);
          setLocalStorage('theme', newTheme);
        }}
        aria-describedby={id}
        title={theme === 'dark' ? 'ライトモードに切り替える' : 'ダークモードに切り替える'}
      >
        <span className="absolute inset-0 select-none overflow-hidden rounded-full text-transparent">
          外観の切り替え
        </span>

        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          className="pointer-events-none absolute bottom-0 right-2 top-0 my-auto size-4"
        >
          <g>
            <path
              d="M403.469,395.031c-129.203,0-233.938-104.75-233.938-233.953c0-62.438,24.5-119.125,64.375-161.078
		C109.313,17.953,13.563,125.094,13.563,254.656C13.563,396.781,128.781,512,270.906,512c98.688,0,184.359-55.578,227.531-137.125
		C469.406,387.781,437.297,395.031,403.469,395.031z"
              style={{ fill: 'white' }}
            ></path>
            <path
              d="M349.641,179.328c1.047,1.016,1.516,2.484,1.266,3.922l-8.563,49.938c-0.281,1.672,0.406,3.344,1.766,4.344
		c1.359,0.984,3.156,1.109,4.656,0.328l44.859-23.578c1.281-0.688,2.813-0.688,4.109,0l44.859,23.578
		c1.484,0.781,3.297,0.656,4.656-0.328c1.359-1,2.031-2.672,1.75-4.344l-8.563-49.938c-0.25-1.438,0.219-2.906,1.266-3.922
		L478,143.969c1.203-1.172,1.641-2.938,1.125-4.531c-0.531-1.594-1.906-2.781-3.578-3.016l-50.141-7.297
		c-1.438-0.203-2.688-1.109-3.344-2.406l-22.422-45.453c-0.734-1.516-2.281-2.453-3.969-2.453c-1.672,0-3.219,0.938-3.953,2.453
		l-22.438,45.453c-0.641,1.297-1.891,2.203-3.328,2.406l-50.141,7.297c-1.672,0.234-3.063,1.422-3.578,3.016
		s-0.078,3.359,1.125,4.531L349.641,179.328z"
              style={{ fill: 'white' }}
            ></path>
          </g>
        </svg>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          className="pointer-events-none absolute bottom-0 left-2 top-0 my-auto size-5"
        >
          <g>
            <path
              d="M357.165,154.831c-25.826-25.856-61.692-41.883-101.153-41.883c-39.482,0-75.326,16.028-101.174,41.883
		c-25.871,25.848-41.928,61.732-41.904,101.17c-0.024,39.486,16.033,75.33,41.904,101.177
		c25.848,25.871,61.692,41.924,101.174,41.908c39.461,0.016,75.326-16.037,101.153-41.908c25.871-25.848,41.924-61.692,41.9-101.177
		C399.089,216.563,383.036,180.678,357.165,154.831z M338.223,338.239c-21.076,21.068-50.056,34.04-82.21,34.056
		c-32.155-0.016-61.16-12.988-82.231-34.056c-21.076-21.084-34.044-50.085-34.065-82.239c0.021-32.154,12.989-61.131,34.065-82.207
		c21.072-21.076,50.076-34.064,82.231-34.064c32.154,0,61.134,12.989,82.21,34.064c21.072,21.076,34.06,50.053,34.06,82.207
		C372.283,288.154,359.295,317.155,338.223,338.239z"
              style={{ fill: 'black' }}
            ></path>
            <path
              d="M237.313,173.46c-32.334,7.307-57.538,32.975-64.223,65.512c-1.2,5.925,2.621,11.728,8.55,12.947
		c5.929,1.195,11.704-2.617,12.924-8.55c4.909-24.051,23.696-43.143,47.569-48.524c5.905-1.333,9.616-7.194,8.282-13.102
		C249.083,175.842,243.198,172.127,237.313,173.46z"
              style={{ fill: 'black' }}
            ></path>
            <rect x="242.601" y="434.718" width="26.802" height="77.282" style={{ fill: 'black' }}></rect>
            <rect x="242.601" width="26.802" height="77.33" style={{ fill: 'black' }}></rect>
            <polygon
              points="372.885,391.843 427.537,446.488 446.5,427.574 391.831,372.897 	"
              style={{ fill: 'black' }}
            ></polygon>
            <polygon
              points="139.115,120.181 84.442,65.512 65.524,84.482 120.173,139.128 	"
              style={{ fill: 'black' }}
            ></polygon>
            <rect x="434.69" y="242.638" width="77.297" height="26.774" style={{ fill: 'black' }}></rect>
            <rect x="0.013" y="242.638" width="77.28" height="26.774" style={{ fill: 'black' }}></rect>
            <polygon
              points="446.5,84.482 427.537,65.512 372.885,120.181 391.831,139.128 	"
              style={{ fill: 'black' }}
            ></polygon>
            <polygon
              points="65.524,427.574 84.442,446.488 139.115,391.843 120.173,372.897 	"
              style={{ fill: 'black' }}
            ></polygon>
          </g>
        </svg>
      </button>

      <span id={id} aria-live="assertive" className="sr-only select-none">
        現在のテーマは「{theme === 'dark' ? 'ダークモード' : 'ライトモード'}」です。
      </span>
    </>
  );
};
