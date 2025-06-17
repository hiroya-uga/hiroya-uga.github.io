'use client';

import { Checkbox, TextField } from '@/components/Form';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from '@/app/(ja)/(common)/tools/keyboard-event/Client.module.css';
import { keyboardSvgData } from '@/app/(ja)/(common)/tools/keyboard-event/constants';
import clsx from 'clsx';

const keys = keyboardSvgData;

type Log = {
  type: string;
  key: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  isComposing: boolean;
  repeat: boolean;
  timestamp: string;
};

export const KeyboardEventContent = () => {
  const [lastKey, setLastKey] = useState('');
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [inputLog, setInputLog] = useState<Log[]>([]);
  const checkboxStatusRef = useRef({
    onkeydown: true,
    onkeypress: true,
    onkeyup: true,
  });
  const isScrollIgnored = useRef(false);

  const updateInputLog = useCallback((e: KeyboardEvent) => {
    const timestamp = new Date().toISOString();

    setInputLog((previous) =>
      [
        {
          type: e.type,
          key: e.key,
          code: e.code,
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          metaKey: e.metaKey,
          isComposing: e.isComposing,
          repeat: e.repeat,
          timestamp,
        },
        ...previous,
      ].slice(0, 100),
    );
  }, []);

  const onkeydown = useCallback(
    (e: KeyboardEvent) => {
      if (
        isScrollIgnored.current &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Home', 'End', 'PageUp', 'PageDown'].includes(
          e.code,
        )
      ) {
        const inTextArea = e.target instanceof HTMLTextAreaElement;
        const onCheckbox = e.target instanceof HTMLInputElement && e.target.type === 'checkbox';
        const shouldBeAvailableSpace = ['Space'].includes(e.code) && (inTextArea || onCheckbox);

        if (shouldBeAvailableSpace === false) {
          e.preventDefault();
        }
      }

      if (checkboxStatusRef.current.onkeydown === false) {
        return;
      }

      updateInputLog(e);
      setLastKey(e.key);
      setPressedKeys((previous) => [...new Set([...previous, e.code])]);
    },
    [updateInputLog],
  );
  const onkeypress = useCallback(
    (e: KeyboardEvent) => {
      if (checkboxStatusRef.current.onkeypress === false) {
        return;
      }
      updateInputLog(e);
    },
    [updateInputLog],
  );
  const onkeyup = useCallback(
    (e: KeyboardEvent) => {
      setPressedKeys((previous) => {
        return previous.filter((code) => code !== e.code);
      });

      if (checkboxStatusRef.current.onkeyup === false) {
        return;
      }

      updateInputLog(e);
    },
    [updateInputLog],
  );

  useEffect(() => {
    window.addEventListener('keydown', onkeydown);
    window.addEventListener('keypress', onkeypress);
    window.addEventListener('keyup', onkeyup);

    return () => {
      window.removeEventListener('keydown', onkeydown);
      window.removeEventListener('keypress', onkeypress);
      window.removeEventListener('keyup', onkeyup);
    };
  }, [onkeydown, onkeypress, onkeyup]);

  return (
    <div className={styles.root}>
      <p
        className={clsx([
          'relative mb-6 before:absolute before:inset-0 before:grid before:size-full before:place-items-center before:rounded-lg before:bg-gray-200 before:shadow-sticky before:content-["何かキーを押してください"] before:transition-fade sm:mb-14',
          lastKey !== '' && 'before:opacity-0',
        ])}
      >
        <span
          className={clsx([
            'mx-auto mb-4 block w-fit transition-fade sm:mb-14',
            lastKey === '' ? 'invisible opacity-0' : 'visible',
          ])}
        >
          あなたが押したキーは<kbd className="mx-auto block w-fit whitespace-pre text-3xl">{lastKey || ' '}</kbd>です。
        </span>
        <svg
          viewBox="0 0 1032 292"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          className={clsx(lastKey === '' && 'invisible')}
        >
          {keys.map(({ key, x, y, width, height, label }, index) => (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={width || 40}
                height={height || 40}
                rx="5"
                fill={pressedKeys.includes(key) ? 'black' : '#f0f0f0'}
                stroke="black"
              />
              <text
                x={x + (width || 40) / 2}
                y={y + (height || 40) / 2 + 5}
                textAnchor="middle"
                fontSize={12}
                fill={pressedKeys.includes(key) ? 'white' : '#333'}
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      </p>

      <div className="mb-6 flex flex-wrap gap-3 sm:gap-10">
        <div className="grow">
          <TextField label="キー入力確認用" multiline noResize />
        </div>
        <div>
          <fieldset>
            <legend className="mb-2 block w-fit text-sm font-bold leading-snug">Options</legend>
            <ul className="space-y-2.5">
              {Object.entries(checkboxStatusRef.current).map(([key]) => (
                <li key={key}>
                  <Checkbox
                    label={key}
                    defaultChecked={true}
                    onChange={(e) => {
                      const isChecked = e.currentTarget.checked;

                      checkboxStatusRef.current = {
                        ...checkboxStatusRef.current,
                        [key]: isChecked,
                      };
                    }}
                  />
                </li>
              ))}
              <li>
                <Checkbox
                  label="scroll系のキーの動作を無視する"
                  defaultChecked={false}
                  onChange={(e) => {
                    isScrollIgnored.current = e.currentTarget.checked;
                  }}
                />
              </li>
            </ul>
          </fieldset>
        </div>
      </div>
      <h2 className="mb-2 text-sm font-bold">
        イベントログ<span className="text-xs">（最大100件）</span>
      </h2>

      <div className="overflow-x-auto rounded-lg p-4 scroll-hint-x">
        <table className="min-w-full text-sm">
          <thead className="bg-[#00000022]">
            <tr>
              <th>
                type <span className="block text-xs font-normal">イベント名</span>
              </th>
              <th>
                key <span className="block text-xs font-normal ">キー名</span>
              </th>
              <th>
                code <span className="block text-xs font-normal ">キーコード</span>
              </th>
              <th>altKey</th>
              <th>ctrlKey</th>
              <th>shiftKey</th>
              <th>metaKey</th>
              <th>
                Is Composing <span className="block text-xs font-normal ">IMEが使用中</span>
              </th>
              <th>
                Repeat <span className="block text-xs font-normal ">長押し中</span>
              </th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {inputLog.map((log, index) => (
              <tr key={index}>
                <td>
                  <code>{log.type}</code>
                </td>
                <td>
                  <kbd>{log.key}</kbd>
                </td>
                <td>
                  <code>{log.code}</code>
                </td>
                <td className={log.altKey ? 'text-[#005f82]' : 'text-[#7b4f00]'}>{log.altKey ? 'true' : 'false'}</td>
                <td className={log.ctrlKey ? 'text-[#005f82]' : 'text-[#7b4f00]'}>{log.ctrlKey ? 'true' : 'false'}</td>
                <td className={log.shiftKey ? 'text-[#005f82]' : 'text-[#7b4f00]'}>
                  {log.shiftKey ? 'true' : 'false'}
                </td>
                <td className={log.metaKey ? 'text-[#005f82]' : 'text-[#7b4f00]'}>{log.metaKey ? 'true' : 'false'}</td>
                <td className={log.isComposing ? 'text-[#005f82]' : 'text-[#7b4f00]'}>
                  {log.isComposing ? 'true' : 'false'}
                </td>
                <td className={log.repeat ? 'text-[#005f82]' : 'text-[#7b4f00]'}>{log.repeat ? 'true' : 'false'}</td>
                <td className="text-xs leading-none">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
