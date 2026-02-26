// ビルド時にしか呼ばれない関数群。クライアントサイドで実行される関数と同じファイルに置くとビルドが転ける。。

import { getArticleMarkdownFilePath } from '@/app/(ja)/(articles)/articles/[...slug]/parts/utils/get-article-markdown-file-path';
import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { objectKeys } from './object-keys';

export type ArticleFrontMatter = {
  [key: string]: unknown;
} & {
  title: string;
  description: string;
  ogImage: string;
  pathname: string;
  publishedAt: string;
  tags?: string[];
};

export async function getArticles(articlesDir: string, urlBase?: string) {
  const filenames = fs.readdirSync(articlesDir);

  const articles = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(articlesDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      if ('title' in data === false || 'publishedAt' in data === false) {
        throw new Error(`Invalid front matter in file: ${filename}`);
      }

      return {
        ...data,
        pathname: urlBase
          ? `${urlBase}/${filename.replace('.md', '')}`
          : articlesDir.replace(process.cwd(), '') + '/' + filename.replace('.md', ''),
      } as ArticleFrontMatter;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return articles;
}

const articlePromises = objectKeys(ARTICLE_PATH_PATTERN_LIST)
  .flatMap((category) => {
    const years = ARTICLE_PATH_PATTERN_LIST[category];
    return years.flatMap((year) => {
      return getArticles(getArticleMarkdownFilePath(category, year));
    });
  })
  .flat();

export const getAllArticles = async () =>
  (await Promise.all(articlePromises)).flat().sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    }

    if (a.publishedAt > b.publishedAt) {
      return -1;
    }
    return 0;
  });
