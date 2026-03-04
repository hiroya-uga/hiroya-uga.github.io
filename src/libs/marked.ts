import '@/libs/marked-custom';
import { customMarkdownSyntaxes, getFootnotes, getTOC, markedParse } from '@/libs/marked-custom';
import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';

export function getAllNoteIds(fullPath: string) {
  return fs
    .readdirSync(fullPath)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => filename.replace(/\.md$/, ''));
}

marked.use({ extensions: customMarkdownSyntaxes });

function wrapHeadingsWithSections(html: string): string {
  const headingPattern = /<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/g;
  let result = '';
  let lastIndex = 0;
  const openLevels: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(html)) !== null) {
    const heading = match[0];
    const level = Number.parseInt(match[1], 10);
    const headingStart = match.index;
    const headingEnd = headingStart + heading.length;

    result += html.slice(lastIndex, headingStart);

    while (openLevels.length > 0 && openLevels[openLevels.length - 1] >= level) {
      result += '\n</section>';
      openLevels.pop();
    }

    result += '<section>\n';
    result += heading;
    openLevels.push(level);
    lastIndex = headingEnd;
  }

  result += html.slice(lastIndex);

  while (openLevels.length > 0) {
    result += '\n</section>';
    openLevels.pop();
  }

  return result;
}

export function getPostBySlug(filePath: string, slug: string) {
  const fullPath = path.join(filePath, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const file = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(file);
  // 先にcontentをmarkedParseしなければならない
  let parsedContent = markedParse(fullPath, content) as string;

  // 見出しを<section>で囲む
  parsedContent = wrapHeadingsWithSections(parsedContent);

  const footnotes = getFootnotes(fullPath);
  const toc = getTOC(fullPath, footnotes.length !== 0);

  return {
    meta: data,
    toc,
    content: parsedContent,
    footnotes,
  };
}
