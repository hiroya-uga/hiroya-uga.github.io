import { SITE_NAME } from '@/constants/meta';
import { resolveCategoryDescription, resolveCategoryName } from '@/utils/articles';

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
    const categoryDescription = resolveCategoryDescription(category);
    const pageTitle = `${categoryName}一覧`;
    return {
      title: `${pageTitle} | 記事一覧 | ${SITE_NAME}`,
      pageTitle,
      description: categoryDescription,
    };
  },
  yearTop: (category: string, year: string) => {
    const categoryName = resolveCategoryName(category);
    const categoryDescription = resolveCategoryDescription(category);
    return {
      title: `${year}年の${categoryName} | 記事一覧 | ${SITE_NAME}`,
      pageTitle: `${year}年の${categoryName}一覧`,
      description: categoryDescription,
    };
  },
};
