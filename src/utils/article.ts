import { ARTICLE_CATEGORY_MAPPING } from '@/constants/articles';

export const resolveCategoryName = (string: string) => {
  if (string in ARTICLE_CATEGORY_MAPPING) {
    return ARTICLE_CATEGORY_MAPPING[string as keyof typeof ARTICLE_CATEGORY_MAPPING];
  }

  return 'UNKNOWN';
};
