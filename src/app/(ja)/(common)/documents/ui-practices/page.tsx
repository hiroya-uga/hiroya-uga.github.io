// app/articles/page.js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import Image from 'next/image';
import { Metadata } from '@/types/seo';
import { PageTitle } from '@/components/structures/PageTitle';

export const metadata: Metadata = {
  title: 'UI Practices',
  description: 'Web上に登場するUIに関して考察してみたメモ書き。',
  twitter: {
    card: 'summary_large_image',
    title: 'UI Practices',
    description: 'Web上に登場するUIに関して考察してみたメモ書き。',
  },
};

export async function getArticles() {
  const articlesDir = path.join(
    process.cwd(),
    'src',
    'app',
    '(ja)',
    '(common)',
    'documents',
    'ui-practices',
    'contents',
  );
  const filenames = fs.readdirSync(articlesDir);

  const articles = filenames.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      id: filename.replace(/\.mdx$/, ''),
      title: '',
      publishedAt: '',
      dev: [],
      ...data,
    };
  });

  return articles;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <PageTitle title={metadata.title}>
        <p>{metadata.description}</p>
      </PageTitle>

      <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {articles.map(({ id, title, publishedAt, dev }) => (
          <li key={id} className="flex">
            <Link
              href={`/documents/ui-practices/${id}`}
              className="group relative grid grid-rows-[auto_1fr] overflow-hidden rounded border border-solid border-gray-600 leading-normal no-underline"
            >
              <Image
                src={`/documents/ui-practices/ogimages/${id}.jpg`}
                width={1200}
                height={630}
                alt=""
                className="aspect-video object-cover"
              />
              <span className="absolute right-0 top-0 block rounded-bl bg-black/70 px-2 text-right text-sm text-white">
                {publishedAt}
              </span>
              <span className="relative block bg-white px-3 pb-6 pt-4">
                <span className="group-hover:underline">{title}</span>
              </span>
              <span className="block bg-white px-3 pb-2">
                {dev.length !== 0 && <span className="block text-right text-xs">{dev.join(', ')}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
