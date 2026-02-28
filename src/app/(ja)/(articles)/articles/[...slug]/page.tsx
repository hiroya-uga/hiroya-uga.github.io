import { ARTICLE_PATH_PATTERN_LIST, ArticleCategory } from '@/constants/articles';
import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { generateOgpImage } from '@/libs/generate-ogp';
import { getAllNoteIds, getPostBySlug } from '@/libs/marked';
import { resolveCategoryName } from '@/utils/articles';
import { Metadata } from 'next';

import { ArticlePage, CategoryPage, YearPage } from '@/app/(ja)/(articles)/articles/[...slug]/parts';
import { getArticleMarkdownFilePath } from '@/app/(ja)/(articles)/articles/[...slug]/parts/utils/get-article-markdown-file-path';
import { getArticlesPageMeta } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import { objectKeys } from '@/utils/object-keys';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

const isArticleCategory = (category: string): category is ArticleCategory => {
  return category in ARTICLE_PATH_PATTERN_LIST;
};

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [category, year, fileName] = slug;

  if (isArticleCategory(category) === false || 3 < slug.length) {
    return notFound();
  }

  if (slug.length === 1) {
    return <CategoryPage category={category} />;
  }

  if (slug.length === 2) {
    return <YearPage category={category} year={year} />;
  }

  return <ArticlePage slug={slug} category={category} year={year} fileName={fileName} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;

  if (isArticleCategory(slug[0]) === false || 3 < slug.length) {
    return notFound();
  }

  if (slug.length === 1) {
    const { title, pageTitle, description } = getArticlesPageMeta.categoryTop(slug[0]);
    const ogImage = await generateOgpImage(['articles', ...slug], pageTitle);
    const url = `${URL_ORIGIN}/articles/${slug[0]}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: url,
      },
    };
  }

  if (slug.length === 2) {
    const url = `${URL_ORIGIN}/articles/${slug[0]}/${slug[1]}`;
    const { title, pageTitle, description } = getArticlesPageMeta.yearTop(slug[0], slug[1]);
    const ogImage = await generateOgpImage(['articles', ...slug], pageTitle);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: url,
      },
    };
  }

  const [category, year, fileName] = slug;

  if (isArticleCategory(category) === false) {
    return notFound();
  }

  const post = getPostBySlug(getArticleMarkdownFilePath(category, year), fileName);

  if (post === null) {
    return notFound();
  }

  const url = `${URL_ORIGIN}/articles/${category}/${year}/${fileName}`;
  const categoryName = resolveCategoryName(category);
  const ogImage = await generateOgpImage(['articles', ...slug], post.meta.title, categoryName, post.meta.ogImage);

  const description =
    `【${categoryName}】` +
    (post.meta.description ?? (await post.content).replace(/<[^>]+>/g, '').slice(0, 69) + '…') +
    ' ' +
    (post.meta.tags ?? []).map((tag: string) => `#${tag}`).join(', ');

  return {
    title: `${post.meta.title.replaceAll('\n', '')} | ${categoryName} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: post.meta.title.replaceAll('\n', ''),
      description,
      type: 'article',
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} ${categoryName} ${post.meta.title.replaceAll('\n', '')}`,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateStaticParams() {
  const fileList = objectKeys(ARTICLE_PATH_PATTERN_LIST)
    .flatMap((category) => {
      const years = ARTICLE_PATH_PATTERN_LIST[category];
      return years.flatMap((year) => {
        const fileNames = getAllNoteIds(getArticleMarkdownFilePath(category, year));

        return fileNames.map((filename) => {
          const slug = [category, year, filename];
          return { slug };
        });
      });
    })
    .flat();

  const params = [
    ...Object.keys(ARTICLE_PATH_PATTERN_LIST).map((category) => {
      return { slug: [category] };
    }),
    ...Object.entries(ARTICLE_PATH_PATTERN_LIST)
      .flatMap(([category, years]) => {
        return years.map((year) => {
          return { slug: [category, year] };
        });
      })
      .flat(),
    ...fileList,
  ];

  return params;
}
