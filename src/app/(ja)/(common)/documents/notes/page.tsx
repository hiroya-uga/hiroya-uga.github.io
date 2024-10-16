// app/articles/page.js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import Image from 'next/image';

import clsx from 'clsx';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/notes');

export async function getArticles() {
  const articlesDir = path.join(process.cwd(), 'src', 'app', '(ja)', '(common)', 'documents', 'notes', 'contents');
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
                href={`/documents/notes/${id}`}
                className={clsx([
                  'group grid grid-cols-[100px_1fr] grid-rows-[1fr_auto] gap-x-4 rounded-lg leading-normal text-inherit no-underline transition-[grid-template-columns]',
                  'sm:grid-cols-[160px_1fr]',
                  'md:grid-cols-1 md:gap-2',
                  shouldShowKeywords ? 'md:grid-rows-[auto_auto_auto]' : 'md:grid-rows-[auto_auto]',
                ])}
              >
                <span
                  className={clsx([
                    'col-start-1 col-end-2 row-start-1 row-end-3 block overflow-hidden',
                    'md:row-end-2',
                  ])}
                >
                  <Image
                    src={`/documents/notes/ogimages/${id}.jpg`}
                    width={1200}
                    height={630}
                    alt=""
                    className="aspect-square rounded-lg object-cover md:aspect-video"
                  />
                </span>
                <span
                  className={clsx([
                    'palt col-start-2 col-end-3 row-start-1 row-end-2 block font-bold',
                    'md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3',
                  ])}
                >
                  <span className="block text-sm">{publishedAt}</span>
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
