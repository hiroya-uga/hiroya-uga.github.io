import { describe, expect, it } from 'vitest';

import { resolveArticleImagePath, resolveCategoryDescription, resolveCategoryName } from '@/utils/articles';

describe('resolveArticleImagePath', () => {
  it('相対パスをarticles配下の絶対パスに変換する', () => {
    expect(resolveArticleImagePath({ imagePath: './cover.png', category: 'tech-blog', year: '2026' })).toBe(
      '/articles/tech-blog/2026/cover.png',
    );
  });

  it('相対パスでない場合はそのまま返す', () => {
    expect(resolveArticleImagePath({ imagePath: '/static/cover.png', category: 'tech-blog', year: '2026' })).toBe(
      '/static/cover.png',
    );
  });
});

describe('resolveCategoryName', () => {
  it('https://始まりはEXTERNALを返す', () => {
    expect(resolveCategoryName('https://example.com')).toBe('EXTERNAL');
  });

  it('/articles/tech-blog/... の形式はマッピングされたラベルを返す', () => {
    expect(resolveCategoryName('/articles/tech-blog/2026/foo')).toBe('Tech Blog');
  });

  it('categoryキーそのものが渡された場合もマッピングされたラベルを返す', () => {
    expect(resolveCategoryName('blog')).toBe('Blog');
  });

  it('マッピングにないキーワードはUNKNOWNを返す', () => {
    expect(resolveCategoryName('/articles/unknown-category/2026/foo')).toBe('UNKNOWN');
  });
});

describe('resolveCategoryDescription', () => {
  it('https://始まりは外部サイト向けの説明を返す', () => {
    expect(resolveCategoryDescription('https://example.com')).toBe('外部サイトに移動します。');
  });

  it('/articles/tech-blog/... の形式はマッピングされた説明を返す', () => {
    expect(resolveCategoryDescription('/articles/tech-blog/2026/foo')).toBe('Web開発に関するブログ記事です。');
  });

  it('マッピングにないキーワードはNO DESCRIPTIONを返す', () => {
    expect(resolveCategoryDescription('/articles/unknown-category/2026/foo')).toBe('NO DESCRIPTION');
  });
});
