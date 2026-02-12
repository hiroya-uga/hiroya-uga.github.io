import { TweetLink } from '@/components/Clickable/TweetLink';
import { ArticleMain } from '@/components/structures/ArticleMain';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';
import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import { URL_ORIGIN } from '@/constants/meta';
import { getPostBySlug } from '@/libs/marked';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';

import { notFound } from 'next/navigation';
import { getArticleMarkdownFilePath } from '../utils/get-article-markdown-file-path';
import { ArticleJsonLD, ArticleNavigation } from './parts';

type Props = { slug: string[]; category: string; year: string; fileName: string; filePath: string };

async function getAllArticlesInCategory(category: string) {
  const articlePromises = ARTICLE_PATH_PATTERN_LIST[category as keyof typeof ARTICLE_PATH_PATTERN_LIST].map((year) =>
    getArticles(getArticleMarkdownFilePath(category, year)),
  );
  return (await Promise.all(articlePromises)).flat();
}

export const ArticlePage = async ({ slug, category, year, fileName, filePath }: Props) => {
  const post = getPostBySlug(filePath, slug.join('/'));

  if (!post || !(category in ARTICLE_PATH_PATTERN_LIST)) {
    return notFound();
  }

  const blogs = await getAllArticlesInCategory(category);
  const pathname = `/articles/${slug.join('/')}`;
  const currentIndex = blogs.findIndex((blog) => blog.pathname === pathname);
  const canonical = `${URL_ORIGIN}${pathname}`;
  const categoryName = resolveCategoryName(category);

  const previousArticle = blogs[currentIndex + 1];
  const nextArticle = blogs[currentIndex - 1];

  return (
    <>
      <Header layout="article-content" />
      <main className="@container">
        <ArticleMain post={post} />
        <div className="mx-content-inline @container not-empty:mt-[20vh] text-center">
          <p className="mb-paragraph">
            <TweetLink
              message={`【${categoryName}】${post.meta.title.replaceAll('\n', '')}`}
              hashtags={post.meta.tags}
            />
          </p>
          <ul className="max-w-article @w640:grid-cols-2 @w640:gap-8 @w640:justify-center mx-auto grid gap-4">
            {previousArticle && (
              <li>
                <ArticleNavigation article={previousArticle} categoryName={categoryName} direction="previous" />
              </li>
            )}
            {nextArticle && (
              <li className="@w640:col-start-2">
                <ArticleNavigation article={nextArticle} categoryName={categoryName} direction="next" />
              </li>
            )}
          </ul>
        </div>
      </main>
      <Footer
        additionalBreadcrumbs={[
          { href: `/articles/${category}`, title: resolveCategoryName(category) },
          { href: `/articles/${category}/${year}`, title: year },
        ]}
        currentPageTitle={post.meta.title.replaceAll('\n', '')}
      />
      <ArticleJsonLD post={post} category={category} year={year} fileName={fileName} canonical={canonical} />
    </>
  );
};
