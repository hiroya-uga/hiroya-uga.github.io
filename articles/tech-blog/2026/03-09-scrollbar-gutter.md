---
title: "モーダルダイアログの\nスクロールロックで\nレイアウトがガタつく問題"
publishedAt: '2026-03-09'
topics: [CSS, Web標準, dialog要素, Tips]
proficiencyLevel: 'Beginner'
---

最近でもないけれど、スクロールロック時に画面幅がガタガタするのをよく見るような気がする、というメモ書き。

## body.clientWidth の違いでがんばっていたあの頃

スクロールロックを書いてる時、ロック前のスクロールバーの幅を取得して、ロック後にその値だけ`body`要素とかに`padding-right`当てたくなる。昔は画面幅とか拾って頑張っていました。

なんの話かわからないMacユーザさんは、いったん外観設定から「スクロールバーを表示」の設定で「常に表示」に変更しておきましょう。

![](./03-09-scrollbar-gutter-01.webp?w=1200&h=1030)

スクロールバーがでるくらいのコンテンツ量を持つページで`html`要素に`overflow: hidden;`をつけると、コンテンツ幅がガタつきますよね。

## そんなお悩みはCSS１行追加で解決

```css
:root {
  scrollbar-gutter: stable;
}
```

`scrollbar-gutter`はスクロールバーが表示される領域（ガター）をあらかじめ確保したい時に便利なプロパティです。

| 値                  | 振る舞い                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `auto`              | 通常通りスクロールバーが必要になったらコンテンツ幅が狭まる。                                               |
| `stable`            | スクロールバーの有無にかかわらず、スクロールバーが表示される領域を確保しておく。                           |
| `stable both-edges` | スクロールバーの領域を確保しつつ、反対側にも同じ幅だけ余白を生み出す（コンテンツが左右中央に配置される）。 |

筆者はスクロールバーは「常に表示」にしていますが、その場合はスクロールバーが不要な状態でもスクロールバーの領域が確保されます。

![](./03-09-scrollbar-gutter-02.webp?w=1708&h=574)

なにもせずにガタガタさせておくよりは、とりあえず`stable`にするのが良さそうです👀

## ついでにつけたいoverscroll-behavior

モーダルダイアログを開いている時、モーダル内のコンテンツをスクロールして最後まで到達すると、背景の`body`要素がスクロールしてしまう問題があります。これを[scroll chaining](https://developer.mozilla.org/ja/docs/Glossary/Scroll_chaining)と呼びます。

```css
dialog {
  overscroll-behavior: contain;
}
```

`overscroll-behavior`は、指定するだけでscroll chainingを防ぐことができる優れものです！

| 値        | 振る舞い                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `auto`    | スクロールが親要素に伝播する（デフォルト）                                                                     |
| `contain` | スクロールが親要素に伝播しない。                                                                               |
| `none`    | スクロールが親要素に伝播しない。macOSやiOSで見られるスクロール端でのバウンドなどの独自動作も無効化される[^1]。 |

[^1]: `-webkit-overflow-scrolling: touch`が必要だった時期に`-webkit-overflow-scrolling: touch`をつけなかった時の動きみたいな感じになる

## 🍣 実装例

[Example: Modal dialog with scroll lock](https://codepen.io/hiroya_uga/pen/ZYpONgP)

究極、たった3つのルールセットを書くだけでいままで苦労してきたスクロール周りの制御まですっかり綺麗に対応されます[^2]。

[^2]: CodePen埋め込みをmacOSのSafariで確認するとガターの横幅が一致せずガタつく場合がありそうでした。iframeの中にあるときだけに見えるので同一コンテキストで動作させる場合では問題なさそうです（macOS 26.2）。

```css
:root {
  scrollbar-gutter: stable;
}

:root:has(dialog:modal) {
  overflow: hidden;
}

dialog {
  overscroll-behavior: contain;
}
```

[前回の記事](/articles/tech-blog/2026/03-07-dialog-closedby/)でも紹介していた`dialog[closedby]`もそうですが、いつの間にかダイアログUIまわりの進化がすごいですね。

これ以外にも、いつの間にかできるようになっていることがたくさんあるので、引き続きCSSの進化にも注目していきたいです💃🍣

## 参考文献

- scrollbar-gutter: [CSS Overflow Module Level 3](https://drafts.csswg.org/css-overflow-3/#scrollbar-gutter-property)
- overscroll-behavior：[CSS Overscroll Behavior Module Level 1](https://drafts.csswg.org/css-overscroll/#overscroll-behavior-properties)
