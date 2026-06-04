'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { RunButton } from '@/components/ui/buttons/RunButton';
import { CodeBlock } from '@/components/ui/embed/CodeBlock';
import { SelectField, TextField } from '@/components/ui/forms';
import { Heading } from '@/components/ui/headings/Heading';
import { LoadingIcon } from '@/components/ui/media/LoadingIcon';
import { Lang } from '@/types/lang';
import { formattedLogTimeString } from '@/utils/formatter';

import { speechSynthesisLocales } from './locales';

type Status = 'idle' | 'speaking' | 'paused';

type LogEventType = 'start' | 'end' | 'pause' | 'resume' | 'error' | 'boundary';
type LogMethodType = 'speak()' | 'pause()' | 'resume()' | 'cancel()';

interface LogEntry {
  id: number;
  time: string;
  type: LogEventType | LogMethodType;
  detail: string;
}

const MAX_LOG = 80;
const DEFAULT_RATE = 1;
const DEFAULT_PITCH = 1;
const DEFAULT_VOLUME = 1;

const i18n = speechSynthesisLocales;

const escapeForTemplate = (value: string) => value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const detachUtteranceHandlers = (utterance: SpeechSynthesisUtterance) => {
  utterance.onstart = null;
  utterance.onend = null;
  utterance.onpause = null;
  utterance.onresume = null;
  utterance.onerror = null;
  utterance.onboundary = null;
};

const buildCodeSnippet = ({
  text,
  voice,
  rate,
  pitch,
  volume,
}: {
  text: string;
  voice: SpeechSynthesisVoice | undefined;
  rate: number;
  pitch: number;
  volume: number;
}) => {
  const lines: string[] = [];
  const literal = text.includes('\n') ? `\`${escapeForTemplate(text)}\`` : JSON.stringify(text);

  lines.push(`const utterance = new SpeechSynthesisUtterance(${literal});`);

  if (voice !== undefined) {
    lines.push(
      `utterance.voice = speechSynthesis.getVoices().find((voice) => voice.voiceURI === ${JSON.stringify(voice.voiceURI)});`,
    );
    lines.push(`utterance.lang = ${JSON.stringify(voice.lang)};`);
  }

  if (rate !== DEFAULT_RATE) {
    lines.push(`utterance.rate = ${rate};`);
  }
  if (pitch !== DEFAULT_PITCH) {
    lines.push(`utterance.pitch = ${pitch};`);
  }
  if (volume !== DEFAULT_VOLUME) {
    lines.push(`utterance.volume = ${volume};`);
  }

  lines.push('speechSynthesis.speak(utterance);');

  return lines.join('\n');
};

