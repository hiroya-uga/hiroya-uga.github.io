import { describe, expect, it } from 'vitest';

import { formatHexString, formatUrl } from '@/utils/formatter';

describe('formatHexString', () => {
  it('6桁の16進数を小文字のhexカラー文字列に整形する', () => {
    expect(formatHexString('A1B2C3')).toBe('#a1b2c3');
    expect(formatHexString('#A1B2C3')).toBe('#a1b2c3');
  });

  it('3桁の16進数を6桁に展開する', () => {
    expect(formatHexString('AbC')).toBe('#aabbcc');
    expect(formatHexString('#AbC')).toBe('#aabbcc');
  });

  it('前後の空白を除去して整形する', () => {
    expect(formatHexString('  #ABCDEF  ')).toBe('#abcdef');
  });

  it('hexカラーとして不正な入力はnullを返す', () => {
    expect(formatHexString('')).toBeNull();
    expect(formatHexString('ab')).toBeNull();
    expect(formatHexString('abcd')).toBeNull();
    expect(formatHexString('xyzxyz')).toBeNull();
  });
});

describe('formatUrl', () => {
  it('queryとhashを指定しない場合はpathnameのみ返す', () => {
    expect(formatUrl({ pathname: '/about' })).toBe('/about');
  });

  it('文字列のqueryを指定した場合は?区切りで結合する', () => {
    expect(formatUrl({ pathname: '/about', query: 'card=open' })).toBe('/about?card=open');
  });

  it('空文字列のqueryを指定した場合は?を付けない', () => {
    expect(formatUrl({ pathname: '/about', query: '' })).toBe('/about');
  });

  it('URLSearchParamsのqueryを指定した場合はtoStringした結果を結合する', () => {
    const query = new URLSearchParams({ card: 'open' });
    expect(formatUrl({ pathname: '/about', query })).toBe('/about?card=open');
  });

  it('空のURLSearchParamsを指定した場合は?を付けない', () => {
    const query = new URLSearchParams();
    expect(formatUrl({ pathname: '/about', query })).toBe('/about');
  });

  it('hashを指定した場合は#区切りで末尾に結合する', () => {
    expect(formatUrl({ pathname: '/about', hash: 'section1' })).toBe('/about#section1');
  });

  it('空文字列のhashを指定した場合は#を付けない', () => {
    expect(formatUrl({ pathname: '/about', hash: '' })).toBe('/about');
  });

  it('queryとhashを両方指定した場合は?クエリ#ハッシュの順で結合する', () => {
    expect(formatUrl({ pathname: '/about', query: 'card=open', hash: 'section1' })).toBe('/about?card=open#section1');
  });
});
