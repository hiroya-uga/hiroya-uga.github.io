---
title: "CSSでShadow rootの\n有無を検知したい。"
publishedAt: '2026-04-17T00:07:10+09:00'
topics: [CSS, Web標準]
proficiencyLevel: 'Intermediate'
---

あるいは、要素がShadow hostかどうかを知りたい。そんなニーズはありませんか？筆者の場合は、まさにそれでした。

現状、Shadow DOMに関連するCSSセレクタは以下の通りです[^1]。

[^1]: 記事執筆時点。参考：[CSS Shadow Module Level 1](https://drafts.csswg.org/css-shadow-1/)

| セレクタ           | Shadow DOMのどこで使われるか |
| ------------------ | :--------------------------: |
| `:host`            |             内側             |
| `:host()`          |             内側             |
| `:host-context()`  |             内側             |
| `:has-slotted`[^2] |             内側             |
| `::slotted()`      |             内側             |
| `::part()`         |           **外側**           |

[^2]: 記事執筆時点の`:has-slotted`はEditor's Draft段階で、主要なブラウザの中ではFirefoxのみサポート。参考：[CSS Shadow Module Level 1](https://drafts.csswg.org/css-shadow-1/#the-has-slotted-pseudo)、[Can I use](https://caniuse.com/mdn-css_selectors_has-slotted)

そのほとんどはShadow DOMの内側で使われるものとなっています。

唯一、`::part()`は外側から一部の要素にマッチさせられる擬似要素セレクタですが、結局どのセレクタを用いても特定の要素がShadow hostかどうかは判定できません[^3]。

[^3]: `part`属性が使われていれば`:has(::part(hoge))`ができそうだが、has-allowed pseudo-elementとして定義されていなければ`:has()`セレクタは引数に擬似要素セレクタを持てず、`::part()`擬似要素セレクタはその対象になっていない。参考：[4.5. The Relational Pseudo-class: :has() - Selectors Level 4](https://drafts.csswg.org/selectors-4/#relational)

## 要素がShadow hostかどうか知りたいときの例

```html
<li>
  <div id="widget">
    <script src="..."></script>
    <script src="..."></script>
  </div>
</li>
```

上記のようなマークアップで、`#widget`内部にサードパーティウィジェットが埋め込まれるとします。

この時、`#widget`内部のDOM構造が変化するならば、次のようにスタイリングすることでハンドリングできそうです。

```css
li:has(#widget > script:first-child + script:last-child) {
  display: none;
}
```

一方で、`#widget`内部にShadow DOMが展開されるケースでは、Light DOM（通常のDOM）は変化しないため、現状のCSSだけだと検知できません。

そこで、要素がShadow hostかどうか（＝Shadow DOMを持っているか）を判定するセレクタがあればいいなと思い、調べてみました。

## 既存のプロポーザル

これについての議論は、2018年にはCSS Working Group上で始まっていました。

- [[css-selectors] new pseudo class that matches shadow hosts #2908](https://github.com/w3c/csswg-drafts/issues/2908)
- [[css-scoping] `:has-shadow` pseudo-class #11007](https://github.com/w3c/csswg-drafts/issues/11007)

2つのIssueがありますが、いずれも「Shadow rootを持つ要素に外側からマッチするセレクタが欲しい」というものです。CSS目線のユースケースが議論されていなさそうだったため、[今回の件をコメントに残しておきました](https://github.com/w3c/csswg-drafts/issues/11007#issuecomment-4256539366)。

エッジケースではあると思いますが、議論の助けになれば嬉しいです。

## 余談

```css
/* `::shadow-root`がhas-allowedな疑似要素として実装されたケースを想定 */
li:not(:has(#widget::shadow-root)) {
  display: none;
}

li:not(:has(#widget:has-shadowroot)) {
  display: none;
}
```

筆者は直前まで`::shadow-root`が好みでしたが、記事執筆時点の現在は`:has-shadowroot`を推したいと思います。

Shadow root自体を表す擬似要素セレクタが誕生したとしても、外側からはスタイリングできない（はず）です。それならば、Shadow hostがあるかどうかの状態を表すだけの擬似クラスセレクタのほうがシンプルだと思いました。`:has-slotted`擬似クラスとも一貫性を感じますね。

まもなくこの議論も10年。はたして、あと2年で話は進んでいくのでしょうか。2年後が楽しみです。