export const SpeechSynthesisPlayground = ({ lang }: { lang: Lang }) => {
  const t = i18n[lang];

  const id = useId();
  const logCounterRef = useRef(0);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState('');
  const [text, setText] = useState(t.defaultText);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [pitch, setPitch] = useState(DEFAULT_PITCH);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [status, setStatus] = useState<Status>('idle');
  const [log, setLog] = useState<LogEntry[]>([]);

  const pushLog = useCallback((type: LogEntry['type'], detail: string = '') => {
    logCounterRef.current += 1;
    const entry: LogEntry = {
      id: logCounterRef.current,
      time: formattedLogTimeString(new Date()),
      type,
      detail,
    };
    setLog((current) => [entry, ...current].slice(0, MAX_LOG));
  }, []);

  const selectedVoice = useMemo(() => {
    return voices.find((voice) => voice.voiceURI === voiceURI);
  }, [voices, voiceURI]);

  const voiceGroups = useMemo(() => {
    const map = new Map<string, SpeechSynthesisVoice[]>();
    for (const voice of voices) {
      const group = voice.lang || 'unknown';
      const existing = map.get(group) ?? [];
      existing.push(voice);
      map.set(group, existing);
    }
    return [...map.entries()].sort(([langA], [langB]) => langA.localeCompare(langB));
  }, [voices]);

  const codeSnippet = useMemo(
    () => buildCodeSnippet({ text, voice: selectedVoice, rate, pitch, volume }),
    [text, selectedVoice, rate, pitch, volume],
  );

  useEffect(() => {
    setIsSupported('speechSynthesis' in globalThis.window);
  }, []);

  useEffect(() => {
    if (isSupported !== true) {
      return;
    }

    const reloadVoices = () => {
      const list = globalThis.window.speechSynthesis.getVoices();

      setVoices(list);
      setVoiceURI((current) => {
        if (current !== '' && list.some((voice) => voice.voiceURI === current)) {
          return current;
        }

        for (const name of t.preferredVoiceNames) {
          const preferredVoice = list.find((voice) => voice.name === name);

          if (preferredVoice !== undefined) {
            return preferredVoice.voiceURI;
          }
        }

        const browserDefault = list.find((voice) => voice.default);

        if (browserDefault !== undefined) {
          return browserDefault.voiceURI;
        }

        const fallback = list.find((voice) => voice.lang.startsWith(t.preferredVoiceLangPrefix));

        return (fallback ?? list[0])?.voiceURI ?? '';
      });
    };

    reloadVoices();
    globalThis.window.speechSynthesis.addEventListener('voiceschanged', reloadVoices);

    return () => {
      globalThis.window.speechSynthesis.removeEventListener('voiceschanged', reloadVoices);
      // アンマウント後の遅延イベント発火で setState が走らないようにハンドラを外す
      const current = currentUtteranceRef.current;
      if (current !== null) {
        detachUtteranceHandlers(current);
        currentUtteranceRef.current = null;
      }
      globalThis.window.speechSynthesis.cancel();
    };
  }, [isSupported, t.preferredVoiceLangPrefix, t.preferredVoiceNames]);

  if (isSupported === null) {
    return (
      <p className="grid aspect-video place-items-center">
        <LoadingIcon />
      </p>
    );
  }

  if (isSupported === false) {
    return (
      <p className="text-alert animate-fade-in text-center text-sm">
        <strong>{t.notSupported}</strong>
      </p>
    );
  }

  const isSpeaking = status === 'speaking';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';

  const sliders = [
    {
      key: 'rate',
      label: t.rateLabel,
      min: 0.1,
      max: 10,
      step: 0.1,
      precision: 1,
      value: rate,
      setValue: setRate,
    },
    {
      key: 'pitch',
      label: t.pitchLabel,
      min: 0,
      max: 2,
      step: 0.1,
      precision: 1,
      value: pitch,
      setValue: setPitch,
    },
    {
      key: 'volume',
      label: t.volumeLabel,
      min: 0,
      max: 1,
      step: 0.05,
      precision: 2,
      value: volume,
      setValue: setVolume,
    },
  ];

  const handleSpeak = () => {
    if (text.trim() === '') {
      return;
    }

    const previous = currentUtteranceRef.current;
    if (previous !== null) {
      // cancel() で前回 utterance の onend/onerror が遅延発火し、ログ順や status が乱れるのを防ぐ
      detachUtteranceHandlers(previous);
    }

    globalThis.window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice !== undefined) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setStatus('speaking');
      pushLog('start');
    };
    utterance.onend = () => {
      setStatus('idle');
      pushLog('end');
      if (currentUtteranceRef.current === utterance) {
        currentUtteranceRef.current = null;
      }
    };
    utterance.onpause = () => {
      setStatus('paused');
      pushLog('pause');
    };
    utterance.onresume = () => {
      setStatus('speaking');
      pushLog('resume');
    };
    utterance.onerror = (event) => {
      setStatus('idle');
      pushLog('error', event.error);
      if (currentUtteranceRef.current === utterance) {
        currentUtteranceRef.current = null;
      }
    };
    utterance.onboundary = (event) => {
      pushLog('boundary', `name=${event.name}, charIndex=${event.charIndex}`);
    };

    currentUtteranceRef.current = utterance;
    const preview = text.length <= 30 ? text : `${text.slice(0, 30)}…`;
    pushLog('speak()', `text=${JSON.stringify(preview)}`);
    globalThis.window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="animate-fade-in w640:grid w640:grid-cols-2 w640:grid-rows-[auto_auto_auto] w640:gap-x-24PX">
      <div className="w640:row-start-1 w640:col-start-1 w640:grid w640:grid-cols-subgrid w640:grid-rows-subgrid w640:col-span-2 w640:row-span-3">
        <div>
          <Heading level={2}>
            <label htmlFor={`${id}-text`}>{t.textHeading}</label>
          </Heading>
          <TextField
            id={`${id}-text`}
            value={text}
            onInput={({ currentTarget }) => setText(currentTarget.value)}
            multiline
            autoResize
            minHeight={5}
          />
        </div>

        <div className="w640:col-start-1 w640:row-start-2 w640:row-span-2 w640:col-span-2 w640:grid w640:grid-cols-subgrid w640:grid-rows-subgrid">
          <div className="mt-heading-top">
            <Heading level={2}>{t.parametersHeading}</Heading>

            <div className="gap-y-paragraph grid">
              <div className="mb-4">
                <SelectField
                  label={t.voiceLabel}
                  value={voiceURI}
                  onChange={({ currentTarget }) => setVoiceURI(currentTarget.value)}
                >
                  {voices.length === 0 && <option value="">{t.noVoices}</option>}
                  {voiceGroups.map(([voiceLang, list]) => (
                    <optgroup key={voiceLang} label={voiceLang}>
                      {list.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name}
                          {voice.default ? t.defaultSuffix : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </SelectField>
                <p className="min-h-[lh] text-xs">
                  {selectedVoice !== undefined && (
                    <>
                      lang: {selectedVoice.lang} / localService: {String(selectedVoice.localService)}
                    </>
                  )}
                </p>
              </div>

              {sliders.map(({ key, label, precision, setValue, ...inputProps }) => (
                <p key={key}>
                  <span className="flex items-baseline justify-between font-bold leading-snug">
                    <label htmlFor={`${id}-${key}`} className="text-sm">
                      {label}
                    </label>
                    <output htmlFor={`${id}-${key}`} className="font-mono">
                      {inputProps.value.toFixed(precision)}
                    </output>
                  </span>
                  <input
                    {...inputProps}
                    id={`${id}-${key}`}
                    type="range"
                    onChange={({ currentTarget }) => setValue(Number(currentTarget.value))}
                    className="h-44px w-full"
                  />
                </p>
              ))}
            </div>
          </div>

          <div className="w640:col-span-2 w640:row-start-3 bg-primary/50 sticky bottom-0 z-10 mt-8 py-4 backdrop-blur-sm">
            <p role="status" className="mb-4 text-center text-lg font-bold">
              {t.statusLabel}
              <span
                className={clsx([isSpeaking && 'text-blue-600 dark:text-orange-400', isPaused && 'text-secondary'])}
              >
                {isSpeaking && 'speaking'}
                {isPaused && 'paused'}
                {isIdle && 'idle'}
              </span>
            </p>

            <ul className="w500:grid-cols-4 max-w-w640 mx-auto grid grid-cols-2 gap-3">
              <li>
                <RunButton type="button" onClick={handleSpeak} disabled={text.trim() === ''}>
                  speak()
                </RunButton>
              </li>
              <li>
                <RunButton
                  type="button"
                  onClick={() => {
                    globalThis.window.speechSynthesis.pause();
                    pushLog('pause()');
                  }}
                  disabled={isSpeaking === false}
                >
                  pause()
                </RunButton>
              </li>
              <li>
                <RunButton
                  type="button"
                  onClick={() => {
                    globalThis.window.speechSynthesis.resume();
                    pushLog('resume()');
                  }}
                  disabled={isPaused === false}
                >
                  resume()
                </RunButton>
              </li>
              <li>
                <RunButton
                  type="button"
                  onClick={() => {
                    globalThis.window.speechSynthesis.cancel();
                    setStatus('idle');
                    pushLog('cancel()');
                  }}
                  disabled={isIdle}
                >
                  cancel()
                </RunButton>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w640:row-start-1 w640:col-start-2 w640:row-span-2 mt-heading-top w640:mt-0">
        <div className="flex items-baseline justify-between">
          <Heading level={2}>{t.eventLogHeading}</Heading>
          {log.length !== 0 && (
            <button type="button" className="text-secondary animate-fade-in text-sm" onClick={() => setLog([])}>
              {t.clearButton}
            </button>
          )}
        </div>

        <div className="bg-secondary border-secondary text-2xs scroll-hint-y h-[calc(5rem*1.875+1rem+2px)] overflow-y-auto rounded-md p-3 font-mono leading-relaxed">
          {log.length !== 0 && (
            <ol className="grid gap-y-1">
              {log.map((entry) => (
                <li key={entry.id} className="grid grid-cols-[auto_auto_1fr] gap-x-2">
                  <span className="text-secondary">{entry.time}</span>
                  <span
                    className={clsx([
                      'font-bold',
                      entry.type === 'error' && 'text-alert',
                      entry.type === 'start' && 'text-blue-600 dark:text-orange-400',
                      entry.type === 'end' && 'text-blue-600 dark:text-orange-400',
                    ])}
                  >
                    {entry.type}
                  </span>
                  <span className="break-all">{entry.detail}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="mt-heading-top">
          <Heading level={2}>{t.codeHeading}</Heading>

          <CodeBlock language="javascript" title="JavaScript" code={codeSnippet} copyButton nowrap />
        </div>
      </div>
    </div>
  );
};
