'use client';

import { Checkbox, TextField } from '@/components/Form';
import { throttle } from 'lodash';
import { memo, RefObject, useCallback, useEffect, useRef, useState } from 'react';

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

const LastKey = ({ pressedKeys, lastKey }: { pressedKeys: string[]; lastKey: string }) => {
  return (
    <p className={clsx(['relative mb-6 sm:mb-14', lastKey !== '' && 'before:opacity-0'])}>
      <span className="mx-auto mb-4 block w-fit transition-fade sm:mb-14">
        あなたが最後に押したキーは
        <kbd className="mx-auto min-w-[6rem] text-center my-2 block w-fit whitespace-pre text-3xl">
          {lastKey === ' ' ? 'Space' : lastKey || ' '}
        </kbd>
        です。
      </span>
      <span translate="no">
        <svg
          viewBox="0 0 1032 292"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          className={clsx(lastKey === '' && 'invisible')}
        >
          {keys.map(({ key, x, y, width, height, label }, index) => {
            const isPressed = pressedKeys.includes(key);
            const className = clsx(isPressed || 'transition-colors');
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={width || 40}
                  height={height || 40}
                  rx="5"
                  fill={isPressed ? '#a0a0a0' : '#f0f0f0'}
                  stroke="black"
                  className={className}
                />
                <text
                  x={x + (width || 40) / 2}
                  y={y + (height || 40) / 2 + 5}
                  textAnchor="middle"
                  fontSize={12}
                  fill={isPressed ? '#141414' : '#333'}
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

const MemoLastKey = memo(LastKey);

const Form = ({
  checkboxStatusRef,
  isScrollIgnoredRef,
}: {
  checkboxStatusRef: RefObject<Record<string, boolean>>;
  isScrollIgnoredRef: RefObject<boolean>;
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-3 sm:gap-10">
      <div className="grow">
        <TextField label="テスト用テキストフィールド" multiline noResize />
      </div>
      <div>
        <fieldset>
          <legend className="mb-2 block w-fit text-sm font-bold leading-snug">Options</legend>
          <ul className="space-y-2.5">
            {Object.entries(checkboxStatusRef.current).map(([key]) => (
              <li key={key} translate="no">
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
                  isScrollIgnoredRef.current = e.currentTarget.checked;
                }}
              />
            </li>
          </ul>
        </fieldset>
      </div>
    </div>
  );
};

const MemoForm = memo(Form);

const Log = ({ inputLog }: { inputLog: Log[] }) => {
  return (
    <div className="overflow-x-auto rounded-lg p-4 scroll-hint-x">
      <table className="min-w-full text-sm">
        <thead className="bg-[#00000022]">
          <tr>
            <th>
              <span translate="no">type</span> <span className="block text-xs font-normal">イベント名</span>
            </th>
            <th>
              <span translate="no">key</span> <span className="block text-xs font-normal ">キー名</span>
            </th>
            <th>
              <span translate="no">code</span> <span className="block text-xs font-normal ">キーコード</span>
            </th>
            <th translate="no">altKey</th>
            <th translate="no">ctrlKey</th>
            <th translate="no">shiftKey</th>
            <th translate="no">metaKey</th>
            <th>
              <span translate="no">isComposing</span> <span className="block text-xs font-normal ">IMEが使用中</span>
            </th>
            <th>
              <span translate="no">repeat</span> <span className="block text-xs font-normal ">長押し中</span>
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
              <td className={log.shiftKey ? 'text-[#005f82]' : 'text-[#7b4f00]'}>{log.shiftKey ? 'true' : 'false'}</td>
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
  );
};

const MemoLog = memo(Log);

export const KeyboardEventContent = () => {
  const [lastKey, setLastKey] = useState('');
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const tempLogs = useRef<Log[]>([]);
  const [inputLog, setInputLog] = useState<Log[]>([]);

  const throttledUpdateLogs = throttle(() => {
    const additionalLogs = tempLogs.current;
    setInputLog((previous) => [...additionalLogs, ...previous].slice(0, 100));
    tempLogs.current = [];
  }, 1000 / 120);

  const checkboxStatusRef = useRef({
    onkeydown: true,
    onkeypress: true,
    onkeyup: true,
  });
  const isScrollIgnoredRef = useRef(false);

  const updateInputLog = useCallback((e: KeyboardEvent) => {
    const timestamp = new Date().toISOString();

    tempLogs.current.unshift({
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
    });

    tempLogs.current = tempLogs.current;
    throttledUpdateLogs();
  }, []);

  const onkeydown = useCallback(
    (e: KeyboardEvent) => {
      if (
        isScrollIgnoredRef.current &&
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

      setLastKey(e.key);
      setPressedKeys((previous) => [...new Set([...previous, e.code])]);

      if (checkboxStatusRef.current.onkeydown === false) {
        return;
      }

      updateInputLog(e);
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
      <MemoLastKey {...{ pressedKeys, lastKey }} />
      <MemoForm {...{ checkboxStatusRef, isScrollIgnoredRef }} />
      <h2 className="mb-2 text-sm font-bold">
        イベントログ<span className="text-xs">（最大100件）</span>
      </h2>

      <MemoLog {...{ inputLog }} />
    </div>
  );
};
