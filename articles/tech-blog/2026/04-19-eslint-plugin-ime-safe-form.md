---
title: "IME変換中のEnterキーで\nフォームが誤送信される問題を\nESLintで検出するプラグインを作った"
publishedAt: '2026-04-19T20:42:17+09:00'
topics: [JavaScript, ESLint, IME, アクセシビリティ]
proficiencyLevel: 'Intermediate'
---

日本語などのIME（Input Method Editor）を利用するユーザが、たびたび遭遇する不具合があります。**まだ入力中なのに送信されてしまう**というアレです。

この件について大変わかりやすいスライドで問題提起をしている、かみくずさんのツイートを拝見しまして、ESLintのプラグイン [eslint-plugin-ime-safe-form](https://github.com/hiroya-uga/eslint-plugin-ime-safe-form) を用意しました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">世界中のWebフロントエンドエンジニアに届いてほしいのですが<br><br>keydownイベントでEnterキーを待ち受けてサブミットを行う機能を作るとき、KeyboardEvent.isComposingを参照してください。そうしないと日本人ユーザーがまともに使えなくなります。<br>詳しくはこちらを。<a href="https://t.co/Vx0PbtZqmb">https://t.co/Vx0PbtZqmb</a></p>&mdash; かみくず (@p_craft) <a href="https://twitter.com/p_craft/status/2044418886175793154?ref_src=twsrc%5Etfw">April 15, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 問題となる実装の具体例

`keydown`イベントでEnterキーが押された時にフォームを送信するような実装です[^1]。

[^1]: `keydown`のみならず、`keypress`（非推奨）や`keyup`なども同様の問題が発生する。

```js:IME変換中もフォームが送信されてしまう例
inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    submit();
  }
});
```

IMEユーザは変換を確定するためにもEnterキーを押します。「Enterキーが押された時」だけでハンドリングしてしまうと、変換を確定しようとしただけなのにフォームが送信されてしまうわけです。

この問題は日本語利用者だけでなく、中国語・韓国語・ベトナム語・タイ語など**IMEを使う数十億人のユーザに影響する問題**です。

## 正しい実装

筆者個人としては、`form`要素の`submit`イベントを使う方法を推奨しています。こうしておけばそもそもIMEのサポートを考えなくてよくなります。

```js:submitイベントをハンドリングする例
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  submit();
});
```

一方で、送信する以外の目的で`keydown`イベントによって何かを実行する場合には、`KeyboardEvent.isComposing`を確認する必要があります。

```js:IME変換中をサポートした例
inputElement.addEventListener('keydown', (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  if (event.key === 'Enter') {
    submit();
  }
});
```

なお、`event.keyCode === 229`はSafariのバグを回避するためのものです[^2]。

[^2]: 古いSafariでは`compositionend`イベントが`keydown`より先に発火してしまう。IME変換中は`keyCode`が常に`229`になるという仕様を利用することで、Safariでも正しく判定できる。参考：[Element: keydown event - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event#keydown_events_with_ime)

## ESLintプラグイン

普段IMEを利用しているなら別ですが、英語圏などの非IMEユーザがこの問題に気づくのは難しいでしょう。というわけでESLintプラグインを用意しました。

```sh
npm install --save-dev eslint-plugin-ime-safe-form
```

```js:eslint.config.js
import imeSafeForm from "eslint-plugin-ime-safe-form";

export default [
  {
    plugins: {
      "ime-safe-form": imeSafeForm,
    },
    rules: {
      "ime-safe-form/no-enter-keydown-without-composition-check": "error",
    },
  },
];
```

設定すると、vanilla/JSXともに`isComposing`未使用を検出できます。

```jsx:検出される例
inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submit();
});

<input onKeyDown={(event) => {
  if (event.key === 'Enter') submit();
}} />
```

```jsx:適合例
inputElement.addEventListener('keydown', (event) => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === 'Enter') submit();
});

<input onKeyDown={(event) => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === 'Enter') submit();
}} />
```

## 終わりに

`eslint-plugin-ime-safe-form`を導入することで、`isComposing`のチェック漏れを検出できるようになります。

すでに[Issueを立てていただいております](https://github.com/hiroya-uga/eslint-plugin-ime-safe-form/issues/2)が、今後はTab・Escapeへの対応なども追加していけたらと思います。

まだ改善の余地はありますが、IMEユーザの体験改善につながる議論が進んでいけば嬉しいです。

また、[Biomeにも同様のルールが提案](https://github.com/biomejs/biome/discussions/10041)されており、そこでこのプラグインを根拠に添えていただきました。

無事に組み込まれることで、IMEユーザの困った！が少しでも減ることに期待したいです。
