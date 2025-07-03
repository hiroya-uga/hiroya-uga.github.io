// ビルド時にしか呼ばれない関数群。クライアントサイドで実行される関数と同じファイルに置くとビルドが転ける。。

import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export type ArticleFrontMatter = {
  [key: string]: any;
} & {
  title: string;
  description: string;
  pathname: string;
  publishedAt: string;
};

export async function getArticles(articlesDir: string) {
  const filenames = fs.readdirSync(articlesDir);

  const articles = filenames
    .map((filename) => {
      const filePath = path.join(articlesDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      if ('title' in data === false || 'publishedAt' in data === false) {
        throw new Error(`Invalid front matter in file: ${filename}`);
      }

      return {
        ...data,
        pathname:
          articlesDir
            .replace(process.cwd(), '')
            .replace('/src/app', '')
            .split('/')
            .filter((part) => {
              return part !== 'markdown' && part.startsWith('(') === false && part.startsWith('[') === false;
            })
            .join('/') +
          '/' +
          filename.replace('.md', ''),
      } as ArticleFrontMatter;
    })
    .sort((a, b) => {
      if (a.publishedAt < b.publishedAt) {
        return 1;
      }
      if (a.publishedAt > b.publishedAt) {
        return -1;
      }

      return 0;
    });

  return articles;
}

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
