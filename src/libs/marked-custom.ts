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
  /** Marked が生成する image トークンを捕まえる */
  name: 'image',
  level: 'inline',

  /**
   * tokenizer は既存のものをそのまま使うので不要
   */

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

export const customMarkdownSyntaxes = [customBlockExtension, imageOverrideExtension];
