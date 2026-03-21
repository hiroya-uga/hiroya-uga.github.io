import { getSubCategoryName } from '@/constants/articles';
import { SITE_NAME } from '@/constants/meta';
import { resolveCategoryDescription, resolveCategoryName } from '@/utils/articles';

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
  yearOrSubCategoryPage: (category: string, yearOrSubcategory: string) => {
    const categoryName = resolveCategoryName(category);
    const categoryDescription = resolveCategoryDescription(category);

    const title = (() => {
      if (/\d{4}/.test(yearOrSubcategory)) {
        return `${yearOrSubcategory}年の${categoryName}`;
      }

      return `${getSubCategoryName(yearOrSubcategory)}の${categoryName}`;
    })();

    return {
      title: `${title} | 記事一覧 | ${SITE_NAME}`,
      pageTitle: `${title}一覧`,
      description: categoryDescription,
    };
  },
};
