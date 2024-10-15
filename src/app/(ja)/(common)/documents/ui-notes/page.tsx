// app/articles/page.js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import Image from 'next/image';

import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';
import clsx from 'clsx';

export const metadata = getMetadata({
  title: 'UI Notes',
  description: 'Web上に登場するUIに関するメモ書き。',
});

export async function getArticles() {
  const articlesDir = path.join(process.cwd(), 'src', 'app', '(ja)', '(common)', 'documents', 'ui-notes', 'contents');
  const filenames = fs.readdirSync(articlesDir);

  const articles = filenames.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      id: filename.replace(/\.mdx$/, ''),
      title: '',
      publishedAt: '',
      keywords: [],
      ...data,
    };
  });

  return articles;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
      </PageTitle>

      <ul className="grid gap-2 md:grid-cols-3">
        {articles.map(({ id, title, publishedAt, keywords }) => {
          const shouldShowKeywords = keywords.length !== 0;

          return (
            <li key={id}>
              <Link
                href={`/documents/ui-notes/${id}`}
                className={clsx([
                  'group grid grid-cols-[100px_1fr] grid-rows-[1fr_auto] gap-x-4 no-underline text-inherit rounded-lg leading-normal transition-[grid-template-columns]',
                  'sm:grid-cols-[160px_1fr]',
                  'md:grid-cols-1 md:gap-2',
                  shouldShowKeywords ? 'md:grid-rows-[auto_auto_auto]' : 'md:grid-rows-[auto_auto]',
                ])}
              >
                <span
                  className={clsx([
                    'overflow-hidden block row-start-1 row-end-3 col-start-1 col-end-2',
                    'md:row-end-2',
                  ])}
                >
                  <Image
                    src={`/documents/ui-notes/ogimages/${id}.jpg`}
                    width={1200}
                    height={630}
                    alt=""
                    className="aspect-square md:aspect-video object-cover rounded-lg"
                  />
                </span>
                <span
                  className={clsx([
                    'row-start-1 row-end-2 col-start-2 col-end-3 block palt font-bold',
                    'md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3',
                  ])}
                >
                  <span className="text-sm block">{publishedAt}</span>
                  <span className="group-hover:underline">{title}</span>
                </span>
                {shouldShowKeywords && (
                  <span
                    className={clsx([
                      'block text-right text-xs',
                      'md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4',
                    ])}
                  >
                    {keywords.join(', ')}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
