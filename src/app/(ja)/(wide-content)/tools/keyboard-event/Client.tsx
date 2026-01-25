'use client';

import { throttle } from 'lodash';
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';

import styles from './Client.module.css';
import { KEYBOARD_EVENT_DEFAULT_OPTIONS } from './constants';
import { KeyboardEventLog, KeyboardEventOptions, LastKey } from './parts';

const MemoLastKey = memo(LastKey);

const MemoForm = memo(forwardRef(KeyboardEventOptions));

const MemoLog = memo(KeyboardEventLog);

export const KeyboardEventContent = () => {
  const [lastKey, setLastKey] = useState('');
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const tempLogs = useRef<KeyboardEventLog[]>([]);
  const [inputLog, setInputLog] = useState<KeyboardEventLog[]>([]);

  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const throttledUpdateLogsRef = useRef<ReturnType<typeof throttle> | null>(null);

  useEffect(() => {
    throttledUpdateLogsRef.current = throttle(() => {
      const additionalLogs = tempLogs.current;
      setInputLog((previous) => [...additionalLogs, ...previous].slice(0, 100));
      tempLogs.current = [];
    }, 1000 / 120);
  }, []);

  const checkboxStatusRef = useRef(KEYBOARD_EVENT_DEFAULT_OPTIONS);
  const isScrollIgnoredRef = useRef(false);

  const updateInputLog = useCallback((e: KeyboardEvent) => {
    const timestamp = new Date().toISOString();

    tempLogs.current.unshift({
      type: e.type,
      key: e.key,
      code: e.code,
      location: e.location,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      repeat: e.repeat,
      isComposing: e.isComposing,
      getModifierState: e.getModifierState(e.key),
      timestamp,
    });

    throttledUpdateLogsRef.current?.();
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
  const onblur = useCallback(() => {
    setPressedKeys([]);
  }, []);

  useEffect(() => {
    const { window } = globalThis;

    window.addEventListener('keydown', onkeydown);
    window.addEventListener('keyup', onkeyup);
    window.addEventListener('keypress', onkeypress);
    window.addEventListener('blur', onblur);

    return () => {
      window.removeEventListener('keydown', onkeydown);
      window.removeEventListener('keyup', onkeyup);
      window.removeEventListener('keypress', onkeypress);
      window.removeEventListener('blur', onblur);
    };
  }, [onkeydown, onkeypress, onkeyup, onblur]);

  return (
    <div className={styles.root}>
      <div className="max-w-content mx-auto">
        <MemoLastKey {...{ pressedKeys, lastKey, textFieldRef }} />
        <MemoForm {...{ checkboxStatusRef, isScrollIgnoredRef }} ref={textFieldRef} />
      </div>

      <h2 className="mb-2 text-sm font-bold">
        イベントログ<span className="text-xs">（最大100件）</span>
      </h2>
      <MemoLog {...{ inputLog }} />
    </div>
  );
};
