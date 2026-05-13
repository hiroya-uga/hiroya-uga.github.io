import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

export type NotesFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  redirectFrom?: string[];
};

export type NotesEntry = {
  slug: string[];
  pathname: string;
  frontmatter: NotesFrontmatter;
};

export const NOTES_DIR = path.join(process.cwd(), 'notes');

export const validateFrontmatter = (data: Record<string, unknown>, filePath: string): NotesFrontmatter => {
  const required = ['title', 'description', 'publishedAt'] as const;

  for (const key of required) {
    if (typeof data[key] !== 'string' || data[key] === '') {
      throw new Error(`Notes frontmatter error: "${key}" is required but missing or empty in ${filePath}`);
    }
  }

  return data as NotesFrontmatter;
};

export const resolveNotesFilePath = (slug: string[]): string | null => {
  const directPath = path.join(NOTES_DIR, ...slug) + '.md';
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  const indexPath = path.join(NOTES_DIR, ...slug, 'index.md');
  if (fs.existsSync(indexPath)) {
    return indexPath;
  }

  return null;
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

export const getAllNotesSlugs = (): string[][] => {
  if (fs.existsSync(NOTES_DIR) === false) {
    return [];
  }
  return walk(NOTES_DIR, []);
};

/** ./foo.mp4 や ./images/foo.png → /notes/{slugDir}/foo.mp4 などに解決する */
export const resolveNotesMediaPath = ({ imagePath, filePath }: { imagePath: string; filePath: string }): string => {
  if (imagePath.startsWith('./') === false) {
    return imagePath;
  }

  const notesMatch = /\/notes\/(.+)\.md$/.exec(filePath);
  if (notesMatch === null) {
    return imagePath;
  }

  const notesRelPath = notesMatch[1];
  const dir = path.dirname(notesRelPath);
  const dirPrefix = dir === '.' ? '' : `/${dir}`;
  return imagePath.replace('./', `/notes${dirPrefix}/`);
};

export const getAllNotesEntries = (): NotesEntry[] => {
  const slugs = getAllNotesSlugs();

  return slugs.map((slug) => {
    const filePath = resolveNotesFilePath(slug);
    if (filePath === null) {
      throw new Error(`Notes file not found for slug: ${slug.join('/')}`);
    }

    const file = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(file);
    const frontmatter = validateFrontmatter(data as Record<string, unknown>, filePath);

    return {
      slug,
      pathname: `/notes/${slug.join('/')}`,
      frontmatter,
    };
  });
};
