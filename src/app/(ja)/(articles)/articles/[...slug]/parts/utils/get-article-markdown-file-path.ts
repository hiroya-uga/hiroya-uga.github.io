import path from 'node:path';

export const getArticleMarkdownFilePath = (category: string, year?: string) => {
  const result = path.join(process.cwd(), 'src', 'markdown', 'articles', category);

  if (year) {
    return path.join(result, year);
  }

  return result;
};
