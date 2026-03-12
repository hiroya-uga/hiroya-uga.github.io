import MarkdownIt from 'markdown-it';

const md = new MarkdownIt('zero', {
  html: false,
  linkify: false,
  breaks: true,
});

/*
 * 以下は Slack のメッセージに使用できるマークアップの一覧。
 *
 * - 太字
 * - イタリック
 * - 取り消し線
 * - インラインコード
 * - ブロック引用
 * - コードブロック
 * - 順序付きリスト
 * - 箇条書きリスト
 *
 * @see https://slack.com/intl/ja-jp/blog/productivity/quote-and-share-messages-in-slack
 */
md.enable([
  // リンク
  'link',
  // 太字・イタリック
  'emphasis',
  // 取り消し線
  'strikethrough',
  // インラインコード
  'backticks',
  // ブロック引用
  'blockquote',
  // コードブロック
  'fence',
  // リスト
  'list',
]);

/** Slack のメッセージに使用できるマークアップを返す */
export function parseMarkdownForSlack(input: string) {
  return md.render(input);
}
