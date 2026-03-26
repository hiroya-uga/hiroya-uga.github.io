import { LOADING_ICON_HTML } from '@/components/Icons';
import { URL_ORIGIN } from '@/constants/meta';
import { resolveArticleImagePath } from '@/utils/articles';
import { marked, TokenizerAndRendererExtension, type Token } from 'marked';

let currentFilePath = '';

const getLazyLoadMarkup = (params: { href: string; alt: string; controls: boolean }) => {
  const href = (() => {
    // ./filename.ext → /articles/{category}/{year}/filename.ext
    if (params.href.startsWith('./')) {
      const match = /\/articles\/([^/]+)\/([^/]+)\/[^/]+\.md$/.exec(currentFilePath);
      if (match) {
        const [, category, year] = match;
        return resolveArticleImagePath({ imagePath: params.href, category, year });
      }
    }

    return params.href || '';
  })();

  const url = href ? URL.parse(href, URL_ORIGIN) : null;
  const src = url?.pathname;
  const query = url?.search ? new URLSearchParams(url.search) : null;
  const { width, height } = (() => {
    const size = query?.get('size');

    if (typeof size === 'string') {
      const [w, h] = size.split('x').map((v) => Number.parseInt(v, 10) ?? 2);
      return { width: w / 2, height: h / 2 };
    }

    return {
      width: (Number.parseInt(query?.get('w') ?? '', 10) ?? 2) / 2,
      height: (Number.parseInt(query?.get('h') ?? '', 10) ?? 2) / 2,
    };
  })();

  if (src && width && height) {
    return `<span class="relative block mx-auto"><span class="absolute grid place-items-center inset-0">${LOADING_ICON_HTML}</span><customされたimg要素ˆ-ˆ src="${src}" alt="${params.alt}" width="${width}" height="${height}" class="relative noscript:invisible" loading${params.controls ? ' controls' : ''}><span style="aspect-ratio: ${width} / ${height}; display: block; width: 100%;" aria-hidden="true"></span></customされたimg要素ˆ-ˆ><noscript><img src="${src}" alt="${params.alt}" width="${width}" height="${height}" /></noscript></span>`;
  }

  return `<img src="${src}" alt="${params.alt}" loading="lazy" />`;

  // const titleAttr = t.title ? ` title="${t.title}"` : '';
  // return `<img src="${src}" alt="${t.text}"${titleAttr} />`;
};

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
  info: 'Information',
  memo: 'Memo',
};
const customBlockExtension: TokenizerAndRendererExtension = {
  name: 'customBlock',
  level: 'block',
  start(src) {
    const match = /^:::/.exec(src);
    return match?.index;
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
    const html = marked.parse(t.text, { async: false });
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

    return getLazyLoadMarkup({
      href: t.href,
      alt: t.text,
      controls: true,
    });
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
    const htmlInside = marked.parseInline(t.text, { async: false });
    return `<span class="block">${htmlInside}</span>`;
  },
};

type TalkingToken = Token & {
  type: 'talking';
  raw: string;
  text: string;
};

const talkingExtension: TokenizerAndRendererExtension = {
  name: 'talking',
  level: 'block',

  start(src) {
    // 行の先頭から——で始まる行を検索
    const match = /^——/.exec(src);
    return match?.index;
  },

  tokenizer(src) {
    // 行の先頭が——で始まり、その後に何らかのテキストが続く行
    const rule = /^——(.+)(?:\n|$)/;
    const match = rule.exec(src);
    if (!match) return;

    const [fullMatch, text] = match;

    const token: TalkingToken = {
      type: 'talking',
      raw: fullMatch,
      text: text.trim(),
    };

    return token;
  },

  renderer(token) {
    const t = token as TalkingToken;
    return `<p class="talking"><span>——</span><span>${t.text}</span></p>`;
  },
};

type CustomLinkToken = Token & {
  type: 'link';
  raw: string;
  href: string;
  text?: string;
  title?: string | null;
};

