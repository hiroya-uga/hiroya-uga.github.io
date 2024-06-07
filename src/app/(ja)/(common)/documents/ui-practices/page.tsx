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

async function getArticles() {
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

      <ul>
        {articles.map(({ id, title, publishedAt, dev }) => (
          <li key={id} className="sm:w-1/3">
            <Link
              href={`/documents/ui-practices/${id}`}
              className="block overflow-hidden rounded border border-solid border-gray-600 no-underline"
            >
              <Image src={`/documents/ui-practices/ogimages/${id}.jpg`} width={1200} height={630} alt="" />
              <span className="relative block bg-white px-3 pb-3 pt-2 leading-normal">
                <span className="block pb-1 text-right text-gray-500">{publishedAt}</span>
                <span>{title}</span>
                {dev.length !== 0 && <span className="mt-2 block text-right text-xs">{dev.join(', ')}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
