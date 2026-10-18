/**
 * articles/ 内の Markdown を public/articles/ に書き出す。
 * `<link rel="alternate" type="text/markdown">` の参照先になる。
 * 画像の相対パスを保つため、出力先は画像と同じ階層（`<category>/<year>/<slug>.md`）にする。
 */
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const articlesDir = path.join(root, 'articles');

const FRONTMATTER_KEYS = ['title', 'publishedAt', 'updatedAt', 'description', 'topics'];

/**
 * 公開してよい frontmatter のキーだけを残し、本文から HTML コメント（下書き）と画像の `?size=` を除く。
 * title の `\n` は表示用の改行なので、サイトの `<title>` と同じく取り除く。
 * 独自記法は変換しない。
 * @param {string} source
 */
function toPublicMarkdown(source) {
  const { data, content } = matter(source);

  const frontmatter = Object.fromEntries(
    FRONTMATTER_KEYS.filter((key) => key in data).map((key) => [
      key,
      key === 'title' ? String(data[key]).replaceAll('\n', '') : data[key],
    ]),
  );

  const body = content
    .replace(/<!--[\s\S]*?-->\n?/g, '')
    .replace(/(\]\([^)\s]+?)\?size=\d+x\d+\)/g, '$1)')
    .replace(/^\n+/, '');

  return matter.stringify(`\n${body}`, frontmatter);
}

for (const category of fs.readdirSync(articlesDir)) {
  const categoryPath = path.join(articlesDir, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;

  for (const year of fs.readdirSync(categoryPath)) {
    const yearPath = path.join(categoryPath, year);
    if (!fs.statSync(yearPath).isDirectory()) continue;

    for (const file of fs.readdirSync(yearPath)) {
      if (!file.endsWith('.md')) continue;

      const destDir = path.join(root, 'public', 'articles', category, year);
      fs.mkdirSync(destDir, { recursive: true });
      const source = fs.readFileSync(path.join(yearPath, file), 'utf-8');
      fs.writeFileSync(path.join(destDir, file), toPublicMarkdown(source));
    }
  }
}

console.log('✓ Article markdown copied.');
