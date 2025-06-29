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

export const customMarkdownSyntaxes = [customBlockExtension];
