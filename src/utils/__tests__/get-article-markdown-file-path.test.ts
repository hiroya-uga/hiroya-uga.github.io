import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { getArticleMarkdownFilePath } from '@/utils/get-article-markdown-file-path';

describe('getArticleMarkdownFilePath', () => {
  it('yearを指定しない場合はcategoryまでのパスを返す', () => {
    expect(getArticleMarkdownFilePath('blog')).toBe(path.join(process.cwd(), 'articles', 'blog'));
  });

  it('yearを指定した場合はその年までのパスを返す', () => {
    expect(getArticleMarkdownFilePath('tech-blog', '2026')).toBe(
      path.join(process.cwd(), 'articles', 'tech-blog', '2026'),
    );
  });
});
