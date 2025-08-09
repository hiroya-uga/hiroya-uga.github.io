import { ARTICLE_CATEGORY_DESCRIPTION_MAPPING, ARTICLE_CATEGORY_MAPPING } from '@/constants/articles';

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

export const resolveCategoryDescription = (value: string) => {
  if (value.startsWith('https://')) {
    return '外部サイトに移動します。';
  }
  const keyword = value.includes('/') ? value.split('/')[2] : value;
  if (keyword in ARTICLE_CATEGORY_DESCRIPTION_MAPPING) {
    return ARTICLE_CATEGORY_DESCRIPTION_MAPPING[keyword as keyof typeof ARTICLE_CATEGORY_DESCRIPTION_MAPPING];
  }

  return 'NO DESCRIPTION';
};
