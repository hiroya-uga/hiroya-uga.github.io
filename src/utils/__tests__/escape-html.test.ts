import { describe, expect, it } from 'vitest';

import { escapeHtml } from '@/utils/escape-html';

describe('escapeHtml', () => {
  it('& < > " \' を文字参照に変換する', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('& を先に二重変換しない', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });

  it('対象外の文字はそのまま返す', () => {
    expect(escapeHtml('404 Not Found / 未検出')).toBe('404 Not Found / 未検出');
  });

  it('空文字は空文字を返す', () => {
    expect(escapeHtml('')).toBe('');
  });
});
