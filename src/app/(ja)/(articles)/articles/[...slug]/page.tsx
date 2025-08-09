import { ARTICLE_PATH_PATTERN_LIST, ArticleCategory } from '@/constants/articles';
import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { generateOgpImage } from '@/libs/generate-ogp';
import { getAllNoteIds, getPostBySlug } from '@/libs/marked';
import { resolveCategoryName } from '@/utils/articles';
import { Metadata } from 'next';

import { ArticlePage, CategoryPage, YearPage } from '@/app/(ja)/(articles)/articles/[...slug]/index';
import { getArticlesPageMeta } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import { notFound } from 'next/navigation';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'markdown', 'articles');

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [categoryName, year, fileName] = slug;
  const category = categoryName as ArticleCategory;

  if (slug.length === 1) {
    return <CategoryPage category={category} />;
  }

  if (slug.length === 2) {
    return <YearPage category={category} year={year} />;
  }

  return <ArticlePage slug={slug} category={category} year={year} fileName={fileName} filePath={filePath} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    const { title, pageTitle, description } = getArticlesPageMeta.categoryTop(slug[0]);
    const ogImage = await generateOgpImage(['articles', ...slug], pageTitle);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${URL_ORIGIN}/articles/tech-blog/2025`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: `${URL_ORIGIN}/articles/tech-blog/2025`,
      },
    };
  }

  if (slug.length === 2) {
    const { title, pageTitle, description } = getArticlesPageMeta.yearTop(slug[0], slug[1]);
    const ogImage = await generateOgpImage(['articles', ...slug], pageTitle);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${URL_ORIGIN}/articles/tech-blog/2025`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: `${URL_ORIGIN}/articles/tech-blog/2025`,
      },
    };
  }

  const post = getPostBySlug(filePath, slug.join('/'));

  if (!post) return notFound();

  const [category, year, fileName] = slug;
  const canonical = `${URL_ORIGIN}/articles/${category}/${year}/${fileName}`;
  const categoryName = resolveCategoryName(category);
  const ogImage = await generateOgpImage(['articles', ...slug], post.meta.title, categoryName, post.meta.ogImage);

  const description =
    `【${categoryName}】` +
    (post.meta.description ?? (await post.content).replace(/<[^>]+>/g, '').slice(0, 69) + '…') +
    ' ' +
    (post.meta.tags ?? []).map((tag: string) => `#${tag}`).join(', ');

  return {
    title: `${post.meta.title.replace(/\n/g, '')} | ${categoryName} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: post.meta.title.replace(/\n/g, ''),
      description,
      type: 'article',
      url: `${URL_ORIGIN}/articles/${category}/${year}/${fileName}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical,
    },
  };
}

export function generateStaticParams() {
  const fileList = Object.entries(ARTICLE_PATH_PATTERN_LIST)
    .flatMap(([category, years]) => {
      return years.flatMap((year) => {
        const fileNames = getAllNoteIds(path.join(filePath, category, year));

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
