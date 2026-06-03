import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { compareNotesEntries } from '../compare';
import {
  enrichFrontmatter,
  NOTES_DIR,
  parseGitLogUpdatedAt,
  resetGitUpdatedAtCacheForTest,
  validateFrontmatter,
  type NotesEntry,
  type NotesFrontmatter,
} from '../generator';

const baseFrontmatter: NotesFrontmatter = {
  title: 'タイトル',
  description: '説明',
  publishedAt: '2026-01-01T00:00:00+09:00',
};

afterEach(() => {
  resetGitUpdatedAtCacheForTest();
});

describe('parseGitLogUpdatedAt', () => {
  test('各ファイルに最新コミット時刻を割り当てる', () => {
    const stdout = [
      'COMMIT 2026-05-25T22:38:22+09:00',
      '',
      'tips/index.md',
      'tips/macos/index.md',
      '',
      'COMMIT 2026-05-06T16:33:29+09:00',
      '',
      'index.md',
      'tips/index.md',
      '',
    ].join('\n');

    const map = parseGitLogUpdatedAt(stdout);

    expect(map.get('tips/index.md')).toBe('2026-05-25T22:38:22+09:00');
    expect(map.get('tips/macos/index.md')).toBe('2026-05-25T22:38:22+09:00');
    expect(map.get('index.md')).toBe('2026-05-06T16:33:29+09:00');
  });

  test('git log の出力順 (新→旧) を反映し、古い側で上書きしない', () => {
    const stdout = [
      'COMMIT 2026-05-25T22:38:22+09:00',
      'tips/index.md',
      'COMMIT 2026-04-01T00:00:00+09:00',
      'tips/index.md',
    ].join('\n');

    const map = parseGitLogUpdatedAt(stdout);

    expect(map.get('tips/index.md')).toBe('2026-05-25T22:38:22+09:00');
  });

  test('.md 以外の行は無視する', () => {
    const stdout = ['COMMIT 2026-05-25T22:38:22+09:00', 'tips/index.md', 'tips/image.png', 'scripts/run.sh'].join('\n');

    const map = parseGitLogUpdatedAt(stdout);

    expect(map.size).toBe(1);
    expect(map.get('tips/index.md')).toBe('2026-05-25T22:38:22+09:00');
  });

  test('空入力で空 Map を返す', () => {
    expect(parseGitLogUpdatedAt('')).toStrictEqual(new Map());
  });
});

describe('enrichFrontmatter', () => {
  test('既存の updatedAt を尊重する', () => {
    resetGitUpdatedAtCacheForTest(new Map([['tips/index.md', '2026-05-25T22:38:22+09:00']]));
    const fm: NotesFrontmatter = { ...baseFrontmatter, updatedAt: '2026-03-01T00:00:00+09:00' };

    const result = enrichFrontmatter(fm, path.join(NOTES_DIR, 'tips/index.md'));

    expect(result.updatedAt).toBe('2026-03-01T00:00:00+09:00');
  });

  test('updatedAt が未指定なら git log から補完する', () => {
    resetGitUpdatedAtCacheForTest(new Map([['tips/index.md', '2026-05-25T22:38:22+09:00']]));

    const result = enrichFrontmatter({ ...baseFrontmatter }, path.join(NOTES_DIR, 'tips/index.md'));

    expect(result).toStrictEqual({ ...baseFrontmatter, updatedAt: '2026-05-25T22:38:22+09:00' });
  });

  test('updatedAt が空文字なら git log で上書きする', () => {
    resetGitUpdatedAtCacheForTest(new Map([['tips/index.md', '2026-05-25T22:38:22+09:00']]));

    const result = enrichFrontmatter(
      { ...baseFrontmatter, updatedAt: '' },
      path.join(NOTES_DIR, 'tips/index.md'),
    );

    expect(result.updatedAt).toBe('2026-05-25T22:38:22+09:00');
  });

  test('git log にもなければ frontmatter をそのまま返す', () => {
    resetGitUpdatedAtCacheForTest(new Map());

    const result = enrichFrontmatter({ ...baseFrontmatter }, path.join(NOTES_DIR, 'tips/index.md'));

    expect(result).toStrictEqual(baseFrontmatter);
    expect(result.updatedAt).toBeUndefined();
  });
});

