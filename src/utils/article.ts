import { ARTICLE_CATEGORY_MAPPING } from '@/constants/articles';

export const resolveCategoryName = (string: string) => {
  switch (string) {
    case 'tech-blog':
      return ARTICLE_CATEGORY_MAPPING['tech-blog'];
  }

  return '';
};
