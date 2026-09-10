import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

const createVoice = (overrides: Partial<SpeechSynthesisVoice>): SpeechSynthesisVoice => ({
  default: false,
  lang: 'ja-JP',
  localService: true,
  name: 'voice',
  voiceURI: 'voice',
  ...overrides,
});

const mockSpeechSynthesis = (voices: SpeechSynthesisVoice[]) => {
  const listeners = new Map<string, () => void>();

  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      getVoices: () => voices,
      addEventListener: (type: string, listener: () => void) => {
        listeners.set(type, listener);
      },
      removeEventListener: (type: string) => {
        listeners.delete(type);
      },
    },
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useSpeechSynthesis', () => {
  it('speechSynthesisが存在しない環境ではisSupportedがfalseになる', async () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    await waitFor(() => expect(result.current.isSupported).toBe(false));
    expect(result.current.voices).toStrictEqual([]);
  });

  it('preferredVoiceNamesに一致する声を優先して自動選択する', async () => {
    const kyoko = createVoice({ name: 'Kyoko', voiceURI: 'kyoko', lang: 'ja-JP' });
    const other = createVoice({ name: 'Other', voiceURI: 'other', lang: 'ja-JP' });
    mockSpeechSynthesis([other, kyoko]);

    const { result } = renderHook(() => useSpeechSynthesis());

    await waitFor(() => expect(result.current.voiceURI).toBe('kyoko'));
    expect(result.current.selectedVoice?.voiceURI).toBe('kyoko');
  });

  it('preferredVoiceNamesに一致しない場合はlangが合うdefault voiceを選択する', async () => {
    const langDefault = createVoice({ name: 'Unknown', voiceURI: 'lang-default', lang: 'ja-JP', default: true });
    mockSpeechSynthesis([langDefault]);

    const { result } = renderHook(() => useSpeechSynthesis());

    await waitFor(() => expect(result.current.voiceURI).toBe('lang-default'));
  });

  it('preferredVoiceLangPrefixに合う声がなければ未選択のままにする', async () => {
    const enVoice = createVoice({ name: 'Samantha', voiceURI: 'en', lang: 'en-US' });
    mockSpeechSynthesis([enVoice]);

    const { result } = renderHook(() => useSpeechSynthesis({ preferredVoiceLangPrefix: 'ja' }));

    await waitFor(() => expect(result.current.voices).toHaveLength(1));
    expect(result.current.voiceURI).toBe('');
    expect(result.current.selectedVoice).toBeNull();
  });

  it('voiceGroupsはlangごとにグルーピングされ、lang名でソートされる', async () => {
    const ja = createVoice({ name: 'Kyoko', voiceURI: 'ja', lang: 'ja-JP' });
    const en = createVoice({ name: 'Samantha', voiceURI: 'en', lang: 'en-US' });
    mockSpeechSynthesis([ja, en]);

    const { result } = renderHook(() => useSpeechSynthesis({ preferredVoiceLangPrefix: 'en' }));

    await waitFor(() => expect(result.current.voices).toHaveLength(2));
    expect(result.current.voiceGroups).toStrictEqual([
      ['en-US', [en]],
      ['ja-JP', [ja]],
    ]);
  });

  it('defaultVoiceURIに該当するvoiceがあればそれを採用する', async () => {
    const kyoko = createVoice({ name: 'Kyoko', voiceURI: 'kyoko', lang: 'ja-JP' });
    const saved = createVoice({ name: 'Saved', voiceURI: 'saved', lang: 'ja-JP' });
    mockSpeechSynthesis([kyoko, saved]);

    const { result } = renderHook(() => useSpeechSynthesis({ defaultVoiceURI: 'saved' }));

    await waitFor(() => expect(result.current.voices).toHaveLength(2));
    expect(result.current.voiceURI).toBe('saved');
  });
});