const linkExtension: TokenizerAndRendererExtension = {
  name: 'link',
  level: 'inline',

  renderer(token) {
    const t = token as CustomLinkToken;

    try {
      const url = new URL(t.href, URL_ORIGIN);

      if (url.hostname === 'youtu.be') {
        const title = t.text === t.href || t.text === '' ? 'YouTube video player' : t.text;
        url.searchParams.append('enablejsapi', '1');
        return `<span class="youtube"><span class="animate-fade-in-spinner">${LOADING_ICON_HTML}</span><iframe src="https://www.youtube.com/embed${url.pathname}${url.search}" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen data-js-api="loading"></iframe></span>`;
      }

      if (url.hostname === 'codepen.io') {
        const id = url.pathname.split('/').pop();
        return `<span class="codepen"><span class="animate-fade-in-spinner">${LOADING_ICON_HTML}</span><iframe title="${t.text ?? t.href}" src="https://codepen.io/hiroya_uga/embed/${id}?default-tab=html%2Cresult" loading="lazy" data-loading="true" onload="if(typeof window !== 'undefined'){this.removeAttribute('data-loading');this.removeAttribute('onload');}"></iframe></span>`;
      }

      if (url.hostname === 'amzn.to') {
        const notice = '※ 当サイトはAmazonアソシエイト・プログラムの参加者であり、適格販売により収入を得ています。';
        return `<span class="associate"><small>${notice}</small>\n<a href="${t.href}">Amazonリンク: ${t.text ?? t.href}</a></span>`;
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
    const match = /\[\^[^\]]+\]/.exec(src);
    return match?.index;
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
    const match = /^\[\^.+\]:/.exec(src);
    return match?.index;
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
        return sanitized.replace(/^(.*)/gm, (_, row) => {
          if (row.startsWith('+ ')) {
            return `<ins>${row}</ins>`;
          }

          if (row.startsWith('- ')) {
            return `<del>${row}</del>`;
          }

          return `<span>  ${row}</span>`;
        });
      }

      return sanitized.replace(/^\$ (.*)/gm, (_, row) => `<span class="of-command">${row}</span>`);
    })();

    const forSomePlatform = /^[a-zA-Z]+向け：?/.test(title);
    const dataPlatform = forSomePlatform ? ` data-platform="${title.split(/(^[a-zA-Z]+)向け/)[1]}"` : '';
    const resolvedTitle = forSomePlatform ? title.replace(/^[a-zA-Z]+向け：?/, '') : title;

    return `<figure class="codeblock"${dataPlatform}><figcaption class="codeblock__caption"><span class="codeblock__title${resolvedTitle ? '' : ' of-langName'}">${resolvedTitle || `${lang.toUpperCase()}<span class="sr-only">のサンプルコード</span>`}</span></figcaption><pre><code data-language=${lang} class="hljs">${escaped}</code></pre></figure>`;
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
      const inner = marked.parse(text, { async: false });
      const caption = marked.parse(`引用：${cite}`, { async: false });
      return `<figure class="blockquote"><blockquote class="blockquote__content space-y-3">${inner}</blockquote><figcaption class="blockquote__caption">${caption}</figcaption></figure>`;
    }

    const inner = marked.parser(t.tokens);
    return `<blockquote class="blockquote"><div class="blockquote__content space-y-3">${inner}</div></blockquote>`;
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
        const content = marked.parse(text, { async: false });
        return `<th${align} scope="col">${content}</th>`;
      })
      .join('')}</tr>`;

    const bodyHtml = t.rows
      .map((row) => {
        return (
          '<tr>' +
          row
            .map((cell, j) => {
              const align = t.align[j] ? ` class="is-${t.align[j]}"` : '';
              const text = extractText(cell);
              const tagName = text.trim().startsWith('^') ? 'th' : 'td';
              const content = marked.parse(tagName === 'th' ? text.slice(1) : text, { async: false });
              return `<${tagName}${align}>${content}</${tagName}>`;
            })
            .join('') +
          '</tr>'
        );
      })
      .join('');

    return `<div class="table-container scroll-hint-x"><table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`;
  },
};

type HeadingData = {
  id: string;
  text: string;
  level: number;
};

const createHeadingSlug = (text: string): string => {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[^\w\u3040-\u30ff\u3400-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const headingDefs = new Map<string, HeadingData[]>();
const overrideHeadingExtension: TokenizerAndRendererExtension = {
  name: 'heading',
  level: 'block',

  renderer(token) {
    const t = token as Token & { type: 'heading'; depth: number; text: string };
    const headings = headingDefs.get(currentFilePath) ?? [];

    const baseSlug = createHeadingSlug(t.text) || `section-${headings.length + 1}`;
    let id = `heading-${baseSlug}`;
    let suffix = 2;

    while (headings.some((heading) => heading.id === id)) {
      id = `heading-${baseSlug}-${suffix}`;
      suffix += 1;
    }

    headings.push({ id, text: t.text, level: t.depth });
    headingDefs.set(currentFilePath, headings);

    return `<h${t.depth} id="${id}">${t.text}</h${t.depth}>`;
  },
};

type ListToken = Token & {
  type: 'list';
  raw: string;
  ordered: boolean;
  start: number | '';
  loose: boolean;
  items: Array<{
    type: 'list_item';
    raw: string;
    task: boolean;
    checked?: boolean;
    loose: boolean;
    text: string;
    tokens: Token[];
  }>;
};

const overrideListExtension: TokenizerAndRendererExtension = {
  name: 'list',
  level: 'block',

  renderer(token) {
    const t = token as ListToken;
    const body = t.items
      .map((item) => {
        const content = marked.parse(item.text, { async: false });
        return `<li>${content}</li>`;
      })
      .join('\n');

    // 全てのli要素に<span class="associate">が含まれているかチェック
    const allAssociate = t.items.every((item) => {
      const html = marked.parse(item.text, { async: false }) as string;
      return html.includes('<span class="associate">');
    });

    if (allAssociate && t.items.length > 0) {
      // Amazonアソシエイトリンクのリストの場合
      const notice = '※ 当サイトはAmazonアソシエイト・プログラムの参加者であり、適格販売により収入を得ています。';
      // <li><p><span class="associate"><small>...</small>\n<a>...</a></span></p></li>
      // から <li><a>...</a></li> を抽出
      const cleanedBody = body
        .replace(/<span class="associate"><small>.*?<\/small>\s*\n?/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<p>\s*<\/p>/g, '');
      return `<div class="associate-list">\n<p><small>${notice}</small></p>\n<ul>\n${cleanedBody}\n</ul>\n</div>`;
    }

    const isAllImages = t.items.every((item) => /^!\[.*?\]\(.*?\)$/.test(item.text.trim()));
    const isImageViewer = isAllImages && t.items.length === 2;

    if (isImageViewer) {
      const imageData = t.items.map((item) => {
        const match = item.text.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
        return {
          alt: match?.[1] ?? '',
          url: match?.[2] ?? '',
        };
      });

      return `<div class="image-diff-viewer" title="画像比較ビューア">
        <p class="image-diff-viewer__item">
          <span class="image-diff-viewer__alt" aria-hidden="true">${imageData[0].alt.replace('比較画像1：', '')}</span>
          ${getLazyLoadMarkup({
            href: imageData[0].url,
            alt: imageData[0].alt,
            controls: false,
          })}
        </p>
        <p class="image-diff-viewer__item">
          <span class="image-diff-viewer__alt" aria-hidden="true">${imageData[1].alt.replace('比較画像2：', '')}</span>
          ${getLazyLoadMarkup({
            href: imageData[1].url,
            alt: imageData[1].alt,
            controls: false,
          })}
        </p>
        <p class="image-diff-viewer__controls">
          <label>
          <span class="sr-only">比較画像1の表示割合（％）</span>
          <input type="range" min="0" max="100" value="50" class="image-diff-viewer__slider">
          <noscript>JavaScriptを有効にしてください。</noscript>
          </label>

          <span aria-hidden="true" class="image-diff-viewer__thumb">↔</span>
        </p>
      </div>`;
    }

    const tag = t.ordered ? 'ol' : 'ul';
    const startAttr = t.ordered && t.start !== 1 && t.start !== '' ? ` start="${t.start}"` : '';
    return `<${tag}${startAttr}>\n${body}\n</${tag}>`;
  },
};

export const getTOC = (filePath: string, isExistFootnotes: boolean): string => {
  const headings = headingDefs.get(filePath) ?? [];

  if (headings.length === 0) return '';

  let html = '';
  let currentLevel = 1;
  const levelStack: number[] = [];

  for (const heading of headings) {
    const linkHtml = heading.text;

    if (heading.level > currentLevel) {
      // より深いレベル：新しいulを開始
      const diff = heading.level - currentLevel;
      for (let i = 0; i < diff; i++) {
        html += '<ul>';
        levelStack.push(heading.level - diff + i + 1);
      }
      html += `<li><a href="#${heading.id}">${linkHtml}</a>`;
      currentLevel = heading.level;
    } else if (heading.level === currentLevel) {
      // 同じレベル：liを追加
      html += `<li><a href="#${heading.id}">${linkHtml}</a>`;
    } else {
      // より浅いレベル：ulを閉じる
      while (levelStack.length > 0 && levelStack[levelStack.length - 1] > heading.level) {
        html += '</ul>';
        levelStack.pop();
      }
      html += `<li><a href="#${heading.id}">${linkHtml}</a>`;
      currentLevel = heading.level;
    }
  }

  // 残りのulを閉じる
  while (levelStack.length > 0) {
    if (levelStack.length === 1 && isExistFootnotes) {
      // 最後のulを閉じる前に脚注へのリンクを追加
      html += `<li><a href="#footnotes">脚注</a>`;
    }
    html += '</ul>';
    levelStack.pop();
  }

  return html;
};

export const getFootnotes = (filePath: string): [string, { html: string | Promise<string> }][] => {
  return Object.entries(footnoteDefs.get(filePath) ?? []).map(([id, text]) => {
    return [id, { html: marked.parseInline(text, { async: false }) }];
  });
};

export const customMarkdownSyntaxes = [
  customBlockExtension,
  overrideImageExtension,
  breakSpanExtension,
  talkingExtension,
  linkExtension,
  footnoteRefExtension,
  footnoteDefExtension,
  overrideCodeBlockExtension,
  overrideBlockquoteExtension,
  overrideTableExtension,
  overrideHeadingExtension,
  overrideListExtension,
];

export const markedParse = (filePath: string, content: string) => {
  currentFilePath = filePath;
  headingDefs.delete(filePath);
  footnoteDefs.delete(filePath);
  return marked.parse(content);
};
