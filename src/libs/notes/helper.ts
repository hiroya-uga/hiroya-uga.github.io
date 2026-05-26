import '@/libs/marked';
import { getFootnotes, getTOC, markedParse } from '@/libs/marked-custom';
import matter from 'gray-matter';
import fs from 'node:fs';
import { enrichFrontmatter, resolveNotesFilePath, validateFrontmatter } from './generator';

export const getNotesPost = (slug: string[]) => {
  const filePath = resolveNotesFilePath(slug);
  if (filePath === null) {
    return null;
  }

  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  const frontmatter = enrichFrontmatter(validateFrontmatter(data as Record<string, unknown>, filePath), filePath);

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
