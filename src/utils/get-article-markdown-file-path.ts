import { ArticleCategory } from '@/constants/articles';
import path from 'node:path';

export const getArticleMarkdownFilePath = (category: ArticleCategory, year?: string) => {
  const result = path.join(process.cwd(), 'articles', category);

  if (year) {
    return path.join(result, year);
  }

  return result;
};
