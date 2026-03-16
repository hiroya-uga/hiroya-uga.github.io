export const ARTICLE_PATH_PATTERN_LIST = {
  // category別に年数を指定する必要がある
  'tech-blog': ['2026', '2025'],
  blog: ['2026', '2025'],
  gunpla: ['hg'],
};

export type ArticleCategory = keyof typeof ARTICLE_PATH_PATTERN_LIST;

export const getSubCategoryName = (yearOrSubcategory: string) => {
  if (/^\d{4}$/.test(yearOrSubcategory)) {
    return `${yearOrSubcategory}年`;
  }

  switch (yearOrSubcategory) {
    case 'hg':
      return 'HG';
  }

  return yearOrSubcategory;
};

export const getSubCategoryListLabel = (category: ArticleCategory) => {
  switch (category) {
    case 'gunpla':
      return 'シリーズ別';
    default:
      return '過去ログ';
  }
};

export const ARTICLE_CATEGORY_LABEL_MAPPING = {
  'tech-blog': 'Tech Blog',
  blog: 'Blog',
  gunpla: 'ガンプラ制作',
} as const;

export type ArticleCategoryLabel =
  | (typeof ARTICLE_CATEGORY_LABEL_MAPPING)[keyof typeof ARTICLE_CATEGORY_LABEL_MAPPING]
  | 'EXTERNAL'
  | 'UNKNOWN';

export const ARTICLE_CATEGORY_DESCRIPTION_MAPPING = {
  'tech-blog': 'Web開発に関するブログ記事です。',
  blog: '日常の出来事や趣味についてのブログ記事です。',
  gunpla: 'ガンプラの制作記録です。',
} as const;
