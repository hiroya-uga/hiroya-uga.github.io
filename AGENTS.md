# Project Conventions

- Editing code (required): [code-style](.agents/rules/code-style.md)
- Components / pages / i18n: [component-structure](.agents/rules/component-structure.md)
- Blog / tech articles: [writing-guideline](.agents/rules/writing-guideline.md)

## Content URL Structure

- `/articles/**`
  - 日付性のある記事、読み物、告知、技術ブログ
- `/notes/**`
  - 恒久的な知識、FAQ、用語説明、ツールの使い方、PWA の説明
- `/documents/**`
  - 既存の翻訳・仕様・資料系だけを残す
  - 新規の汎用知識は増やさない

## CSS Modules

- 原則として、CSS Modules はコンポーネントの先頭要素に対応する `root` セレクタを持たせる
- ただし、コンポーネントがフラグメントを返す場合はその限りではない
- クラス名はなるべく単語 1 つで済ませる

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
