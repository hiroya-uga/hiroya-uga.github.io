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
  const headingBlockPattern = /<div class="heading-wrapper">[\s\S]*?<\/div>/g;
  let result = '';
  let lastIndex = 0;
  const openLevels: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingBlockPattern.exec(html)) !== null) {
    const headingBlock = match[0];
    const levelMatch = /<h([1-6])\b/.exec(headingBlock);
    if (!levelMatch) continue;

    const level = Number.parseInt(levelMatch[1], 10);
    const blockStart = match.index;
    const blockEnd = blockStart + headingBlock.length;

    result += html.slice(lastIndex, blockStart);

    while (openLevels.length > 0 && openLevels[openLevels.length - 1] >= level) {
      result += '\n</section>';
      openLevels.pop();
    }

    result += '<section>\n';
    result += headingBlock;
    openLevels.push(level);
    lastIndex = blockEnd;
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
