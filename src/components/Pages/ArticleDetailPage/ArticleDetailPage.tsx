import { TweetLink } from '@/components/Clickable/TweetLink';
import { ArticleMain } from '@/components/structures/ArticleMain';
import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';
import { ARTICLE_PATH_PATTERN_LIST, ArticleCategory, getSubCategoryName } from '@/constants/articles';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';

import { getPostBySlug } from '@/libs/marked';
import { getArticleMarkdownFilePath } from '@/utils/get-article-markdown-file-path';
import { ArticleNavigation } from './server';

interface Props {
  post: NonNullable<ReturnType<typeof getPostBySlug>>;
  category: ArticleCategory;
  yearOrSubcategory: string;
  fileName: string;
  pathname: string;
}

async function getAllArticlesInCategory(category: ArticleCategory) {
  const articlePromises = ARTICLE_PATH_PATTERN_LIST[category].map((year) =>
    getArticles(getArticleMarkdownFilePath(category, year), `/articles/${category}/${year}`),
  );
  return (await Promise.all(articlePromises)).flat();
}

export const ArticleDetailPage = async ({ post, category, yearOrSubcategory, pathname }: Props) => {
  const blogs = await getAllArticlesInCategory(category);
  const currentIndex = blogs.findIndex((blog) => blog.pathname === pathname);
  const categoryName = resolveCategoryName(category);

  const previousArticle = blogs[currentIndex + 1];
  const nextArticle = blogs[currentIndex - 1];

  return (
    <>
      <GlobalHeader layout="article-content" />

      <main className="@container">
        <ArticleMain post={post} />
        <div className="mx-content-inline @container not-empty:mt-[20vh] text-center">
          <p className="mb-paragraph">
            <TweetLink
              message={`【${categoryName}】${post.meta.title.replaceAll('\n', '')}`}
              hashtags={post.meta.topics}
            />
          </p>
          <ul className="@w640:grid-cols-2 @w640:gap-8 @w640:justify-center mx-auto grid max-w-[min(37.5rem,90%)] gap-4">
            {previousArticle && (
              <li className="@w640:flex @w640:first:last:col-span-2">
                <ArticleNavigation article={previousArticle} categoryName={categoryName} direction="previous" />
              </li>
            )}
            {nextArticle && (
              <li className="@w640:col-start-2 @w640:flex @w640:first:last:col-span-2">
                <ArticleNavigation article={nextArticle} categoryName={categoryName} direction="next" />
              </li>
            )}
          </ul>
        </div>
      </main>

      <GlobalFooter
        additionalBreadcrumbs={[
          { href: `/articles/${category}`, title: resolveCategoryName(category) },
          { href: `/articles/${category}/${yearOrSubcategory}`, title: getSubCategoryName(yearOrSubcategory) },
        ]}
        currentPageTitle={post.meta.title.replaceAll('\n', '')}
      />
    </>
  );
};
