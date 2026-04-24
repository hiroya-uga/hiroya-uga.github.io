# Code Style

## 否定表現

`!` を使った否定表現は使わない。意図が明確な比較式を使う。`==` / `!=` は禁止。

```ts
// Bad
if (!value) { ... }
if (value == null) { ... }

// Good
if (value === null) { ... }
if (value === undefined) { ... }
if (value !== null) { ... }
if (condition === false) { ... }
```

## 数値比較

右辺が大きい形に統一する。

```ts
value < 100; // Good
100 < value; // Good
100 > value; // Bad
value > 100; // Bad
```

## ブレースの省略

アロー関数と `switch` の `case` 以外でブレースの省略は認めない。`if` / `else` も単一文でも必ずブレースを使う。1行の `if` リターンも禁止。

```ts
// Bad
if (condition) return;

// Good
if (condition) {
  return;
}
```

## 関数

`function` 構文より関数式（アロー関数）を優先する。3つ以上の引数を受け取るなら、オブジェクトで受け取る。

```ts
// Bad
function hoge(a, b, c) {}
const hoge = (a, b, c) => {};

// Good
const hoge = ({ a, b, c }) => {};
```

## イベントハンドラーの命名

| 命名         | 用途                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `onHoge`     | `event` オブジェクトを受け取るハンドラー、またはコンポーネントの props として公開するコールバック |
| `handleHoge` | `event` オブジェクトを受け取らない内部処理関数（引数は任意）                                      |

```ts
const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  handleSubmit();
};

const handleSubmit = () => {
  // フォーム送信処理
};

type Props = {
  onSubmitButtonClick: () => void;
};
```

## フォームコントロールのフォントサイズ

`<input>` および `<textarea>` のフォントサイズには `text-sm`（14px相当）以下を指定してはならない。16px未満はiOS Safariでフォーカス時に画面が自動ズームされる原因となる。`text-base`（16px）以上を使う。

```html
<!-- Bad -->
<input class="text-sm" />

<!-- Good -->
<input class="text-base" />
```

## コメント

実装上のメモや補足は `//` を使う。変数・定数・関数の説明は JSDoc 形式で書く。`// >` は式の評価結果や値、`// ->` はログや出力先に現れる内容を表す。

```ts
// ただのめも
console.log(1000); // -> 1000

/** 値の説明 */
const hoge = 2000;

hoge + 2; // > 2002
```