describe('validateFrontmatter', () => {
  const validData = {
    title: 'タイトル',
    description: '説明',
    publishedAt: '2026-01-01T00:00:00+09:00',
  };

  test('sortIndex が数値ならそのまま通す', () => {
    expect(() => validateFrontmatter({ ...validData, sortIndex: 1 }, 'foo.md')).not.toThrow();
    expect(() => validateFrontmatter({ ...validData, sortIndex: 0 }, 'foo.md')).not.toThrow();
    expect(() => validateFrontmatter({ ...validData, sortIndex: -10 }, 'foo.md')).not.toThrow();
  });

  test('sortIndex が文字列ならエラー', () => {
    expect(() => validateFrontmatter({ ...validData, sortIndex: '1' }, 'foo.md')).toThrow(/sortIndex/);
  });

  test('sortIndex が NaN や Infinity ならエラー', () => {
    expect(() => validateFrontmatter({ ...validData, sortIndex: NaN }, 'foo.md')).toThrow(/sortIndex/);
    expect(() => validateFrontmatter({ ...validData, sortIndex: Infinity }, 'foo.md')).toThrow(/sortIndex/);
  });
});

describe('compareNotesEntries', () => {
  const makeEntry = (slug: string, frontmatter: Partial<NotesFrontmatter> & { title: string }): NotesEntry => ({
    slug: [slug],
    pathname: `/notes/${slug}`,
    frontmatter: {
      description: '',
      publishedAt: '2026-01-01T00:00:00+09:00',
      ...frontmatter,
    },
  });

  test('両方に sortIndex があれば降順で比較する', () => {
    const a = makeEntry('a', { title: 'あ', sortIndex: 1 });
    const b = makeEntry('b', { title: 'い', sortIndex: 10 });

    expect([a, b].sort(compareNotesEntries).map((e) => e.slug[0])).toStrictEqual(['b', 'a']);
  });

  test('片方にしか sortIndex が無ければ、ある方が先', () => {
    const a = makeEntry('a', { title: 'あ' });
    const b = makeEntry('b', { title: 'い', sortIndex: 99 });

    expect([a, b].sort(compareNotesEntries).map((e) => e.slug[0])).toStrictEqual(['b', 'a']);
  });

  test('両方に sortIndex が無ければ title でロケール比較する', () => {
    const a = makeEntry('a', { title: 'りんご' });
    const b = makeEntry('b', { title: 'あんず' });

    expect([a, b].sort(compareNotesEntries).map((e) => e.slug[0])).toStrictEqual(['b', 'a']);
  });

  test('sortIndex: -1 は常に最下段に来る（数値指定より下）', () => {
    const a = makeEntry('a', { title: 'あ', sortIndex: -1 });
    const b = makeEntry('b', { title: 'い', sortIndex: 5 });

    expect([a, b].sort(compareNotesEntries).map((e) => e.slug[0])).toStrictEqual(['b', 'a']);
  });

  test('sortIndex: -1 は未指定よりも下', () => {
    const a = makeEntry('a', { title: 'あ', sortIndex: -1 });
    const b = makeEntry('b', { title: 'い' });

    expect([a, b].sort(compareNotesEntries).map((e) => e.slug[0])).toStrictEqual(['b', 'a']);
  });

  test('両方 sortIndex: -1 なら title でロケール比較する', () => {
    const a = makeEntry('a', { title: 'りんご', sortIndex: -1 });
    const b = makeEntry('b', { title: 'あんず', sortIndex: -1 });

    expect([a, b].sort(compareNotesEntries).map((e) => e.slug[0])).toStrictEqual(['b', 'a']);
  });
});
