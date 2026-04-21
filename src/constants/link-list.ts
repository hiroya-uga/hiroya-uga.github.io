import { JobRole } from '@/constants/works';

export const FOOTER_LINK_LIST = [
  {
    href: '/about',
    label: {
      ja: '当サイトおよび管理人について',
      en: 'About (JP)',
    },
  },
  {
    href: '/privacy-policy',
    label: {
      ja: 'プライバシーポリシー',
      en: 'Privacy Policy (JP)',
    },
  },
  {
    href: '/disclaimer',
    label: {
      ja: '免責事項',
      en: 'Disclaimer (JP)',
    },
  },
  {
    href: '/contact',
    label: {
      ja: 'お問い合わせ',
      en: 'Contact (JP)',
    },
  },
  {
    href: 'https://github.com/hiroya-uga/hiroya-uga.github.io/issues',
    label: { ja: 'フィードバック', en: 'Feedback' },
    target: '_blank',
  },
];

export type EmojiLinkListItem = {
  emoji: string;
  pathname: string;
  noPickup?: boolean;
};

export const DOCUMENTS_LINK_LIST: EmojiLinkListItem[] = [
  { emoji: '', pathname: '/documents/translations' },
  { emoji: '', pathname: '/documents/notes' },
  { emoji: '', pathname: '/documents/media' },
  { emoji: '', pathname: '/documents/fantasized-specs' },
];

export const TRANSLATION_DOCUMENTS_LINK_LIST: EmojiLinkListItem[] = [
  {
    emoji: '',
    pathname: '/documents/translations/w3c/wai/tutorials/images',
  },
  {
    emoji: '📝',
    pathname: '/documents/translations/pauljadam-modern-web-a11y-demos',
  },
];

type ToolPage = (EmojiLinkListItem & {
  userType?: JobRole[];
})[];

export const OSS_LINK_LIST = [
  {
    emoji: '',
    title: 'eslint-plugin-ime-safe-form',
    url: 'https://www.npmjs.com/package/eslint-plugin-ime-safe-form',
    description: 'IMEセーフなフォーム送信を強制するESLintプラグイン。',
  },
] as const;

export const TOOLS_LINK_LIST: Record<string, ToolPage> = {
  // 追加順
  web: [
    {
      emoji: '🌳',
      pathname: '/tools/an-alt-decision-tree',
      userType: ['developer', 'director', 'planner', 'writer'],
    },
    {
      emoji: '🧮',
      pathname: '/tools/character-count',
      userType: [],
    },
    {
      emoji: '🔔',
      pathname: '/tools/slack-reminder-command-generator',
      userType: [],
    },
    {
      emoji: '',
      pathname: '/tools/get-url-from-dom',
      userType: ['director', 'planner', 'qa'],
    },
    {
      emoji: '🪮',
      pathname: '/tools/markup-dev-supporter',
      userType: ['developer'],
    },
    {
      emoji: '☀️',
      pathname: '/tools/screen-wake-lock',
      userType: [],
    },
    {
      emoji: '🔖',
      pathname: '/tools/nu-bookmarklet-generator',
      userType: ['developer', 'qa'],
    },
    {
      emoji: '🎨',
      pathname: '/tools/contrast-checker',
      userType: ['developer', 'designer', 'qa'],
    },
  ],
  cli: [
    {
      emoji: '🛠️',
      pathname: '/tools/vnux',
      userType: ['developer', 'qa'],
    },
  ],
  playground: [
    { emoji: '', pathname: '/tools/accessible-name-and-description-computation' },
    { emoji: '📏', pathname: '/tools/css-units' },
    { emoji: '', pathname: '/tools/dom-events-watcher' },
    { emoji: '👆', pathname: '/tools/touch-event-touches' },
    { emoji: '⌨', pathname: '/tools/keyboard-event' },
    { emoji: '♾️', pathname: '/tools/kaprekar-number' },
    { emoji: '文', pathname: '/tools/render-text-in-react', noPickup: true },
    { emoji: '📈', pathname: '/tools/sort-visualizer' },
  ],
};

export const GAMES_LINK_LIST: EmojiLinkListItem[] = [
  { emoji: '🔢', pathname: '/games/sudoku' },
  { emoji: '🏓', pathname: '/games/simple-block-breaker' },
  { emoji: '🔟', pathname: '/games/number-pairing' },
];
