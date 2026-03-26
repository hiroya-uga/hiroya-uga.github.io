---
title: "<dialog closedby=\"any\">\nが便利すぎる"
publishedAt: '2026-03-07T16:45:29+09:00'
topics: [HTML, Web標準, dialog要素, Tips]
proficiencyLevel: 'Beginner'
---

`dialog`要素の`closedby`属性がとにかく本当に便利だ…という話です🍣

`showModal()`が出てきた時、フォーカスの閉じ込めをブラウザがやってくれるようになったニュースでも感動しましたが、ついに<ruby>簡易非表示機能<rt>ライトディスミス</rt></ruby>までブラウザがやってくれるようになりました[^1]。

[^1]: 記事執筆時点ではSafari未対応（<https://caniuse.com/?search=closedby>）

## やることは`closedby="any"`をつけるだけ！！！！

`closedby="any"`を付けるだけで、ESCキー押下や`::backdrop`クリックでダイアログが閉じられるようになります[^2]。

[^2]: `closedby`属性がない場合、ダイアログの開き方によって挙動が変化します。モーダルとして`showModal()`で開いたならデフォルト値は`closerequest`扱いになり、ESCキーで閉じることができます。モードレスとして`show()`で開いたなら`none`がデフォルト値として扱われます。

| 値             | 説明                                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| `none`         | 開発者が用意した方法だけで閉じられる                                           |
| `closerequest` | 標準の操作でのみ閉じられる（ブラウザでのESCキー、など）。                      |
| `any`          | `::backdrop`をクリック、標準の操作、開発者が用意した方法の３通りで閉じられる。 |

もう`keydown`を拾ったり、`dialog`要素に`click`イベントハンドラ渡してクリックされたのが中身かどうか判定したりする必要もなくなるんだ…。

[Example: Dialog.prototype.closedby](https://codepen.io/hiroya_uga/pen/wBzWdwo)

## Safariくん、がんばって🔥

残念ながらSafariが未対応なため実務で使うには気が早いですが、Chrome拡張や社内ツールなどではバチバチに使っていきたいですね。

Interop 2026で名前が上がっている仕様なので、年内になんとか対応されてほしいところですが果たして…。  
<https://web.dev/blog/interop-2026?hl=ja#dialogs_and_popovers>

`dialog`要素が生まれる前からどれだけダイアログUIを作ってきたかわかりません😂。「ESCキーで閉じる」「`::backdrop`（暗い背景）クリックで閉じる」といった機能、これまで何回実装したことか…🛞🔨

はやく`closedby`が当たり前になって欲しいです🙏  
たのみます🙏🙏

## 参考文献

- [HTML Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-closedby)
- [HTML Standard 日本語訳](https://momdo.github.io/html/interactive-elements.html#attr-dialog-closedby)
- [&lt;dialog&gt;: ダイアログ要素 - HTML | MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Elements/dialog#closedby)
