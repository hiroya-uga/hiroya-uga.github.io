export type AsciiPetExpression =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'sleepy'
  | 'drowsy'
  | 'asleep'
  | 'curious'
  | 'startled'
  | 'annoyed';

export const ASCII_PET_ART: Record<AsciiPetExpression, string> = {
  neutral: `   ／l、
（ﾟ､ ｡ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  happy: `   ／l、
（^ω ^ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  excited: `   ／l、　✦
（◉ω ◉ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  sleepy: `   ／l、
（－ω － ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  drowsy: `   ／l、　z
（－ _ － ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  asleep: `      Ｚ
   ／l、　z
（＝.＝ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  curious: `   ／l、　？
（・ ｡ ・ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  startled: `   ／l、！
（◎ ｡ ◎ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
  annoyed: `   ／l、　💢
（＞ω＜ ７
   l、ﾞ ~ヽ
   じしf_,)ノ`,
};

export type AsciiPetMoodLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const ASCII_PET_MOOD_LABEL: Record<AsciiPetMoodLevel, string> = {
  1: 'ふきげんにゃ…',
  2: 'ねむいにゃ',
  3: 'ふつうにゃ',
  4: 'ごきげんにゃ',
  5: 'たのしいにゃ',
  6: 'さいこうにゃ',
};

export const moodToExpression = (mood: AsciiPetMoodLevel): AsciiPetExpression => {
  if (mood <= 2) {
    return 'sleepy';
  }
  if (mood <= 4) {
    return 'neutral';
  }
  if (mood === 5) {
    return 'happy';
  }
  return 'excited';
};

export const clampMood = (mood: number): AsciiPetMoodLevel => {
  if (mood < 1) {
    return 1;
  }
  if (6 < mood) {
    return 6;
  }
  return Math.round(mood) as AsciiPetMoodLevel;
};

export type AsciiPetLang = 'ja' | 'en';

/** `[ja, en]` のタプル。並べておくことで対訳の保守がしやすい */
export type AsciiPetReplyPair = readonly [ja: string, en: string];

export interface AsciiPetReplies {
  idle: readonly AsciiPetReplyPair[];
  asleep: readonly AsciiPetReplyPair[];
  wake: readonly AsciiPetReplyPair[];
  call: readonly AsciiPetReplyPair[];
  pet: readonly AsciiPetReplyPair[];
  annoyed: readonly AsciiPetReplyPair[];
  fallback: readonly AsciiPetReplyPair[];
  drowsyCall: AsciiPetReplyPair;
  speechTest: AsciiPetReplyPair;
  voiceTest: AsciiPetReplyPair;
}

// English の綴りは「英訳」ではなく、英語 TTS が読みやすいローマ字に揃える
export const REPLIES: AsciiPetReplies = {
  idle: [
    ['にゃ〜…', 'neyaaah...'],
    ['あくびにゃ〜', 'aku bi neya'],
    ['ねむいにゃ…', 'nemu e neya...'],
    ['ちょっとうとうとにゃ', 'chotto wuto wuto neya'],
    ['ねこ、おやすみモードにゃ', 'neko, oyasumi modo neya'],
  ],
  asleep: [
    ['Ｚｚｚ…', 'zoo zoo zoo...'],
    ['すぴー…', 'spee...'],
    ['むにゃむにゃ…にゃ', 'moo neya moo neya... neya'],
    ['ねこのゆめにゃ…', 'neko no yume neya...'],
  ],
  wake: [
    ['にゃっ！？おこしたにゃ！', 'neya!?, oko shi ta neya!'],
    ['ふぁ……なんのようにゃ？', 'fua..., nan no yo, neya?'],
    ['ねてたのににゃ〜', 'ne te ta no ni neyaa'],
    ['おっ、よんだにゃ？', 'oh, yonda neya?'],
  ],
  call: [
    ['にゃ？', 'neyaa?'],
    ['なんにゃ？', 'nan neyaa?'],
    ['よんだにゃ？', 'yon da neyaa?'],
    ['うん？', 'un?'],
    ['にゃ〜？', 'neyaa?'],
    ['はーい', 'haai'],
  ],
  pet: [
    ['にゃ〜ん', 'neyaan'],
    ['ぐるるるる…', 'gu ru ru ru...'],
    ['もっとなでてにゃ', 'motto, na de te neya'],
    ['うれしいにゃ', 'wu reshie neya'],
    ['にゃっ、きもちいいにゃ', 'neya, kimo chie neya'],
    ['ふみゃ〜', 'who meow'],
    ['にゃはは', 'neyahaha'],
    ['すりすりにゃ', 'suri suri neya'],
    ['ごろにゃ〜ん', 'goro nea n'],
  ],
  annoyed: [
    ['しつこいにゃ！', 'shiu tsu koi neya!'],
    ['もうやめてにゃ', 'moh yamete neya'],
    ['ふんっ、しらないにゃ', 'fun, she ra nai neya'],
    ['にゃーっ！うるさいにゃ', 'neyaa! u ru sai neya'],
    ['ちょっとほっといてにゃ', 'chotto hotto ite neya'],
    ['シャーッ', 'shaaa'],
  ],
  fallback: [
    ['にゃるほどにゃ', 'naruhodo neya'],
    ['そうにゃのか〜', 'soh neya no kaa'],
    ['ふむふむにゃ', 'whom whom neya'],
    ['もうちょっとくわしくにゃ', 'mou chotto ku washiku neya'],
    ['たのしいにゃ！', 'ta no she neya!'],
    ['にゃ〜にゃ〜', 'neyaa neyaa'],
    ['おなかすいたにゃ', 'onaka suita neya'],
    ['なでてほしいにゃ', 'na de te ho she neya'],
    ['なるほどにゃ〜', 'naruhodo neyaa'],
    ['にゃ、それでそれで？', 'neya, so le de so le de?'],
  ],
  drowsyCall: ['にゃっ、なんにゃ？', 'neya, nan neya?'],
  speechTest: ['にゃ〜、きこえてるにゃ', 'neyaa, ki ko A telu neya'],
  voiceTest: ['にゃ〜、これがあたらしい声にゃ', 'neya, kore ga atara she ko A neya'],
};

export const getAsciiPetLang = (voice: SpeechSynthesisVoice | null): AsciiPetLang => {
  if (voice === null) {
    return 'ja';
  }
  return voice.lang.toLowerCase().startsWith('ja') ? 'ja' : 'en';
};

/** `[ja, en]` ペアから言語に合った文字列を取り出す */
export const pickReplyByLang = (pair: AsciiPetReplyPair, lang: AsciiPetLang): string => {
  return lang === 'ja' ? pair[0] : pair[1];
};

/** ペア配列からランダムに1つ選び、言語に合った文字列を返す */
export const pickRandomReplyByLang = (list: readonly AsciiPetReplyPair[], lang: AsciiPetLang): string => {
  const pair = list[Math.floor(Math.random() * list.length)];
  return pickReplyByLang(pair, lang);
};
