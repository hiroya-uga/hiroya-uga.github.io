import { execFileSync } from 'node:child_process';
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

export const parseGitLogUpdatedAt = (stdout: string): Map<string, string> => {
  const map = new Map<string, string>();
  let currentTime: string | null = null;

  for (const rawLine of stdout.split('\n')) {
    const line = rawLine.trim();
    if (line === '') continue;
    if (line.startsWith('COMMIT ')) {
      currentTime = line.slice('COMMIT '.length);
      continue;
    }
    if (currentTime !== null && line.endsWith('.md') && map.has(line) === false) {
      map.set(line, currentTime);
    }
  }

  return map;
};

let gitUpdatedAtCache: Map<string, string> | null = null;

const loadGitUpdatedAtMap = (): Map<string, string> => {
  if (fs.existsSync(NOTES_DIR) === false) {
    return new Map();
  }

  try {
    const stdout = execFileSync(
      'git',
      ['-C', NOTES_DIR, 'log', '--name-only', '--format=COMMIT %aI', '--', '*.md'],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
    return parseGitLogUpdatedAt(stdout);
  } catch {
    // git が無い / submodule が初期化されていない等のケースでは諦める
    return new Map();
  }
};

export const resetGitUpdatedAtCacheForTest = (next?: Map<string, string>): void => {
  gitUpdatedAtCache = next ?? null;
};

export const enrichFrontmatter = (frontmatter: NotesFrontmatter, filePath: string): NotesFrontmatter => {
  if (typeof frontmatter.updatedAt === 'string' && frontmatter.updatedAt !== '') {
    return frontmatter;
  }
  if (gitUpdatedAtCache === null) {
    gitUpdatedAtCache = loadGitUpdatedAtMap();
  }
  const relFromNotes = path.relative(NOTES_DIR, filePath);
  const derived = gitUpdatedAtCache.get(relFromNotes);
  if (derived === undefined) {
    return frontmatter;
  }
  return { ...frontmatter, updatedAt: derived };
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

const isPreviewSlug = (slug: string[]) => slug[slug.length - 1] === 'preview';

export const getAllNotesSlugs = (): string[][] => {
  if (fs.existsSync(NOTES_DIR) === false) {
    return [];
  }
  const slugs = walk(NOTES_DIR, []);
  if (process.env.NODE_ENV === 'production') {
    return slugs.filter((slug) => isPreviewSlug(slug) === false);
  }
  return slugs;
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

const isIndexBackedPage = (slug: string[]): boolean => {
  const filePath = resolveNotesFilePath(slug);
  if (filePath === null) {
    return false;
  }
  return path.basename(filePath) === 'index.md';
};

export const getNotesChildEntries = (parentSlug: string[]): NotesEntry[] => {
  if (isIndexBackedPage(parentSlug) === false) {
    return [];
  }

  const entries = getAllNotesEntries();

  return entries
    .filter((entry) => entry.slug.length === parentSlug.length + 1 && parentSlug.every((s, i) => s === entry.slug[i]))
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, 'ja'));
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
    const frontmatter = enrichFrontmatter(validateFrontmatter(data as Record<string, unknown>, filePath), filePath);

    return {
      slug,
      pathname: `/notes/${slug.join('/')}`,
      frontmatter,
    };
  });
};
