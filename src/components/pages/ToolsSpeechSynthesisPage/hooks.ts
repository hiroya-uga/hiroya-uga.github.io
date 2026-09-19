'use client';

import { Lang } from '@/types/lang';
import { useEffect, useMemo, useState } from 'react';

export const DEFAULT_PREFERRED_VOICE_NAMES = {
  ja: [
    'Kyoko', // macOS / iOS
    'Otoya', // macOS / iOS
    'Google 日本語', // Chrome
    'Microsoft Nanami Online (Natural) - Japanese (Japan)', // Edge
    'Microsoft Ayumi - Japanese (Japan)', // Windows
    'Microsoft Haruka Desktop', // Windows (legacy)
  ],
  en: [
    'Samantha', // macOS / iOS (en-US)
    'Alex', // macOS premium (en-US)
    'Karen', // macOS (en-AU)
    'Daniel', // macOS (en-GB)
    'Google US English', // Chrome
    'Microsoft Aria Online (Natural) - English (United States)', // Edge
    'Microsoft Zira Desktop', // Windows (legacy)
    'Microsoft David Desktop', // Windows (legacy)
  ],
};

interface Params {
  /** 自動選択で最優先される音声名のリスト。各環境のデフォルト音声を順に並べる想定 */
  preferredVoiceNames?: readonly string[];
  /** この prefix で始まる lang を持つ voice しか自動選択しない（合うものがなければ未選択のまま） */
  preferredVoiceLangPrefix?: Lang;
  /** 初期 voiceURI（保存値を呼び出し側で読み込んで渡す想定）。voices に該当があれば採用、無ければ自動選択にフォールバック */
  defaultVoiceURI?: string;
}

export const useSpeechSynthesis = ({
  preferredVoiceLangPrefix = 'ja',
  preferredVoiceNames = DEFAULT_PREFERRED_VOICE_NAMES[preferredVoiceLangPrefix],
  defaultVoiceURI = '',
}: Params = {}) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState(defaultVoiceURI);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (isSupported !== true) {
      return;
    }
    const reload = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    reload();
    window.speechSynthesis.addEventListener('voiceschanged', reload);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', reload);
    };
  }, [isSupported]);

  useEffect(() => {
    if (voices.length === 0) {
      return;
    }

    const currentValid = voiceURI !== '' && voices.some((voice) => voice.voiceURI === voiceURI);

    if (currentValid) {
      return;
    }

    const matchesLang = (voice: SpeechSynthesisVoice): boolean =>
      voice.lang.toLowerCase().startsWith(preferredVoiceLangPrefix.toLowerCase());

    for (const name of preferredVoiceNames ?? []) {
      const found = voices.find((voice) => voice.name === name && matchesLang(voice));

      if (found !== undefined) {
        setVoiceURI(found.voiceURI);
        return;
      }
    }

    const langPool = voices.filter(matchesLang);
    const langDefault = langPool.find((voice) => voice.default) ?? langPool[0];

    if (langDefault !== undefined) {
      setVoiceURI(langDefault.voiceURI);
      return;
    }

    // preferredVoiceLangPrefix に合う声がなければ未選択のまま
    if (voiceURI !== '') {
      setVoiceURI('');
    }
  }, [voices, voiceURI, preferredVoiceNames, preferredVoiceLangPrefix]);

  const selectedVoice = useMemo(() => {
    return voices.find((voice) => voice.voiceURI === voiceURI) ?? null;
  }, [voices, voiceURI]);

  const voiceGroups = useMemo<[string, SpeechSynthesisVoice[]][]>(() => {
    const map = new Map<string, SpeechSynthesisVoice[]>();
    for (const voice of voices) {
      const group = voice.lang === '' ? 'unknown' : voice.lang;
      const existing = map.get(group) ?? [];
      existing.push(voice);
      map.set(group, existing);
    }
    return [...map.entries()].sort(([langA], [langB]) => langA.localeCompare(langB));
  }, [voices]);

  return {
    isSupported,
    voices,
    voiceURI,
    setVoiceURI,
    selectedVoice,
    voiceGroups,
  };
};
