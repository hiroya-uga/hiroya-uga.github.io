import { TweetLink } from '@/components/Clickable/TweetLink';
import { SvgIcon } from '@/components/Icons';
import { ArticleMain } from '@/components/structures/ArticleMain';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';
import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import { DOMAIN_NAME, SITE_AUTHOR, URL_ORIGIN } from '@/constants/meta';
import { getPostBySlug } from '@/libs/marked';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';
import Link from 'next/link';

import { getArticleMarkdownFilePath } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import clsx from 'clsx';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { useMemo } from 'react';

type Props = { slug: string[]; category: string; year: string; fileName: string; filePath: string };
type NavigationProps = {
  article: { pathname: string; title: string };
  direction: 'previous' | 'next';
};

const Navigation = ({ article, direction }: NavigationProps) => {
  const isPrevious = direction === 'previous';

  return (
    <Link
      href={article.pathname}
      className={clsx([
        'hover:bg-banner ${paddingClass} relative block rounded-lg border border-[#00000022] p-3 text-inherit no-underline transition-[box-shadow,background-color] hover:shadow-lg dark:border-[#ffffff44]',
        isPrevious ? '@w640:pl-10 @w640:pr-6 px-10' : '@w640:pl-6 @w640:pr-10 px-10',
      ])}
    >
      <span className={clsx(['absolute inset-y-0 my-auto block size-4', isPrevious ? 'left-3' : 'right-3'])}>
        <SvgIcon name={isPrevious ? 'arrow-left' : 'arrow-right'} alt="" />
      </span>
      <span className="block text-xs">{isPrevious ? '前の記事：' : '次の記事：'}</span>
      <span className="text-link block text-sm">
        {article.title.split('\n').map((line, index) => (
          <span key={index} className="underline last:inline-block">
            {line}
          </span>
        ))}
      </span>
    </Link>
  );
};

type JsonLDProps = {
  post: ReturnType<typeof getPostBySlug>;
  category: string;
  year: string;
  fileName: string;
  canonical: string;
};

const JsonLD = ({ post, category, year, fileName, canonical }: JsonLDProps) => {
  const json = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post?.meta.title.replace(/\n/g, ''),
      image: `https://${DOMAIN_NAME}/generated-ogp/articles/${category}/${year}/${fileName}.png`,
      datePublished: new Date(post?.meta.publishedAt).toISOString(),
      author: {
        '@type': 'Person',
        name: SITE_AUTHOR,
        url: `https://${DOMAIN_NAME}/about`,
        logo: {
          '@type': 'ImageObject',
          url: `https://${DOMAIN_NAME}/profile.png`,
        },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    }),
    [post, category, year, fileName, canonical],
  );

  return (
    <Script type="application/ld+json" id="json-ld">
      {JSON.stringify(json)}
    </Script>
  );
};

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
        <div className="mx-content-inline @container not-empty:mt-30 text-center">
          <p className="mb-paragraph">
            <TweetLink
              message={`【${categoryName}】${post.meta.title.replaceAll('\n', '')}`}
              hashtags={post.meta.tags}
            />
          </p>
          <ul className="max-w-article @w640:grid-cols-2 @w640:gap-8 @w640:justify-center mx-auto grid gap-4">
            {previousArticle && (
              <li>
                <Navigation article={previousArticle} direction="previous" />
              </li>
            )}
            {nextArticle && (
              <li className="@w640:col-start-2">
                <Navigation article={nextArticle} direction="next" />
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
      <JsonLD post={post} category={category} year={year} fileName={fileName} canonical={canonical} />
    </>
  );
};
