import { SvgIcon } from '@/components/Icons';
import { ArticleList } from '@/components/List';
import { ArticleMain } from '@/components/structures/ArticleMain';
import { Footer } from '@/components/structures/Footer';
import { PageTitle } from '@/components/structures/PageTitle';
import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import { DOMAIN_NAME, SITE_AUTHOR, SITE_NAME } from '@/constants/meta';
import { generateOgpImage } from '@/libs/generate-ogp';
import { getAllNoteIds, getPostBySlug } from '@/libs/marked';
import { resolveCategoryName } from '@/utils/article';
import { getArticles } from '@/utils/get-articles';
import { Metadata } from 'next';
import Link from 'next/link';

import { notFound } from 'next/navigation';
import Script from 'next/script';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'app', '(ja)', '(articles)', 'articles', '[...slug]', 'markdown');

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

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const category = slug[0];
  const year = slug[1];

  if (slug.length === 1) {
    const articlePromises = Object.entries(ARTICLE_PATH_PATTERN_LIST).flatMap(([categoryName, years]) => {
      return years.flatMap((yearValue) => {
        return getArticles(getPath(categoryName, yearValue));
      });
    });
    const blogs = (await Promise.all(articlePromises)).flat();
    const categoryName = resolveCategoryName(slug[0]);

    return (
      <>
        <main className="px-content-inline lg:pl-10">
          <div className="max-w-content mx-auto">
            <PageTitle title={categoryName} description={`${categoryName}記事一覧です。`} />
            <ArticleList list={blogs} />
          </div>
        </main>

        <Footer currentPageTitle={slug[1]} />
      </>
    );
  }

  if (slug.length === 2) {
    const blogs = await getArticles(getPath(category, year));
    const categoryName = resolveCategoryName(slug[0]);

    return (
      <>
        <main className="px-content-inline lg:pl-10">
          <div className="max-w-content mx-auto">
            <PageTitle title={`${year}年の${categoryName}`} description={`${year}年の${categoryName}記事一覧です。`} />

            <ArticleList list={blogs} />
          </div>
        </main>

        <Footer currentPageTitle={slug[1]} />
      </>
    );
  }

  const post = getPostBySlug(filePath, slug.join('/'));

  if (!post) return notFound();

  if (category in ARTICLE_PATH_PATTERN_LIST === false) {
    return notFound();
  }

  const articlePromises = ARTICLE_PATH_PATTERN_LIST[category as keyof typeof ARTICLE_PATH_PATTERN_LIST].map((year) => {
    return getArticles(getPath(category, year));
  });
  const blogs = (await Promise.all(articlePromises)).flat();
  const pathname = `/articles/${slug.join('/')}`;
  const index = blogs.findIndex((blog) => blog.pathname === pathname);
  const canonical = `https://${DOMAIN_NAME}${pathname}`;

  const previous = index - 1;
  const next = index + 1;

  return (
    <>
      <main>
        <ArticleMain post={post} />
        <div className="mx-content-inline @container not-empty:mt-20 text-center">
          <ul className="max-w-article @w640:grid-cols-2 @w640:gap-8 mx-auto grid justify-center gap-4">
            {blogs[previous] && (
              <li>
                <Link
                  href={blogs[previous].pathname}
                  className="hover:bg-banner relative block rounded-lg border border-[#00000022] p-3 px-8 text-inherit no-underline transition-[box-shadow,background-color] hover:shadow-lg dark:border-[#ffffff44]"
                >
                  <span className="absolute inset-y-0 left-3 my-auto block size-4">
                    <SvgIcon name="arrow-left" alt="" />
                  </span>
                  <span className="block text-xs">前の記事：</span>
                  <span className="text-link block text-sm underline">{blogs[previous].title}</span>
                </Link>
              </li>
            )}
            {blogs[next] && (
              <li className="@w640:col-start-2">
                <Link
                  href={blogs[next].pathname}
                  className="hover:bg-banner relative block rounded-lg border border-[#00000022] p-3 px-8 text-inherit no-underline transition-[box-shadow,background-color] hover:shadow-lg dark:border-[#ffffff44]"
                >
                  <span className="absolute inset-y-0 right-3 my-auto block size-4">
                    <SvgIcon name="arrow-right" alt="" />
                  </span>
                  <span className="block text-xs">次の記事：</span>
                  <span className="text-link block text-sm underline">{blogs[next].title}</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </main>
      <Footer
        additionalBreadcrumbs={[{ href: `/articles/${category}/${year}`, title: year }]}
        currentPageTitle={post.meta.title}
      />
      <Script type="application/ld+json" id="json-ld">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.meta.title,
          image: `https://${DOMAIN_NAME}/generated-ogp/articles/${category}/${year}/${slug[slug.length - 1]}.png`,
          datePublished: new Date(post.meta.publishedAt).toISOString(),
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
        })}
      </Script>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = resolveCategoryName(slug[0]);

  if (slug.length === 1) {
    const ogImage = await generateOgpImage(['articles', ...slug], `${categoryName} 一覧`);

    return {
      title: `${categoryName} 一覧 | ${SITE_NAME}`,
      description: `${categoryName}記事一覧です。`,
      openGraph: {
        title: categoryName,
        description: `${categoryName}記事一覧です。`,
        type: 'website',
        url: `https://${DOMAIN_NAME}/articles/tech-blog/2025`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: `https://${DOMAIN_NAME}/articles/tech-blog/2025`,
      },
    };
  }

  if (slug.length === 2) {
    const ogImage = await generateOgpImage(['articles', ...slug], `${slug[1]}年の${categoryName}`);

    return {
      title: `${slug[1]}年の${categoryName} | ${SITE_NAME}`,
      description: `${slug[1]}年の${categoryName}記事一覧です。`,
      openGraph: {
        title: `${slug[1]}年の${categoryName}`,
        description: `${slug[1]}年の${categoryName}記事一覧です。`,
        type: 'website',
        url: `https://${DOMAIN_NAME}/articles/tech-blog/2025`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: {
        canonical: `https://${DOMAIN_NAME}/articles/tech-blog/2025`,
      },
    };
  }

  const post = getPostBySlug(filePath, slug.join('/'));

  if (!post) return notFound();

  const [category, year, fileName] = slug;
  const canonical = `https://${DOMAIN_NAME}/articles/${category}/${year}/${fileName}`;
  const ogImage = await generateOgpImage(['articles', ...slug], post.meta.title, categoryName);

  const description = '本文：' + (await post.content).replace(/<[^>]+>/g, '').slice(0, 69) + '…';

  return {
    title: `${post.meta.title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: post.meta.title,
      description,
      type: 'article',
      url: `https://${DOMAIN_NAME}/articles/${category}/${year}/${fileName}`,
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
