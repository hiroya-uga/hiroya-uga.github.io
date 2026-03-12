import { describe, expect, it } from 'vitest';

import { parseMarkdownForSlack } from '../Client/parts/PreviewAndResult/utils/parse-markdown-for-slack';

describe('parseMarkdownForSlack', () => {
  it('すべての記法を含む入力が一度に変換される', () => {
    const input = [
      '**太字** と _イタリック_ と ~~取り消し線~~',
      '',
      '`インラインコード`',
      '',
      '> ブロック引用テキスト',
      '',
      '```',
      'コードブロック',
      '```',
      '',
      '- リストアイテム1',
      '- リストアイテム2',
      '',
      '[リンク](https://example.com)',
    ].join('\n');

    const result = parseMarkdownForSlack(input);

    expect(result).toContain('<strong>太字</strong>');
    expect(result).toContain('<em>イタリック</em>');
    expect(result).toContain('<s>取り消し線</s>');
    expect(result).toContain('<code>インラインコード</code>');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('<pre>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<a href="https://example.com">リンク</a>');
  });
});

describe('HTML はエスケープされる', () => {
  it('<script> タグが挿入されない', () => {
    const result = parseMarkdownForSlack('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });
});
