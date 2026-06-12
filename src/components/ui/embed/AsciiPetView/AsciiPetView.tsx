'use client';

import clsx from 'clsx';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { speak } from '@/utils/speech';

import {
  ASCII_PET_ART,
  ASCII_PET_MOOD_LABEL,
  AsciiPetExpression,
  AsciiPetLang,
  AsciiPetMoodLevel,
  AsciiPetReplyPair,
  REPLIES,
  clampMood,
  getAsciiPetLang,
  moodToExpression,
  pickReplyByLang,
} from './expressions';
import { readAsciiPetSettings, writeAsciiPetSettings } from './settings';

const isDebug = false;

const NAME = 'NEKO.EXE';
const INITIAL_MOOD: AsciiPetMoodLevel = 4;
const IDLE_DROWSY_SEC = 15;
const IDLE_ASLEEP_SEC = 30;
const TICK_MS = 500;
const TRANSIENT_MS = 1400;
const BUBBLE_MS = 3500;
const IDLE_REPLY_INTERVAL_MS = 12_000;
const AWAKE_EXPRESSION_INTERVAL_MS = 8_000;
const DOT_COUNT = 6;

const pickRandom = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

interface Props {
  /** 読み上げに使う声。`undefined` の場合は View 内部で自動選択する */
  voice?: SpeechSynthesisVoice | null;
  /** controlled な読み上げ ON/OFF。`undefined` の場合は内部 state + トグル UI で管理 */
  speechEnabled?: boolean;
  onSpeechEnabledChange?: (next: boolean) => void;
  /** controlled な「タブ非アクティブ時も動く」設定。`undefined` の場合は内部 state + トグル UI で管理 */
  runWhenInactive?: boolean;
  onRunWhenInactiveChange?: (next: boolean) => void;
  /** 読み上げ音量（0〜1）。`undefined` の場合は 1 として扱う */
  volume?: number;
}

