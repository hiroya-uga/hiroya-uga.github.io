import { ARTICLE_CATEGORY_MAPPING } from '@/constants/articles';

export const resolveCategoryName = (value: string) => {
  if (value.startsWith('https://')) {
    return 'EXTERNAL';
  }
  const keyword = value.includes('/') ? value.split('/')[2] : value;
  if (keyword in ARTICLE_CATEGORY_MAPPING) {
    return ARTICLE_CATEGORY_MAPPING[keyword as keyof typeof ARTICLE_CATEGORY_MAPPING];
  }

  return 'UNKNOWN';
};
