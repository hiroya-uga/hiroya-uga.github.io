import { JobRole } from '@/constants/works';

export const FOOTER_LINK_LIST = [
  { href: '/about', title: '当サイトおよび管理人について' },
  { href: '/privacy-policy', title: 'プライバシーポリシー' },
  { href: '/disclaimer', title: '免責事項' },
  { href: '/contact', title: 'お問い合わせ' },
  { href: 'https://github.com/hiroya-uga/hiroya-uga.github.io/issues', title: 'フィードバック', target: '_blank' },
];

type LinkListItem = {
  emoji: string;
  pathname: string;
};

export const DOCUMENTS_LINK_LIST: LinkListItem[] = [
  { emoji: '', pathname: '/documents/translations' },
  { emoji: '', pathname: '/documents/notes' },
  { emoji: '', pathname: '/documents/media' },
  { emoji: '', pathname: '/documents/fantasized-specs' },
];

export const TRANSLATION_DOCUMENTS_LINK_LIST: LinkListItem[] = [
  {
    emoji: '',
    pathname: '/documents/translations/w3c/wai/tutorials/images',
  },
  {
    emoji: '📝',
    pathname: '/documents/translations/pauljadam-modern-web-a11y-demos',
  },
];

type ToolPage = (LinkListItem & {
  type: 'default' | 'playground';
  userType?: JobRole[];
})[];

export const TOOLS_LINK_LIST: ToolPage = [
  // 追加順
  {
    type: 'default',
    emoji: '🌳',
    pathname: '/tools/an-alt-decision-tree',
    userType: ['developer', 'director', 'planner', 'writer'],
  },
  {
    type: 'default',
    emoji: '👆',
    pathname: '/tools/character-count',
    userType: [],
  },
  {
    type: 'default',
    emoji: '🔔',
    pathname: '/tools/slack-reminder-command-generator',
    userType: [],
  },
  {
    type: 'default',
    emoji: '',
    pathname: '/tools/get-url-from-dom',
    userType: ['director', 'planner'],
  },
  {
    type: 'default',
    emoji: '🪮',
    pathname: '/tools/markup-dev-supporter',
    userType: ['developer'],
  },

  // playground
  { type: 'playground', emoji: '', pathname: '/tools/accessible-name-and-description-computation' },
  { type: 'playground', emoji: '📏', pathname: '/tools/css-units' },
  { type: 'playground', emoji: '', pathname: '/tools/dom-events-watcher' },
  { type: 'playground', emoji: '', pathname: '/tools/touch-event-touches' },
  {
    type: 'playground',
    emoji: '⌨',
    pathname: '/tools/keyboard-event',
  },
  {
    type: 'playground',
    emoji: '♾️',
    pathname: '/tools/kaprekar-number',
  },
];

export const GAMES_LINK_LIST: LinkListItem[] = [{ emoji: '🔢', pathname: '/games/sudoku' }];
