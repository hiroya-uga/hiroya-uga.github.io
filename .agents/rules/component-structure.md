# Component Structure

## `src/components/Pages/`

ページ単位のUIコンポーネントはここに置く。

- `app/` 配下はルーティング・SEO・メタデータの定義に専念させ、UIの実装は `src/components/Pages/` に集約する
- 日本語版・英語版など複数のルートから同じUIを使う場合にも利用する

### ディレクトリ構成

```
src/components/Pages/<PageName>/
  index.ts               # barrel（Pageコンポーネントをexport）
  <PageName>.tsx         # ページのメインコンポーネント
  client/
    index.ts             # barrel（Clientコンポーネントをexport）
    <ComponentName>.tsx  # 'use client' コンポーネント
  server/
    index.ts             # barrel（Serverコンポーネントをexport）
    <ComponentName>.tsx  # サーバーコンポーネント（必要な場合のみ作成）
```

### 命名規則

| 対象                       | ルール                                             |
| -------------------------- | -------------------------------------------------- |
| ディレクトリ名・ファイル名 | PascalCase（`client/`・`server/` のみ小文字）      |
| `client/`                  | `'use client'` なコンポーネントを置く              |
| `server/`                  | サーバーコンポーネントを置く（必要な場合のみ作成） |

### `app/` ディレクトリの役割

`app/` 配下の `page.tsx` はルーティング・SEO（`metadata`・JSON-LD）のみを担当し、UIは `src/components/Pages/` に委譲する。

```tsx
// src/app/(ja)/page.tsx の例
import { HomePage } from '@/components/Pages/HomePage';
import { JsonLd } from '@/components/Meta';
import { DEFAULT_JSON_LD } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  // ページ固有のJSON-LDフィールド
};

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HomePage />
    </>
  );
}
```

---

## i18n（多言語対応）

- `lang: 'ja' | 'en'` propで文言を切り替える
- 文言は各コンポーネント内の`i18n`オブジェクトで管理する
- 別URLで提供し、`seo.ts`の`languages`フィールドで hreflangを指定する

```ts
// seo.ts に languages を定義する
'/tools/example': {
  // ...
  languages: { ja: '/tools/example', en: '/tools/example/en' },
},

// page.tsx はシンプルに
export const metadata = getMetadata('/tools/example');
```

> `URL_ORIGIN` との結合は `getMetadata` が行うため、`page.tsx` での `URL_ORIGIN` インポートは不要。

### URL構成

| 言語   | ファイルパス                                     | URL                |
| ------ | ------------------------------------------------ | ------------------ |
| 日本語 | `src/app/(ja)/(common)/tools/<name>/page.tsx`    | `/tools/<name>`    |
| 英語   | `src/app/(en)/(common)/tools/<name>/en/page.tsx` | `/tools/<name>/en` |

---

## Articles ディレクトリ構成

記事は内容に応じてディレクトリを使い分ける。

| パス                         | 用途                                       |
| ---------------------------- | ------------------------------------------ |
| `articles/blog/<year>/`      | 日記・雑記・カメラ・ガジェットなど技術以外 |
| `articles/tech-blog/<year>/` | CSS・HTML・JavaScript などの技術的な記事   |
| `articles/gunpla/<series>/`  | ガンプラ制作記録                           |

`articles/tech-blog/` の記事frontmatterには `proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced'` が必須。
