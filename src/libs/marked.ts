import '@/libs/marked-custom';
import { customMarkdownSyntaxes, getFootnotes, getTOC, markedParse } from '@/libs/marked-custom';
import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';

export function getAllNoteIds(fullPath: string) {
  return fs.readdirSync(fullPath).map((filename) => filename.replace(/\.md$/, ''));
}

marked.use({ extensions: customMarkdownSyntaxes });

export function getPostBySlug(filePath: string, slug: string) {
  const fullPath = path.join(filePath, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const file = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(file);
  // 先にcontentをmarkedParseしなければならない
  const parsedContent = markedParse(fullPath, content);

  const footnotes = getFootnotes(fullPath);
  const toc = getTOC(fullPath, footnotes.length !== 0);

  return {
    meta: data,
    toc,
    content: parsedContent,
    footnotes,
  };
}
