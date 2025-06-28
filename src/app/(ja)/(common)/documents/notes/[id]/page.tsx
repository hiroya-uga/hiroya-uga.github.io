import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { marked } from 'marked';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Metadata } from 'next/types';
import remarkGfm from 'remark-gfm';

import { getArticles } from '@/app/(ja)/(common)/documents/notes/utils';
import { ExampleBox } from '@/components/Box';
import { JsonLd } from '@/components/Meta';
import { SpecBlockQuote } from '@/components/SpecBlockQuote';
import { MainVisual } from '@/components/specific/documents/notes/MainVisual';
import { TocForArticle } from '@/components/specific/documents/notes/TocForArticle';
import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postsDirectory = path.join(process.cwd(), 'src', 'app', '(ja)', '(common)', 'documents', 'notes', 'contents');

  const filePath = path.join(postsDirectory, `${id}.mdx`);
  const fileContents = (() => {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch {
      return null;
    }
  })();
  const components = getMDXComponents({
    SpecBlockQuote: ({ children, ...props }) => {
      return (
        <div className="my-6">
          <SpecBlockQuote {...props}>{children}</SpecBlockQuote>
        </div>
      );
    },
    ExampleBox: ({ children, className }) => {
      return (
        <div className={className ?? 'my-10'}>
          <ExampleBox>{children}</ExampleBox>
        </div>
      );
    },
    th: ({ children }) => {
      return <th scope="col">{children}</th>;
    },
    td: ({ children }) => {
      const string = children?.toString();

      if (string?.startsWith('^')) {
        return <th scope="row">{string.slice(1)}</th>;
      }

      return <td>{children}</td>;
    },
    li: ({ children }) => {
      return (
        <li className="before:top-13px relative pl-4 before:absolute before:left-1 before:size-1 before:rounded-full before:bg-black">
          {children}
        </li>
      );
    },
  });

  if (!fileContents) {
    return (
      <div>
        <h1 className="mb-4">記事が見つかりませんでした</h1>
        <p className="mb-10">削除されたか、移動した可能性があります。</p>
        <p className="text-4xl">🙇‍♂️</p>
      </div>
    );
  }

  const { content, frontmatter } = await compileMDX<{
    title: string;
    description?: string;
    publishedAt: string;
    updatedAt?: string;
    keywords?: string[];
    dependencies?: string[];
  }>({
    source: fileContents,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  const { title, description, publishedAt, updatedAt, keywords, dependencies } = frontmatter;

  return (
    <div>
      <JsonLd {...frontmatter} pathname={`/documents/notes/${id}`} />

      <h1 className="palt mb-4 text-3xl font-bold leading-relaxed">{title}</h1>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-x-4 text-sm">
        <p className="flex flex-wrap gap-4">
          <span>公開日：{publishedAt}</span>
          {updatedAt && publishedAt !== updatedAt && <span>最終更新：{updatedAt}</span>}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {keywords?.length === 0 ? (
            <></>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <p className="leading-none">キーワード：</p>
              <ul className="flex flex-wrap items-center gap-2">
                {keywords?.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded border border-solid border-gray-300 bg-white p-2 leading-none text-[#333] dark:bg-[#ccc]"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {dependencies?.length === 0 ? (
            <></>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <p className="leading-none">採用技術：</p>
              <ul className="flex flex-wrap items-center gap-2">
                {dependencies?.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded border border-solid border-gray-300 bg-white p-2 leading-none text-[#333] dark:bg-[#ccc]"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mb-7 bg-slate-300">
        <MainVisual />
      </div>

      {description && (
        <div
          dangerouslySetInnerHTML={{
            __html: marked(description),
          }}
        />
      )}

      <div className="mt-7 md:mt-20 md:grid md:grid-cols-[minmax(0,1fr)_minmax(30%,260px)] md:gap-8">
        <div className="mb-20 md:col-start-2 md:col-end-3 md:row-[1/2] md:mb-0">
          <TocForArticle />
        </div>
        <div id="article" className="md:col-start-1 md:col-end-2 md:row-[1/2]">
          {content}
        </div>
      </div>
    </div>
  );
}

export const generateStaticParams = async () => {
  const articles = await getArticles();

  return articles.map((post) => ({
    id: post.id,
  }));
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const postsDirectory = path.join(process.cwd(), 'src', 'app', '(ja)', '(common)', 'documents', 'notes', 'contents');
  const filePath = path.join(postsDirectory, `${id}.mdx`);

  const fileContents = (() => {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch {
      return null;
    }
  })();

  if (!fileContents) {
    return { title: '' };
  }

  const { data } = matter(fileContents);
  const title = `${data.title} | ${SITE_NAME}`;
  const description = data.description?.replaceAll('`', '') ?? '';

  return {
    title,
    description,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${URL_ORIGIN}/documents/notes/${id}`,
    },
    openGraph: {
      images: [
        {
          url: `/documents/notes/ogimages/${id}.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
