import { SITE_NAME } from '@/constants/meta';
import { resolveCategoryName } from '@/utils/articles';

import path from 'path';

export const getArticleMarkdownFilePath = (category: string, year?: string) => {
  const result = path.join(process.cwd(), 'src', 'markdown', 'articles', category);

  if (year) {
    return path.join(result, year);
  }

  return result;
};

export const getArticlesPageMeta = {
  categoryTop: (category: string) => {
    const categoryName = resolveCategoryName(category);
    const pageTitle = categoryName;
    return {
      title: `${pageTitle} | 記事一覧 | ${SITE_NAME}`,
      pageTitle,
      description: `${categoryName}一覧です`,
    };
  },
  yearTop: (category: string, year: string) => {
    const categoryName = resolveCategoryName(category);
    return {
      title: `${year}年の${categoryName} | 記事一覧 | ${SITE_NAME}`,
      pageTitle: `${year}年の${categoryName}`,
      description: `${year}年の${categoryName}一覧です`,
    };
  },
};