export const AsciiPetView = ({
  voice: voiceProp,
  speechEnabled: speechEnabledProp,
  onSpeechEnabledChange,
  runWhenInactive: runWhenInactiveProp,
  onRunWhenInactiveChange,
  volume = 1,
}: Readonly<Props> = {}) => {
  const untilFound = useHiddenUntilFound();
  const internalSpeech = useSpeechSynthesis();

  const [moodLevel, setMoodLevel] = useState<AsciiPetMoodLevel>(INITIAL_MOOD);
  const [transientExpression, setTransientExpression] = useState<AsciiPetExpression | null>(null);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [bubbleText, setBubbleText] = useState('');
  const [internalSpeechEnabled, setInternalSpeechEnabled] = useState(false);
  const [internalRunWhenInactive, setInternalRunWhenInactive] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [chatInput, setChatInput] = useState('');

  const isSpeechControlled = speechEnabledProp !== undefined;
  const isRunWhenInactiveControlled = runWhenInactiveProp !== undefined;
  const speechEnabled = isSpeechControlled ? speechEnabledProp : internalSpeechEnabled;
  const runWhenInactive = isRunWhenInactiveControlled ? runWhenInactiveProp : internalRunWhenInactive;
  const effectiveVoice = voiceProp !== undefined ? voiceProp : internalSpeech.selectedVoice;
  const lang = getAsciiPetLang(effectiveVoice);

  const lastActivityRef = useRef(Date.now());
  const transientTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIdleReplyAtRef = useRef(0);
  const lastAwakeChangeAtRef = useRef(Date.now());
  const lastStrokeAtRef = useRef(0);
  const strokeStartAtRef = useRef(0);
  const strokeContinuedRef = useRef(false);
  const clickWindowStartRef = useRef(0);
  const clickCountRef = useRef(0);
  const speechEnabledRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const shouldRunRef = useRef(true);
  const langRef = useRef<AsciiPetLang>('ja');
  const volumeRef = useRef(1);

  const shouldRun = isActive || runWhenInactive;

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
  }, [speechEnabled]);

  useEffect(() => {
    voiceRef.current = effectiveVoice;
  }, [effectiveVoice]);

  useEffect(() => {
    shouldRunRef.current = shouldRun;
  }, [shouldRun]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // 内部 state の場合のみ localStorage から初期 load する。controlled なら親が管理する
  useEffect(() => {
    const saved = readAsciiPetSettings();
    if (isSpeechControlled === false) {
      setInternalSpeechEnabled(saved.speechEnabled ?? false);
    }
    if (isRunWhenInactiveControlled === false) {
      setInternalRunWhenInactive(saved.runWhenInactive ?? false);
    }
  }, [isSpeechControlled, isRunWhenInactiveControlled]);

  // 可視性 / フォーカスを監視して isActive を更新
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const update = () => {
      setIsActive(document.visibilityState === 'visible' && document.hasFocus());
    };
    update();
    document.addEventListener('visibilitychange', update);
    window.addEventListener('focus', update);
    window.addEventListener('blur', update);
    return () => {
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('focus', update);
      window.removeEventListener('blur', update);
    };
  }, []);

  const idleStage: 'awake' | 'drowsy' | 'asleep' =
    IDLE_ASLEEP_SEC <= idleSeconds ? 'asleep' : IDLE_DROWSY_SEC <= idleSeconds ? 'drowsy' : 'awake';

  const baseExpression: AsciiPetExpression =
    idleStage === 'asleep' ? 'asleep' : idleStage === 'drowsy' ? 'drowsy' : moodToExpression(moodLevel);

  const expression: AsciiPetExpression = transientExpression ?? baseExpression;

  const setTransient = useCallback((next: AsciiPetExpression, ms = TRANSIENT_MS) => {
    setTransientExpression(next);
    if (transientTimerRef.current !== null) {
      clearTimeout(transientTimerRef.current);
    }
    transientTimerRef.current = setTimeout(() => {
      setTransientExpression(null);
      transientTimerRef.current = null;
    }, ms);
  }, []);

  /** バブルには常に ja を表示し、speak だけ言語に合わせて切り替える */
  const popBubble = useCallback((text: string, spokenText?: string) => {
    setBubbleText(text);
    if (bubbleTimerRef.current !== null) {
      clearTimeout(bubbleTimerRef.current);
    }
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleText('');
      bubbleTimerRef.current = null;
    }, BUBBLE_MS);
    if (speechEnabledRef.current && shouldRunRef.current) {
      speak(spokenText ?? text, { voice: voiceRef.current, volume: volumeRef.current });
    }
  }, []);

  /** ReplyPair の配列からランダムに 1 つ選び、ja を表示・lang に応じた声で読み上げる */
  const popRandomReply = useCallback(
    (list: readonly AsciiPetReplyPair[]) => {
      const pair = list[Math.floor(Math.random() * list.length)];
      popBubble(pair[0], pickReplyByLang(pair, langRef.current));
    },
    [popBubble],
  );

  // idle 時の自動セリフ／表情。shouldRun が false の間は完全停止
  useEffect(() => {
    if (shouldRun === false) {
      return;
    }
    const timer = setInterval(() => {
      const elapsedMs = Date.now() - lastActivityRef.current;
      setIdleSeconds(Math.floor(elapsedMs / 1000));

      const now = Date.now();

      if (IDLE_ASLEEP_SEC * 1000 <= elapsedMs) {
        if (IDLE_REPLY_INTERVAL_MS <= now - lastIdleReplyAtRef.current) {
          popRandomReply(REPLIES.asleep);
          lastIdleReplyAtRef.current = now;
        }
        return;
      }

      if (IDLE_DROWSY_SEC * 1000 <= elapsedMs) {
        if (IDLE_REPLY_INTERVAL_MS <= now - lastIdleReplyAtRef.current) {
          popRandomReply(REPLIES.idle);
          lastIdleReplyAtRef.current = now;
        }
        return;
      }

      if (AWAKE_EXPRESSION_INTERVAL_MS <= now - lastAwakeChangeAtRef.current) {
        lastAwakeChangeAtRef.current = now;
        if (Math.random() < 0.45) {
          setTransient(pickRandom(['curious', 'happy'] as const), 1800);
        }
      }
    }, TICK_MS);

    return () => {
      clearInterval(timer);
    };
  }, [popRandomReply, setTransient, shouldRun]);

  useEffect(() => {
    return () => {
      if (transientTimerRef.current !== null) {
        clearTimeout(transientTimerRef.current);
      }
      if (bubbleTimerRef.current !== null) {
        clearTimeout(bubbleTimerRef.current);
      }
    };
  }, []);

  // クリック＝呼びかけ：寝てたら起こす。起きてたら curious + 短い返事。
  // SPAM_WINDOW_MS 以内に SPAM_THRESHOLD 回連打されたら不機嫌
  const handleCall = useCallback(() => {
    const SPAM_WINDOW_MS = 4000;
    const SPAM_THRESHOLD = 4;
    const wasAsleep = IDLE_ASLEEP_SEC <= idleSeconds;
    const now = Date.now();
    lastActivityRef.current = now;
    lastAwakeChangeAtRef.current = now;
    setIdleSeconds(0);

    if (wasAsleep) {
      setTransient('startled', 1200);
      popRandomReply(REPLIES.wake);
      setMoodLevel((prev) => clampMood(prev - 1));
      clickWindowStartRef.current = now;
      clickCountRef.current = 0;
      return;
    }

    if (SPAM_WINDOW_MS < now - clickWindowStartRef.current) {
      clickWindowStartRef.current = now;
      clickCountRef.current = 0;
    }
    clickCountRef.current += 1;

    if (SPAM_THRESHOLD <= clickCountRef.current) {
      clickWindowStartRef.current = now;
      clickCountRef.current = 0;
      setTransient('annoyed', 1800);
      popRandomReply(REPLIES.annoyed);
      setMoodLevel((prev) => clampMood(prev - 1));
      return;
    }

    setTransient('curious');
    popRandomReply(REPLIES.call);
  }, [idleSeconds, popRandomReply, setTransient]);

  // 実際になでる動作。寝てたら起こす、起きてたら mood↑ + excited
  const doPet = useCallback(() => {
    const wasAsleep = IDLE_ASLEEP_SEC <= idleSeconds;
    const now = Date.now();
    lastActivityRef.current = now;
    lastAwakeChangeAtRef.current = now;
    setIdleSeconds(0);

    if (wasAsleep) {
      setTransient('startled', 1200);
      popRandomReply(REPLIES.wake);
      return;
    }

    setTransient('excited');
    popRandomReply(REPLIES.pet);
    setMoodLevel((prev) => clampMood(prev + 1));
  }, [idleSeconds, popRandomReply, setTransient]);

  // ポインタを動かす＝なでる：初回は 1000ms、撫でセッション継続中は 2000ms の連続移動で発火。途中で 200ms 以上止まったらセッションリセット
  const handleStroke = useCallback(() => {
    const STROKE_REQUIRED_FIRST_MS = 1000;
    const STROKE_REQUIRED_CONTINUED_MS = 2000;
    const STROKE_GAP_MS = 200;
    const now = Date.now();
    const gap = now - lastStrokeAtRef.current;
    if (STROKE_GAP_MS < gap) {
      strokeStartAtRef.current = now;
      strokeContinuedRef.current = false;
    }
    lastStrokeAtRef.current = now;
    lastActivityRef.current = now;

    const required = strokeContinuedRef.current ? STROKE_REQUIRED_CONTINUED_MS : STROKE_REQUIRED_FIRST_MS;
    if (required <= now - strokeStartAtRef.current) {
      strokeStartAtRef.current = now;
      strokeContinuedRef.current = true;
      doPet();
    }
  }, [doPet]);

  const handleToggleSpeech = useCallback(() => {
    const next = speechEnabled === false;
    if (isSpeechControlled) {
      onSpeechEnabledChange?.(next);
    } else {
      setInternalSpeechEnabled(next);
      writeAsciiPetSettings({ speechEnabled: next });
    }
    if (next === false && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    } else if (next === true) {
      speak(pickReplyByLang(REPLIES.speechTest, langRef.current), {
        voice: voiceRef.current,
        volume: volumeRef.current,
      });
    }
  }, [isSpeechControlled, onSpeechEnabledChange, speechEnabled]);

  const handleToggleRunWhenInactive = useCallback(() => {
    const next = runWhenInactive === false;
    if (isRunWhenInactiveControlled) {
      onRunWhenInactiveChange?.(next);
    } else {
      setInternalRunWhenInactive(next);
      writeAsciiPetSettings({ runWhenInactive: next });
    }
  }, [isRunWhenInactiveControlled, onRunWhenInactiveChange, runWhenInactive]);

  // ローカル完結のチャット：送信内容は読まず、fallback からランダムな返答を表示する
  const handleChatSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = chatInput.trim();
      if (trimmed === '') {
        return;
      }
      setChatInput('');
      lastActivityRef.current = Date.now();
      setIdleSeconds(0);
      setTransient(Math.random() < 0.5 ? 'curious' : 'happy');
      popRandomReply(REPLIES.fallback);
    },
    [chatInput, popRandomReply, setTransient],
  );

  const idlePercent = useMemo(
    () => Math.min(100, Math.max(0, Math.round((idleSeconds / IDLE_ASLEEP_SEC) * 100))),
    [idleSeconds],
  );

  return (
    <div className="bg-secondary text-primary border-primary @container px-10PX mx-auto flex max-w-56 flex-col gap-2 rounded-lg border py-3 font-mono">
      <p className="flex flex-wrap items-center justify-between gap-2 text-xs tracking-wide">
        <span>{NAME}</span>
        <span
          className="flex items-center justify-end gap-1"
          role="img"
          title={`きげん：${ASCII_PET_MOOD_LABEL[moodLevel]}`}
        >
          {Array.from({ length: DOT_COUNT }, (_, index) => (
            <span
              key={index}
              className={clsx('inline-block size-1.5 rounded-full', index < moodLevel ? 'bg-accent' : 'bg-accent/50')}
              aria-hidden="true"
            />
          ))}
        </span>
      </p>

      <p className="text-center text-xs tracking-wide">{ASCII_PET_MOOD_LABEL[moodLevel]}</p>

      {isDebug && (
        <div
          className="bg-primary/20 relative block h-1 overflow-hidden rounded-full"
          role="meter"
          aria-label="ねむさ"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={idlePercent}
        >
          <span
            className="bg-accent absolute inset-y-0 left-0 transition-all duration-500"
            style={{ inlineSize: `${idlePercent}%` }}
          />
        </div>
      )}

      <button type="button" className="focus:block!" onClick={doPet} {...untilFound}>
        なでる
      </button>

      <p className="@w200:text-[0.95rem] grid min-h-[6lh] items-end justify-center text-[0.625rem] leading-tight">
        <button
          type="button"
          className="cursor-grab whitespace-pre text-left active:cursor-grabbing"
          style={{
            fontFamily:
              '"Osaka-Mono", "MS Gothic", "BIZ UDGothic", "HackGen", "Hiragino Maru Gothic ProN", ui-monospace, monospace',
            fontVariantEastAsian: 'full-width',
          }}
          onClick={handleCall}
          onPointerMove={handleStroke}
          aria-label={`${NAME}（${expression}）クリックで呼びかけ、ポインタを動かすとなでる`}
        >
          {ASCII_PET_ART[expression]}
        </button>
      </p>

      <p
        className="border-primary bg-secondary not-empty:animate-fade-in empty:animate-fade-out m-0 box-content grid min-h-[1.75rem] place-items-center rounded-lg border px-2 py-1 text-center text-xs"
        key={bubbleText}
      >
        <span>{bubbleText}</span>
      </p>

      <form onSubmit={handleChatSubmit} className="flex items-center gap-1">
        <input
          type="text"
          value={chatInput}
          onChange={(event) => setChatInput(event.currentTarget.value)}
          placeholder="ねこに話しかける"
          maxLength={120}
          className="border-primary bg-textfield text-textfield min-h-9 grow rounded-md border px-2 text-xs"
        />
        <button
          type={chatInput.trim() === '' ? 'button' : 'submit'}
          aria-disabled={chatInput.trim() === ''}
          className="border-primary min-h-9 shrink-0 rounded-md border px-2 py-1 text-xs disabled:opacity-40"
        >
          送信
        </button>
      </form>

      {(isSpeechControlled === false || isRunWhenInactiveControlled === false) && (
        <p className="flex items-center justify-end gap-2">
          {isSpeechControlled === false && (
            <button
              type="button"
              onClick={handleToggleSpeech}
              aria-pressed={speechEnabled}
              title={speechEnabled ? '読み上げ：ON' : '読み上げ：OFF'}
              className={clsx(
                'rounded p-1 leading-none transition-opacity',
                speechEnabled ? 'opacity-100' : 'opacity-40',
              )}
            >
              <span aria-hidden="true">{speechEnabled ? '📢' : '🔇'}</span>
              <span className="sr-only">{speechEnabled ? '読み上げをオフにする' : '読み上げをオンにする'}</span>
            </button>
          )}
          {isRunWhenInactiveControlled === false && (
            <button
              type="button"
              onClick={handleToggleRunWhenInactive}
              aria-pressed={runWhenInactive}
              title={runWhenInactive ? 'タブが非アクティブ時も動く：ON' : 'タブが非アクティブ時は停止'}
              className={clsx(
                'rounded p-1 leading-none transition-opacity',
                runWhenInactive ? 'opacity-100' : 'opacity-40',
              )}
            >
              <span aria-hidden="true">🌐</span>
              <span className="sr-only">
                {runWhenInactive ? 'タブが非アクティブ時は停止するように変更' : 'タブが非アクティブ時も動かす'}
              </span>
            </button>
          )}
        </p>
      )}
    </div>
  );
};
