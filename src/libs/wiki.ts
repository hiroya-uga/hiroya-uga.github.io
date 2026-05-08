import '@/libs/marked';
import { getFootnotes, getTOC, markedParse } from '@/libs/marked-custom';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

export type WikiFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  redirectFrom?: string[];
};

const WIKI_DIR = path.join(process.cwd(), 'wiki');

const validateFrontmatter = (data: Record<string, unknown>, filePath: string): WikiFrontmatter => {
  const required = ['title', 'description', 'publishedAt'] as const;

  for (const key of required) {
    if (typeof data[key] !== 'string' || data[key] === '') {
      throw new Error(`Wiki frontmatter error: "${key}" is required but missing or empty in ${filePath}`);
    }
  }

  return data as WikiFrontmatter;
};

const walk = (dir: string, currentSlug: string[]): string[][] => {
  const slugs: string[][] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      slugs.push(...walk(path.join(dir, entry.name), [...currentSlug, entry.name]));
    } else if (entry.name.endsWith('.md')) {
      const base = entry.name.replace(/\.md$/, '');
      if (base === 'index') {
        if (0 < currentSlug.length) {
          slugs.push(currentSlug);
        }
      } else {
        slugs.push([...currentSlug, base]);
      }
    }
  }

  return slugs;
};

export const getAllWikiSlugs = (): string[][] => {
  if (fs.existsSync(WIKI_DIR) === false) {
    return [];
  }
  return walk(WIKI_DIR, []);
};

const resolveWikiFilePath = (slug: string[]): string | null => {
  const directPath = path.join(WIKI_DIR, ...slug) + '.md';
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  const indexPath = path.join(WIKI_DIR, ...slug, 'index.md');
  if (fs.existsSync(indexPath)) {
    return indexPath;
  }

  return null;
};

export const getWikiPost = (slug: string[]) => {
  const filePath = resolveWikiFilePath(slug);
  if (filePath === null) {
    return null;
  }

  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  const frontmatter = validateFrontmatter(data as Record<string, unknown>, filePath);

  const parsedContent = markedParse(filePath, content) as string;
  const toc = getTOC(filePath, false);
  const footnotes = getFootnotes(filePath);

  return {
    frontmatter,
    content: parsedContent,
    toc,
    footnotes,
  };
};

export type WikiEntry = {
  slug: string[];
  pathname: string;
  frontmatter: WikiFrontmatter;
};

export const getAllWikiEntries = (): WikiEntry[] => {
  const slugs = getAllWikiSlugs();

  return slugs.map((slug) => {
    const filePath = resolveWikiFilePath(slug);
    if (filePath === null) {
      throw new Error(`Wiki file not found for slug: ${slug.join('/')}`);
    }

    const file = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(file);
    const frontmatter = validateFrontmatter(data as Record<string, unknown>, filePath);

    return {
      slug,
      pathname: `/wiki/${slug.join('/')}`,
      frontmatter,
    };
  });
};
