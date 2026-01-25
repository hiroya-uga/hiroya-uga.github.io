import clsx from 'clsx';
import { RefObject } from 'react';

import { keyboardSvgData } from '@/app/(ja)/(wide-content)/tools/keyboard-event/constants';

import styles from './LastKey.module.css';

const keys = keyboardSvgData;

export const LastKey = ({
  pressedKeys,
  lastKey,
  textFieldRef,
}: {
  pressedKeys: string[];
  lastKey: string;
  textFieldRef: RefObject<HTMLTextAreaElement | null>;
}) => {
  return (
    <p className={clsx([styles.root, 'relative mb-6 sm:mb-14', lastKey !== '' && 'before:opacity-0'])}>
      <span
        className={clsx([
          'mx-auto mb-4 block w-fit transition-transform duration-700 sm:mb-14',
          lastKey === '' && 'translate-y-[17vw] sm:translate-y-full',
        ])}
      >
        あなたが最後に押したキーは
        <kbd
          className="mx-auto my-2 block w-fit min-w-24 whitespace-pre-wrap break-all text-center text-3xl"
          onPointerDown={(e) => {
            e.preventDefault();
            textFieldRef.current?.focus();
          }}
        >
          {lastKey === ' ' ? 'Space' : lastKey || ' '}
        </kbd>
        です。
      </span>
      <span translate="no">
        <svg
          viewBox="0 0 1032 292"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          className={clsx('transition-fade duration-700', lastKey === '' && 'invisible opacity-0')}
        >
          {keys.map(({ key, x, y, width, height, label }, index) => {
            const isPressed = pressedKeys.includes(key);
            const className = clsx(isPressed ? styles.isPressed : 'transition-colors');
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={width || 40}
                  height={height || 40}
                  rx="5"
                  stroke="black"
                  className={className}
                />
                <text
                  x={x + (width || 40) / 2}
                  y={y + (height || 40) / 2 + 5}
                  textAnchor="middle"
                  fontSize={12}
                  className={className}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </span>
    </p>
  );
};
