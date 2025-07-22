import { URL_ORIGIN } from '@/constants/meta';
import { marked, TokenizerAndRendererExtension, type Token } from 'marked';

let currentFilePath = '';

type CustomBlockToken = Token & {
  type: 'customBlock';
  raw: string;
  text: string;
  blockType: string;
};
const customBlockTitle: Record<string, string> = {
  note: '注釈',
  alert: '警告',
  warn: '注意点',
  tip: 'ヒント',
  info: '情報',
};
const customBlockExtension: TokenizerAndRendererExtension = {
  name: 'customBlock',
  level: 'block',
  start(src) {
    return src.match(/^:::/)?.index;
  },
  tokenizer(src) {
    const rule = /^:::([\w-]+)\n([\s\S]+?)\n:::/;
    const match = rule.exec(src);
    if (!match) return;

    const [, blockType, content] = match;

    const token: CustomBlockToken = {
      type: 'customBlock',
      raw: match[0],
      text: content,
      blockType,
    };

    return token;
  },
  renderer(token) {
    const t = token as CustomBlockToken;
    const html = marked.parse(t.text);
    return `<section class="custom-block" data-type="${t.blockType}" aria-label="${customBlockTitle[t.blockType]}">
      <p class="custom-block__title mb-paragraph" aria-hidden="true">${customBlockTitle[t.blockType]}</p>
      <div class="custom-block__content space-y-paragraph">${html}</div>
    </section>`;
  },
};

type CustomImageToken = Token & {
  type: 'image';
  raw: string;
  href: string;
  text: string;
  title?: string | null;
};

const overrideImageExtension: TokenizerAndRendererExtension = {
  name: 'image',
  level: 'inline',

  renderer(token) {
    const t = token as CustomImageToken;
    const url = t.href ? URL.parse(t.href, URL_ORIGIN) : null;
    const src = url?.pathname;
    const query = url?.search ? new URLSearchParams(url.search) : null;
    const width = query?.get('w');
    const height = query?.get('h');

    if (width && height) {
      return `<lazy-image src="${src}" alt="${t.text}" width="${width}" height="${height}" loading><span style="aspect-ratio: ${width} / ${height}; display: block;" aria-hidden="true"></span></lazy-image>`;
    }

    return `<img src="${src}" alt="${t.text}" loading="lazy" />`;

    // const titleAttr = t.title ? ` title="${t.title}"` : '';
    // return `<img src="${src}" alt="${t.text}"${titleAttr} />`;
  },
};

/** brを避けたいので、2スペース改行 + テキスト を 1 トークンとして扱う */
type BreakSpanToken = Token & {
  type: 'breakSpan';
  raw: string;
  text: string;
};

const breakSpanExtension: TokenizerAndRendererExtension = {
  name: 'breakSpan',
  level: 'inline',

  start(src) {
    return src.indexOf('  \n');
  },

  tokenizer(src) {
    const rule = /^ {2}\n([^\n]+)/;
    const match = rule.exec(src);
    if (!match) return;

    const [, following] = match;
    const token: BreakSpanToken = {
      type: 'breakSpan',
      raw: match[0],
      text: following,
    };
    return token;
  },

  renderer(token) {
    const t = token as BreakSpanToken;
    const htmlInside = marked.parseInline(t.text);
    return `<span class="block">${htmlInside}</span>`;
  },
};

type CustomLinkToken = Token & {
  type: 'link';
  raw: string;
  href: string;
  text?: string;
  title?: string | null;
};

const amazonAssociateLinkExtension: TokenizerAndRendererExtension = {
  name: 'link',
  level: 'inline',

  renderer(token) {
    const t = token as CustomLinkToken;

    try {
      const url = new URL(t.href, URL_ORIGIN);

      if (url.hostname === 'amzn.to') {
        const notice = '※ 当サイトはAmazonアソシエイト・プログラムの参加者であり、適格販売により収入を得ています。';
        return `<span class="associate"><small>${notice}</small>\n<a href="${t.href}">Amazonリンク: ${t.text ?? t.href}</a><span>`;
      }
    } catch {
      // URL 解析失敗時はスルーして既定のレンダラーに流す
    }

    return false;
  },
};

type FootnoteRefToken = Token & {
  type: 'footnoteRef';
  raw: string;
  identifier: string;
};

type FootnoteDefToken = Token & {
  type: 'footnoteDef';
  raw: string;
  identifier: string;
  text: string;
};

const footnoteDefs = new Map<string, Record<string, string>>();

const footnoteRefExtension: TokenizerAndRendererExtension = {
  name: 'footnoteRef',
  level: 'inline',
  start(src) {
    return src.match(/\[\^[^\]]+\]/)?.index;
  },
  tokenizer(src) {
    const rule = /^\[\^([^\]]+)\]/;
    const match = rule.exec(src);
    if (!match) return;

    const [, identifier] = match;

    const token: FootnoteRefToken = {
      type: 'footnoteRef',
      raw: match[0],
      identifier,
    };

    return token;
  },
  renderer(token) {
    const t = token as FootnoteRefToken;
    return `<sup id="ref-${t.identifier}" class="font-mono inline-block"><a href="#note-${t.identifier}" aria-describedby="note-${t.identifier}">[${t.identifier}]</a></sup>`;
  },
};

