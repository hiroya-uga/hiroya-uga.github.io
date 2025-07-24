---
title: "CSSでカスタマイズ可能な\n`select`要素が誕生"
publishedAt: '2025-07-23'
tags: [HTML, CSS, フォーム, Web標準]
---

7月22日、かねてより議論が進められていた`select`要素をカスタマイズ可能にする仕様が、HTML Living Standardにマージされました[^1]。

たとえば以下のようなマークアップもWeb標準に則ったものとなります。

```html
<select>
  <option>
    <span class="emoji">🍣</span>
    <span class="label">おすし</span>
  </option>
  <option>
    <span class="emoji">🍜</span>
    <span class="label">らあめん</span>
  </option>
</select>
```

[^1]: [Define customizable &lt;select&gt; #10548](https://github.com/whatwg/html/pull/10548) - whatwg/html

## 自由にスタイリングできるようになったプルダウン

従来の`<select>`要素はスタイリングの自由度が極めて低いもので、見た目にこだわるならARIAとJavaScriptの力を借りて一から作るしかありませんでした。
Webデザインをされる方も、ドロップボックスのプルダウン（ドロップダウンのピッカー）の中身はよほどのことがない限りデザインしてはいけないと言われてきた方が多いのではないでしょうか。

どのくらい先になるかはわかりませんが、今回の仕様改善でその制限も終わりを迎えます[^2]。単純なテキスト以外にも多くのフレージングコンテンツが設置できるようになり[^3]、JavaScriptを使わずとも簡単にこのような表現ができるようになりました。

[^2]: 現状ではほとんどのブラウザで動作しないため、採用を検討する段階になっても実機検証は必ず行うことを推奨します（参考：[Can I use...](https://caniuse.com/?search=selectedcontent)）。

[^3]: [option element inner content elements](https://html.spec.whatwg.org/multipage/dom.html#option-element-inner-content-elements)

<iframe height="500" style="width: 100%;"  title="Customizable Select Example" src="https://codepen.io/hiroya_uga/embed/vENGJxe?default-tab=html%2Cresult" loading="lazy"></iframe>

:::warn
`select`要素およびプルダウンをカスタムするには、`appearance: base-select;`をあらかじめ指定する必要があります。

```css
select,
::picker(select) {
  appearance: base-select;
}
```

:::

## 追加された仕様

今回の仕様変更では、大きく3つの観点で仕様が更新されています。

- コンテンツカテゴリの新設
- 新規要素の追加
- CSSセレクターの追加

### コンテンツカテゴリの追加

まずはコンテンツカテゴリの新設についてです。  
`select`要素、`optgroup`要素、`option`要素それぞれに含められる要素が独立したコンテンツカテゴリとして定義されました。

> **3.2.5.2.10 select element inner content elements**
>
> select element inner content elements are the elements which are allowed as descendants of select elements.
>
> The following are select element inner content elements:
>
> - `option`
> - `optgroup`
> - `hr`
> - [script-supporting elements](https://html.spec.whatwg.org/multipage/dom.html#script-supporting-elements-2)
> - `noscript`
> - `div`
>
> **3.2.5.2.11 optgroup element inner content elements**
>
> optgroup element inner content elements are the elements which are allowed as descendants of optgroup elements.
>
> The following are optgroup element inner content elements:
>
> - `option`
> - [script-supporting elements](https://html.spec.whatwg.org/multipage/dom.html#script-supporting-elements-2)
> - `noscript`
> - `div`
>
> **3.2.5.2.12 option element inner content elements**
>
> option element inner content elements are the elements which are allowed as descendants of option elements.
>
> The following are option element inner content elements:
>
> - `div`
> - [phrasing content](https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2) that is not in the following exclusion list
>
> The following are excluded from option element inner content elements:
>
> - `datalist`
> - `object`
> - [interactive content](https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2), elements with the `tabindex` attribute specified
>
> 引用：[HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html#select-element-inner-content-elements) — Last Updated 22 July 2025

[^3]: [select element inner content elements](https://html.spec.whatwg.org/multipage/dom.html#select-element-inner-content-elements)

これまでにない優遇措置（？）に驚きましたが、`span`要素のコンテンツモデルが更新されたことにも時代の変化を感じます。  
`div`要素が`dl`要素の子要素として許可された変更以来の大きな仕様更新と言えるかもしれません。

`span`要素が子に持てるコンテンツカテゴリはフレージングコンテンツのみでしたが、`div`要素も`span`要素も、`select`要素周りでスタイリングに必要なら必要な場所に組み込めるようになったので、スタイリングがはかどることでしょう。

### 新規要素の追加

[`selectedcontent`](https://html.spec.whatwg.org/multipage/form-elements.html#the-selectedcontent-element)要素が新たに追加されました。この要素は、選択中の`option`要素の中身を表示するポータルのように振る舞います。

今回の更新で`select`要素のコンテンツモデルも変更になり、ドロップボックスの場合[^4]は最初の子要素に`button`要素を設置できるようになりました。

[^4]: ドロップボックスとは、`multiple`属性を持っておらず`size`属性の値が1または未定義の`select`要素を指す。

`selectedcontent`要素は、`select`要素の最初の子要素である`button`要素の中にだけ設置できます。  

```html:selectedcontent要素の設置例
<select>
  <button type="submit">
    <selectedcontent></selectedcontent>
  </button>

  <option>
    <span class="emoji">🍣</span>
    <span class="label">おすし</span>
  </option>
  <option>
    <span class="emoji">🍜</span>
    <span class="label">らあめん</span>
  </option>
</select>
```

現段階ではコンテンツモデルが[Nothing](https://html.spec.whatwg.org/multipage/dom.html#concept-content-nothing)のため、直接なにかコンテンツを書くのではなく、スタイリングのために使うことになるでしょう。

```css:selectedcontent要素を使ったCSSの例
/* プルダウンにある絵文字をドロップボックス本体側では表示しない */
selectedcontent .emoji {
  display: hidden;
}
```

インタラクティブコンテンツの中にインタラクティブコンテンツが入れられるようになった点はやや奇妙ですが、`select`要素がボタンのようにクリックできる構造を維持しながら見た目をカスタムできるようにするには、仕様の拡張性の観点からもよいアプローチだと感じています。

### CSSセレクターの追加

`select`要素をスタイリングする上では他にも擬似クラスがありますが、ここでは以下3点について紹介します[^5]。

[^5]: [Customizable select elements - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select)

| 項目                                                                             | 説明                                     |
| -------------------------------------------------------------------------------- | ---------------------------------------- |
| [`select::picker(select)`](https://drafts.csswg.org/css-forms/#picker-pseudo)    | プルダウンの選択肢を表示するポップアップ |
| [`option::checkmark`](https://drafts.csswg.org/css-forms/#selectordef-checkmark) | 選択済みを表すチェックマーク             |
| [`select::picker-icon`](https://drafts.csswg.org/css-forms/#picker-icon)         | プルダウンの存在を表すアイコン            |

これらの登場により、プルダウンであることを示すアイコンや選択済みであることを示すチェックマークを`content`プロパティで置き換えたり、プルダウンをフェードインさせたりできるようになりました。

## おわりに

ラジオボタンやチェックボックスが擬似要素等を使うことで比較的簡単にスタイリングできる一方で、プルダウンの見た目をアクセシビリティを確保しながらカスタマイズするハードルは非常に高いものでした。
`select`要素のスタイリングが自由にできるようになったことで、セマンティクス的な側面でのアクセシビリティを壊すことなく見た目をリッチにできるようになり、開発者にとってもデザイナーにとっても可能性が大きく広がるアップデートだったと思います。

一方で、デフォルトだったからこそ守られてきたアクセシビリティやユーザビリティが損なわれないかということに注意していかなければなりません。  
文字が詰め込まれすぎていないか、コントラストは十分か、プルダウンの表示位置やアニメーション、ブラウザ側がよしなにやってくれている部分の責任を持つということを意識する必要があるでしょう。

---

余談ですが、筆者は`fieldset`要素と`legend`要素が好きなので、ぜひこのあたりのお話も進んでくれると嬉しいと思います。  
世の中の採用率を上げるためにも、ぜひ🙏

- [Disable fieldset/legend rendering magic with CSS #3912](https://github.com/whatwg/html/issues/3912) - whatwg/html
- [\[css-forms-1\] Include fieldset and legend #11983](https://github.com/w3c/csswg-drafts/issues/11983) - w3c/csswg-drafts
