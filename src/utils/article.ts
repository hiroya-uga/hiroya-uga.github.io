import { ARTICLE_CATEGORY_MAPPING, ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import { getArticles } from '@/utils/get-articles';
import path from 'path';

export const resolveCategoryName = (string: string) => {
  if (string in ARTICLE_CATEGORY_MAPPING) {
    return ARTICLE_CATEGORY_MAPPING[string as keyof typeof ARTICLE_CATEGORY_MAPPING];
  }

  return 'UNKNOWN';
};

const getArticlePath = (category: string, year: string) => {
  return path.join(
    process.cwd(),
    'src',
    'app',
    '(ja)',
    '(articles)',
    'articles',
    '[...slug]',
    'markdown',
    category,
    year,
  );
};

const articlePromises = Object.entries(ARTICLE_PATH_PATTERN_LIST)
  .flatMap(([category, years]) => {
    return years.flatMap((year) => {
      return getArticles(getArticlePath(category, year));
    });
  })
  .flat();

export const getAllArticles = async () => (await Promise.all(articlePromises)).flat();
