import { marked } from 'marked';
import { beforeEach, describe, expect, test } from 'vitest';
import { customMarkdownSyntaxes, getFootnotes, getTOC, markedParse } from '../marked-custom';

beforeEach(() => {
  marked.use({ extensions: customMarkdownSyntaxes });
});

const FILE = 'test/article.md';

describe('marked-custom', () => {
  describe('customBlock', () => {
    test('note ブロックをレンダリングする', () => {
      const html = markedParse(FILE, ':::note\nこれは注釈です\n:::') as string;
      expect(html).toContain('class="custom-block"');
      expect(html).toContain('data-type="note"');
      expect(html).toContain('注釈');
      expect(html).toContain('これは注釈です');
    });

    test('warn ブロックをレンダリングする', () => {
      const html = markedParse(FILE, ':::warn\n気をつけて\n:::') as string;
      expect(html).toContain('data-type="warn"');
      expect(html).toContain('注意点');
    });
  });

  describe('image', () => {
    test('サイズなし画像は通常の <img> を返す', () => {
      const html = markedParse(FILE, '![alt](https://example.com/img.png)') as string;
      expect(html).toContain('<img');
      expect(html).toContain('alt="alt"');
    });

    test('?size=800x600 付き画像は <customされたimg要素ˆ-ˆ> を返す', () => {
      const html = markedParse(FILE, '![alt](https://example.com/img.png?size=800x600)') as string;
      expect(html).toContain('<customされたimg要素ˆ-ˆ');
      expect(html).toContain('width="400"');
      expect(html).toContain('height="300"');
    });

    test('?w=400&h=200 付き画像は幅・高さを半分にして返す', () => {
      const html = markedParse(FILE, '![alt](https://example.com/img.png?w=400&h=200)') as string;
      expect(html).toContain('width="200"');
      expect(html).toContain('height="100"');
    });
  });

  describe('breakSpan', () => {
    test('2スペース改行を <span class="block"> に変換する', () => {
      const html = markedParse(FILE, '前のテキスト  \n次のテキスト') as string;
      expect(html).toContain('<span class="block">次のテキスト</span>');
    });
  });

  describe('talking', () => {
    test('——で始まる行を <p class="talking"> に変換する', () => {
      const html = markedParse(FILE, '——セリフです') as string;
      expect(html).toContain('<p class="talking">');
      expect(html).toContain('<span>——</span>');
      expect(html).toContain('<span>セリフです</span>');
    });
  });

  describe('link (embed)', () => {
    test('youtu.be リンクを iframe に変換する', () => {
      const html = markedParse(FILE, '[動画](https://youtu.be/abc123)') as string;
      expect(html).toContain('<iframe');
      expect(html).toContain('youtube.com/embed/abc123');
    });

    test('codepen.io リンクを iframe に変換する', () => {
      const html = markedParse(FILE, '[pen](https://codepen.io/user/pen/XYZ)') as string;
      expect(html).toContain('<iframe');
      expect(html).toContain('codepen.io/hiroya_uga/embed/XYZ');
    });

    test('amzn.to リンクをアソシエイト表記に変換する', () => {
      const html = markedParse(FILE, '[本](https://amzn.to/xxxx)') as string;
      expect(html).toContain('class="associate"');
      expect(html).toContain('Amazonアソシエイト');
    });

    test('通常リンクはそのまま <a> タグになる', () => {
      const html = markedParse(FILE, '[example](https://example.com)') as string;
      expect(html).toContain('<a href="https://example.com">');
    });
  });

  describe('footnote', () => {
    test('脚注参照を <sup> に変換する', () => {
      const html = markedParse(FILE, 'テキスト[^1]\n\n[^1]: 脚注の内容') as string;
      expect(html).toContain('<sup');
      expect(html).toContain('href="#note-1"');
    });

    test('getFootnotes が脚注定義を返す', () => {
      markedParse(FILE, 'テキスト[^abc]\n\n[^abc]: 脚注テキスト');
      const notes = getFootnotes(FILE);
      expect(notes).toHaveLength(1);
      expect(notes[0][0]).toBe('abc');
    });
  });

  describe('codeBlock', () => {
    test('言語とタイトル付きコードブロックをレンダリングする', () => {
      const html = markedParse(FILE, '```ts:サンプル\nconst x = 1;\n```') as string;
      expect(html).toContain('class="codeblock"');
      expect(html).toContain('サンプル');
      expect(html).toContain('data-language=ts');
    });

    test('japanize ブロックは翻訳段落になる', () => {
      const html = markedParse(FILE, '```japanize\nHello World\n```') as string;
      expect(html).toContain('日本語訳');
      expect(html).toContain('Hello World');
    });

    test('diff ブロックで + 行が <ins> になる', () => {
      const html = markedParse(FILE, '```diff\n+ added\n- removed\n```') as string;
      expect(html).toContain('<ins>+ added</ins>');
      expect(html).toContain('<del>- removed</del>');
    });

    describe('codeBlock (platform)', () => {
      test('macOS向けのコードブロックに data-platform が付与される', () => {
        const html = markedParse(FILE, '```sh:macOS向け\necho hello\n```') as string;
        expect(html).toContain('data-platform="macOS"');
      });

      test('Windows向けのコードブロックに data-platform が付与される', () => {
        const html = markedParse(FILE, '```powershell:Windows向け\necho hello\n```') as string;
        expect(html).toContain('data-platform="Windows"');
      });

      test('platform タイトルから「向け」が除去される', () => {
        const html = markedParse(FILE, '```sh:macOS向け\necho hello\n```') as string;
        expect(html).not.toContain('macOS向け');
      });

      test('「向け：」のコロンありでも正しく処理される', () => {
        const html = markedParse(FILE, '```sh:macOS向け：補足\necho hello\n```') as string;
        expect(html).toContain('data-platform="macOS"');
        expect(html).toContain('補足');
        expect(html).not.toContain('macOS向け');
      });

      test('platform でないタイトルには data-platform が付与されない', () => {
        const html = markedParse(FILE, '```sh:サンプル\necho hello\n```') as string;
        expect(html).not.toContain('data-platform');
      });
    });
  });

  describe('blockquote', () => {
    test('通常の引用を <blockquote> にレンダリングする', () => {
      const html = markedParse(FILE, '> 引用テキスト') as string;
      expect(html).toContain('<blockquote');
      expect(html).toContain('引用テキスト');
    });

    test('出典：付きの引用を <figure> にレンダリングする', () => {
      const html = markedParse(FILE, '> 本文\n> 出典：出典名') as string;
      expect(html).toContain('<figure class="blockquote">');
      expect(html).toContain('<figcaption');
      expect(html).toContain('出典名');
    });
  });

  describe('heading & TOC', () => {
    test('見出しに id が付与される', () => {
      const html = markedParse(FILE, '## はじめに') as string;
      expect(html).toContain('id="heading-');
      expect(html).toContain('はじめに');
    });

    test('同一テキストの見出しが重複しないよう連番になる', () => {
      const html = markedParse(FILE, '## 同じ\n\n## 同じ') as string;
      expect(html).toContain('id="heading-');
    });

    test('getTOC が見出しリストの HTML を返す', () => {
      markedParse(FILE, '## セクション1\n\n## セクション2');
      const toc = getTOC(FILE, false);
      expect(toc).toContain('href="#heading-');
      expect(toc).toContain('セクション1');
      expect(toc).toContain('セクション2');
    });
  });

  describe('table', () => {
    const md = `
| 名前 | 年齢 |
| --- | --- |
| Alice | 30 |
| Bob | 25 |
`.trim();

    test('table-container でラップされる', () => {
      const html = markedParse(FILE, md) as string;
      expect(html).toContain('class="table-container');
      expect(html).toContain('<table>');
      expect(html).toContain('<th');
    });

    test('^ 始まりのセルが <th> になる', () => {
      const md2 = `
| A | B |
| --- | --- |
| ^見出し | 値 |
`.trim();
      const html = markedParse(FILE, md2) as string;
      expect(html).toContain('<th');
    });
  });

  describe('list: image-list', () => {
    test('画像2枚のリストは image-diff-viewer になる', () => {
      const html = markedParse(
        FILE,
        '- ![before](https://example.com/a.png)\n- ![after](https://example.com/b.png)',
      ) as string;
      expect(html).toContain('class="image-diff-viewer"');
      expect(html).toContain('<input type="range"');
      expect(html).toContain('alt="before"');
      expect(html).toContain('alt="after"');
    });

    test('画像1枚のリストは通常の ul になる', () => {
      const html = markedParse(FILE, '- ![a](https://example.com/a.png)') as string;
      expect(html).not.toContain('class="image-diff-viewer"');
      expect(html).toContain('<ul>');
    });

    test('画像3枚以上のリストは通常の ul になる', () => {
      const html = markedParse(
        FILE,
        '- ![a](https://example.com/a.png)\n- ![b](https://example.com/b.png)\n- ![c](https://example.com/c.png)',
      ) as string;
      expect(html).not.toContain('class="image-diff-viewer"');
      expect(html).toContain('<ul>');
    });

    test('テキスト混在のリストは通常の ul になる', () => {
      const html = markedParse(FILE, '- ![a](https://example.com/a.png)\n- テキスト') as string;
      expect(html).not.toContain('class="image-diff-viewer"');
      expect(html).toContain('<ul>');
    });
  });
});
