import { URL_ORIGIN } from '@/constants/meta';
import { marked, TokenizerAndRendererExtension, type Token } from 'marked';

type CustomBlockToken = Token & {
  type: 'customBlock';
  raw: string;
  text: string;
  blockType: string;
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
    return `<div data-type="${t.blockType}">${html}</div>`;
  },
};

type CustomImageToken = Token & {
  type: 'image';
  raw: string;
  href: string;
  text: string;
  title?: string | null;
};

const imageOverrideExtension: TokenizerAndRendererExtension = {
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

const footnoteDefs: Record<string, string> = {};

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
    return `<sup id="ref-${t.identifier}" class="font-mono inline-block"><a href="#note-${t.identifier}" aria-describedby="#note-${t.identifier}">[${t.identifier}]</a></sup>`;
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

    footnoteDefs[identifier] = text;

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

export const getFootnotes = (): [string, { html: string | Promise<string> }][] => {
  return Object.entries(footnoteDefs).map(([id, text]) => {
    return [id, { html: marked.parseInline(text) }];
  });
};

export const customMarkdownSyntaxes = [
  customBlockExtension,
  imageOverrideExtension,
  breakSpanExtension,
  amazonAssociateLinkExtension,
  footnoteRefExtension,
  footnoteDefExtension,
];
