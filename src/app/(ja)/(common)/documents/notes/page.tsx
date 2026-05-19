// app/articles/page.js

import { Picture } from '@/components/ui/features/Picture';
import clsx from 'clsx';
import Link from 'next/link';

import { getArticles } from '@/app/(ja)/(common)/documents/notes/utils';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/documents/notes');

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
      </PageTitle>

      <ul className="w768:grid-cols-3 grid gap-2">
        {articles.map(({ id, title, publishedAt, keywords }) => {
          const shouldShowKeywords = keywords.length !== 0;

          return (
            <li key={id}>
              <Link
                href={`/documents/notes/${id}`}
                className={clsx([
                  'group grid grid-cols-[100px_1fr] grid-rows-[1fr_auto] gap-x-4 rounded-lg leading-normal text-inherit no-underline transition-[grid-template-columns]',
                  'w640:grid-cols-[160px_1fr]',
                  'w768:gap-2 w768:grid-cols-1',
                  shouldShowKeywords ? 'w768:grid-rows-[auto_auto_auto]' : 'w768:grid-rows-[auto_auto]',
                ])}
              >
                <span
                  className={clsx([
                    'col-start-1 col-end-2 row-start-1 row-end-3 block overflow-hidden',
                    'w768:row-end-2',
                  ])}
                >
                  <Picture
                    src={`/documents/notes/ogimages/${id}.jpg`}
                    width={1200}
                    height={630}
                    alt=""
                    className="w768:aspect-video aspect-square rounded-lg object-cover"
                  />
                </span>
                <span
                  className={clsx([
                    'palt col-start-2 col-end-3 row-start-1 row-end-2 block font-bold',
                    'w768:col-end-2 w768:row-start-2 w768:row-end-3 w768:col-start-1',
                  ])}
                >
                  <span className="block text-sm">{publishedAt}</span>
                  <span className="group-hover:underline">{title}</span>
                </span>
                {shouldShowKeywords && (
                  <span
                    className={clsx([
                      'block text-right text-xs',
                      'w768:col-end-2 w768:row-start-3 w768:row-end-4 w768:col-start-1',
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
