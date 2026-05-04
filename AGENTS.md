# Project Conventions

- Editing code (required): [code-style](.agents/rules/code-style.md)
- Components / pages / i18n: [component-structure](.agents/rules/component-structure.md)
- Blog / tech articles: [writing-guideline](.agents/rules/writing-guideline.md)

## Content URL Structure

- `/articles/**`
  - 日付性のある記事、読み物、告知、技術ブログ
- `/wiki/**`
  - 恒久的な知識、FAQ、用語説明、ツールの使い方、PWA の説明
- `/documents/**`
  - 既存の翻訳・仕様・資料系だけを残す
  - 新規の汎用知識は増やさない

## CSS Modules

- 原則として、CSS Modules はコンポーネントの先頭要素に対応する `root` セレクタを持たせる
- ただし、コンポーネントがフラグメントを返す場合はその限りではない
- クラス名はなるべく単語 1 つで済ませる
