export const ARTICLE_PATH_PATTERN_LIST = {
  // category別に年数を指定する必要がある
  blog: ['2026', '2025'],
  'tech-blog': ['2025'],
};

export type ArticleCategory = keyof typeof ARTICLE_PATH_PATTERN_LIST;

export const ARTICLE_CATEGORY_LABEL_MAPPING = {
  blog: 'Blog',
  'tech-blog': 'Tech Blog',
} as const;

export type ArticleCategoryLabel =
  | (typeof ARTICLE_CATEGORY_LABEL_MAPPING)[keyof typeof ARTICLE_CATEGORY_LABEL_MAPPING]
  | 'EXTERNAL'
  | 'UNKNOWN';

export const ARTICLE_CATEGORY_DESCRIPTION_MAPPING = {
  blog: '日常の出来事や趣味についてのブログ記事です。',
  'tech-blog': 'Web開発に関するブログです。',
} as const;
