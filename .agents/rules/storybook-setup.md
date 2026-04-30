# Storybook 導入指示書

## 概要

Storybook 10（最新安定版）を導入する。このプロジェクトの構成に合わせて以下の方針で実装すること。

- **フレームワーク**: `@storybook/nextjs-vite`（Vite ベース、Vitest との統合に最適）
- **Vitest 統合**: `@storybook/addon-vitest`（既存の Vitest テストと同一プロセスで実行）
- **Tailwind CSS v4**: `@tailwindcss/vite` プラグイン経由で Storybook に適用
- **アクセシビリティ**: `@storybook/addon-a11y` を必須導入

---

## 1. パッケージインストール

```bash
yarn add --dev \
  storybook \
  @storybook/nextjs-vite \
  @storybook/addon-vitest \
  @storybook/addon-a11y \
  @tailwindcss/vite \
  @playwright/test \
  playwright
```

> `@storybook/addon-vitest` は Vitest のブラウザモードで story をコンポーネントテストとして実行する。Playwright の Chromium を使うため `@playwright/test` と `playwright` が必要。

Playwright のブラウザバイナリをインストールする:

```bash
yarn playwright install chromium
```

---

## 2. 設定ファイルの作成

### `.storybook/main.ts`

```ts
import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = [tailwindcss(), ...(config.plugins ?? [])];
    return config;
  },
};

export default config;
```

### `.storybook/preview.ts`

```ts
import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // WCAG AA を目標とする
      config: {},
    },
  },
};

export default preview;
```

---

## 3. Vitest 設定の更新

既存の `vitest.config.ts` を以下のように更新する。Storybook の story を Vitest のブラウザモードでテスト実行できるようにする。

```ts
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    projects: [
      {
        // 既存のユニットテスト（jsdom 環境）
        // extends: true で root の plugins / resolve を継承する
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          typecheck: {
            tsconfig: './tsconfig.test.json',
          },
        },
      },
      {
        // Storybook のコンポーネントテスト（ブラウザモード）
        // extends: true で root の plugins / resolve を継承する
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
            storybookScript: 'yarn storybook --ci',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
```

### `.storybook/vitest.setup.ts`（新規作成）

```ts
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

setProjectAnnotations(projectAnnotations);
```

---

## 4. `package.json` へのスクリプト追加

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test:storybook": "vitest --project=storybook"
  }
}
```

---

## 5. Story ファイルの書き方

### 命名規則

- ファイル名: `ComponentName.stories.tsx`
- 配置: コンポーネントファイルと同じディレクトリに置く
  - 例: `src/components/ui/lists/DiscList.stories.tsx`

### CSF3 フォーマット（必須）

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DiscList } from './DiscList';

const meta = {
  component: DiscList,
  tags: ['autodocs'],
} satisfies Meta<typeof DiscList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    list: ['項目 1', '項目 2', '項目 3'],
  },
};

export const WithObjects: Story = {
  args: {
    list: [
      { key: 'a', value: <strong>強調テキスト</strong> },
      { key: 'b', value: '通常テキスト' },
    ],
  },
};

export const Empty: Story = {
  args: {
    list: [],
  },
};
```

### Story 命名ルール

- export 名は PascalCase
- story 名は使用状況・バリエーションを表す英語名
  - `Default`, `WithIcon`, `Disabled`, `Empty`, `Loading` など
- `tags: ['autodocs']` を meta に付与してドキュメント自動生成を有効にする

### コードスタイル（[code-style](./code-style.md) に準拠）

- `!` による否定は使わない
- 3 引数以上の関数はオブジェクト分割代入
- 型推論できる場合は型注釈を省略しない（`satisfies` を積極的に使う）

---

## 6. 導入後の確認

以下のコマンドが正常に動作することを確認する:

```bash
# Storybook を起動する
yarn storybook

# Storybook のコンポーネントテストを実行する
yarn test:storybook

# 全テストを実行する（既存ユニットテスト + Storybook テスト）
yarn test
```

---

## 7. 最初に story を書くコンポーネント

以下の `src/components/ui/` 配下のコンポーネントから優先的に story を作成すること:

| ファイル                   | 理由                             |
| -------------------------- | -------------------------------- |
| `lists/DiscList.tsx`       | props バリエーションが明確       |
| `lists/NoteList.tsx`       | 同上                             |
| `lists/SimpleLinkList.tsx` | 同上                             |
| `buttons/TextLink.tsx`     | 再利用頻度が高い                 |
| `headings/` 配下           | 見出しレベルのバリエーション確認 |

---

## 8. `.gitignore` への追記

```
# Storybook
storybook-static/
```

---

## 注意事項

- `@storybook/nextjs-vite` は Next.js の `next/router`, `next/navigation`, `next/image` を自動スタブするため、個別のモックは原則不要
- `next/link` を使う `Button.tsx` のような server component は、Storybook 側でクライアントとして扱われる（RSC テストは現在 experimental のため対象外）
- `globals.css`は内部で`spacing.css`を`@import`しているため、`preview.ts`で`globals.css`だけインポートすれば`--color-primary`等のCSSカスタムプロパティを含むすべてのスタイルがStorybookに適用される
- CSS Modules（`.module.css`）は `@storybook/nextjs-vite` が自動対応するため追加設定不要
- `vitest.config.ts` を projects 構成に変更した場合、既存の `yarn test` コマンドは全 project を実行する（挙動変更なし）