const footnoteDefExtension: TokenizerAndRendererExtension = {
  name: 'footnoteDef',
  level: 'block',
  start(src) {
    return src.match(/^\[\^.+\]:/)?.index;
  },
  tokenizer(src) {
    const rule = /^\[\^([^\]]+)\]:\s+(.+?)(?:\n{2,}|\n*$)/;
    const match = rule.exec(src);
    if (!match) return;

    const [, identifier, text] = match;

    const footnotes = footnoteDefs.get(currentFilePath) ?? {};
    footnoteDefs.set(currentFilePath, { ...footnotes, [identifier]: text });

    const token: FootnoteDefToken = {
      type: 'footnoteDef',
      raw: match[0],
      identifier,
      text,
    };

    return token;
  },
  renderer() {
    // 脚注そのものは描画しない
    return '';
  },
};

export const getFootnotes = (filePath: string): [string, { html: string | Promise<string> }][] => {
  return Object.entries(footnoteDefs.get(filePath) ?? []).map(([id, text]) => {
    return [id, { html: marked.parseInline(text) }];
  });
};

type CodeToken = Token & {
  type: 'code';
  raw: string;
  text: string;
  lang?: string;
};

const overrideCodeBlockExtension: TokenizerAndRendererExtension = {
  name: 'code',
  level: 'block',

  renderer(token) {
    const t = token as CodeToken;

    if (t.lang === 'japanize') {
      return `<div class="flex text-sm gap-1">
      <p class="shrink-0 font-bold">日本語訳：</p>
      <p>${t.text}</p>
      </div>`;
    }

    const [lang, title] = (t.lang || 'plain:サンプルコード').split(':');
    const escaped = (() => {
      const sanitized = t.text.replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
      );

      if (lang === 'diff') {
        return sanitized.replace(/^\+(.*)|^-(.*)/gm, (_, add, remove) => {
          if (add) {
            return `<ins>+${add}</ins>`;
          }

          return `<del>-${remove}</del>`;
        });
      }

      return sanitized;
    })();

    return `<figure class="codeblock"><figcaption class="codeblock__caption"><span>${title ?? lang}</span></figcaption><pre><code data-language=${lang} class="hljs">${escaped}</code></pre></figure>`;
  },
};

type BlockquoteToken = Token & {
  type: 'blockquote';
  raw: string;
  tokens: Token[];
};

const overrideBlockquoteExtension: TokenizerAndRendererExtension = {
  name: 'blockquote',
  level: 'block',

  renderer(token) {
    const t = token as BlockquoteToken;

    const hasCiteMatches = t.text.match(/\n引用：/);

    if (hasCiteMatches) {
      const [text, cite] = t.text.split(/\n引用：/);
      const inner = marked.parse(text);
      const caption = marked.parse(`引用：${cite}`);
      return `<figure class="blockquote"><div aria-hidden="true">“</div><blockquote class="blockquote__content space-y-3">${inner}</blockquote><figcaption class="blockquote__caption">${caption}</figcaption></figure>`;
    }

    const inner = marked.parser(t.tokens);
    return `<blockquote class="blockquote"><div aria-hidden="true">“</div><div class="blockquote__content space-y-3">${inner}</div></blockquote>`;
  },
};

type TableToken = Token & {
  type: 'table';
  raw: string;
  header: Token[][];
  rows: Token[][][];
  align: ('center' | 'left' | 'right' | null)[];
};

const overrideTableExtension: TokenizerAndRendererExtension = {
  name: 'table',
  level: 'block',

  renderer(token) {
    const t = token as TableToken;

    const extractText = (token: Token[] | Token): string => {
      const first = Array.isArray(token) ? token[0] : token;
      if ('text' in first && typeof first.text === 'string') {
        return first.text;
      }
      return '';
    };

    const headerHtml = `<tr>${t.header
      .map((cell, j) => {
        const align = t.align[j] ? ` class="${t.align[j]}"` : '';
        const text = extractText(cell);
        const content = marked.parse(text);
        return `<th${align} scope="col">${content}</th>`;
      })
      .join('')}</tr>`;

    const bodyHtml = t.rows
      .map((row) => {
        return (
          '<tr>' +
          row
            .map((cell, j) => {
              const align = t.align[j] ? ` class="${t.align[j]}"` : '';
              const text = extractText(cell);
              const content = marked.parse(text);
              return `<td${align}>${content}</td>`;
            })
            .join('') +
          '</tr>'
        );
      })
      .join('');

    return `<div class="table-container scroll-hint-x"><table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`;
  },
};

export const customMarkdownSyntaxes = [
  customBlockExtension,
  overrideImageExtension,
  breakSpanExtension,
  amazonAssociateLinkExtension,
  footnoteRefExtension,
  footnoteDefExtension,
  overrideCodeBlockExtension,
  overrideBlockquoteExtension,
  overrideTableExtension,
];

export const markedParse = (filePath: string, content: string) => {
  currentFilePath = filePath;
  return marked.parse(content);
};
