import { ArticleList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import { getArticles } from '@/utils/get-articles';
import { getMetadata } from '@/utils/get-metadata';
import path from 'path';

const getPath = (category: string, year: string) => {
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

export const metadata = getMetadata('/articles');

export default async function Page() {
  const articlePromises = Object.entries(ARTICLE_PATH_PATTERN_LIST)
    .flatMap(([category, years]) => {
      return years.flatMap((year) => {
        return getArticles(getPath(category, year));
      });
    })
    .flat();
  const blogs = (await Promise.all(articlePromises)).flat();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p>不定期更新。カテゴリ別トップはまだありません🍵</p>
      </PageTitle>
      <ArticleList list={blogs} />
    </>
  );
}
