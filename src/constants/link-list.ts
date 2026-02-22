import { JobRole } from '@/constants/works';

export const FOOTER_LINK_LIST = [
  { href: '/about', title: '当サイトおよび管理人について' },
  { href: '/privacy-policy', title: 'プライバシーポリシー' },
  { href: '/disclaimer', title: '免責事項' },
  { href: '/contact', title: 'お問い合わせ' },
  { href: 'https://github.com/hiroya-uga/hiroya-uga.github.io/issues', title: 'フィードバック', target: '_blank' },
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
  type: 'default' | 'playground';
  userType?: JobRole[];
})[];

export const TOOLS_LINK_LIST = [
  // 追加順
  ...(
    [
      {
        emoji: '🌳',
        pathname: '/tools/an-alt-decision-tree',
        userType: ['developer', 'director', 'planner', 'writer'],
      },
      {
        emoji: '👆',
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
        userType: ['director', 'planner'],
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
    ] as ToolPage
  ).map((item) => ({ ...item, type: 'default' }) as const),

  // playground
  ...(
    [
      { emoji: '', pathname: '/tools/accessible-name-and-description-computation' },
      { emoji: '📏', pathname: '/tools/css-units' },
      { emoji: '', pathname: '/tools/dom-events-watcher' },
      { emoji: '', pathname: '/tools/touch-event-touches' },
      { emoji: '⌨', pathname: '/tools/keyboard-event' },
      { emoji: '♾️', pathname: '/tools/kaprekar-number' },
      { emoji: '文', pathname: '/tools/render-text-in-react', noPickup: true },
      { emoji: '📈', pathname: '/tools/sort-visualizer' },
    ] as ToolPage
  ).map((item) => ({ ...item, type: 'playground' }) as const),
];

export const GAMES_LINK_LIST: EmojiLinkListItem[] = [
  { emoji: '🔢', pathname: '/games/sudoku' },
  { emoji: '🏓', pathname: '/games/simple-block-breaker' },
];
