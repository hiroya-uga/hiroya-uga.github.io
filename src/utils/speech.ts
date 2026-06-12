interface SpeakOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  onError?: (message: string) => void;
}

export const stripSymbolsForSpeech = (text: string): string => {
  return text
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Component}]/gu, '')
    .replace(/[★☆✦✧✨♪♬♩❤☘❀✿◉●◎○◇◆◯■□▲△▼▽⚡⭐♡♥]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const speak = (
  text: string,
  { voice = null, rate = 1, pitch = 1.3, volume = 1, onError }: SpeakOptions = {},
) => {
  if (typeof window === 'undefined' || 'speechSynthesis' in window === false) {
    onError?.('このブラウザは Web Speech API に対応していません');
    return;
  }
  const spoken = stripSymbolsForSpeech(text);

  if (spoken === '') {
    return;
  }

  const utt = new SpeechSynthesisUtterance(spoken);

  utt.lang = 'ja-JP';
  utt.rate = rate;
  utt.pitch = pitch;
  utt.volume = volume;

  if (voice !== null) {
    utt.voice = voice;
    utt.lang = voice.lang;
  }

  utt.onerror = (event) => {
    const reason = event.error ?? 'unknown';
    // 直前の発話を cancel すると onerror が 'canceled' / 'interrupted' で発火する。
    // これは仕様の正常動作なので無視する
    if (reason === 'canceled' || reason === 'interrupted') {
      return;
    }
    console.error('SpeechSynthesis error:', reason, event);
    onError?.(`読み上げエラー：${reason}`);
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
};
