---
title: "割引などの金額変更で\n打ち消し線を表現するための\nマークアップを考える"
description: '文中の訂正や、既に事実とは異なることを表現する場合には`s`要素や`del`要素が用意されていますが、ECサイトなどの商品説明で割引を表すために元の金額に打ち消し線（取り消し線）を描く表現がしたいとき、どのようになっているのが良いかを検討します。'
ogImage: './06-10-thumb.jpg'
publishedAt: '2024-06-10T00:00:00+09:00'
updatedAt: '2026-09-07T00:00:00+09:00'
topics: [UI考察, s要素, del要素]
proficiencyLevel: 'Intermediate'
---

<!-- textlint-disable -->

![半額になったおにぎり2つの写真](./06-10-thumb.webp?w=1200&h=630)

## Web標準から考える

ブラウザCSSに打ち消し線（`text-decoration: line-through;`）が指定されている要素は`s`要素と`del`要素がある。

> The `s` element represents contents that are no longer accurate or no longer relevant.
>
> 出典：[HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element)（[日本語訳](https://momdo.github.io/html/text-level-semantics.html#the-s-element)）

いずれも文章を訂正したことを表すときに用いられる要素だが、2つの要素の大きな違いはコンテンツが文書から削除されているものであるかどうかにある。
`s`要素は、正確ではなくなった情報や関連しなくなった情報を表すものだが、Webページの一部として必要な情報であることに変わりはない。現在はこうだが昔はこうだった、という情報を表すために必要な要素だ。

> The `del` element represents a removal from the document.
>
> 出典：[HTML Living Standard](https://html.spec.whatwg.org/multipage/edits.html#the-del-element)（[日本語訳](https://momdo.github.io/html/edits.html#the-del-element)）

一方で`del`要素は文書からコンテンツが削除されたことを表すもので、修正履歴などをマークアップする際に用いられる。主に編集に関連する画面で活躍するものだ。

なお、[ARIA in HTML](https://www.w3.org/TR/2024/REC-html-aria-20240507/)（[日本語版](https://momdo.github.io/html-aria/)）を参照するといずれも暗黙のロールは削除されたコンテンツを示す「`deletion`」である。

> A deletion contains content that is marked as removed or content that is being suggested for removal. See related insertion.
>
> Deletions are typically used to either mark differences between two versions of content or to designate content suggested for removal in scenarios where multiple people are revising content.
>
> 出典：[Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/#deletion)（[日本語訳](https://momdo.github.io/wai-aria-1.2/#deletion)）

変更前の価格に打ち消し線を引きたい場合は、`s`要素を採用するのが妥当だろう。

### `s`要素のサポート状況

`s`要素は古くから存在する要素だが、アクセシビリティ・サポーテッドかどうかを確認しておく。

[Codepen: \[Markup example\] the s element](https://codepen.io/hiroya_uga/pen/YPZqZLX?tab=result)

上記の例をブラウザがどう解釈しているのかを確認してみる。

![Google Chromeのアクセシビリティツリーで「ラーメン」の部分がdeletionロールとして表示されている様子](./06-10-a11y-tree-chrome.png?w=620&h=222)

Google Chromeは「ラーメン」の部分を`deletion`ロールとして解釈している。

![Firefoxのアクセシビリティツリーで「ラーメン」の部分がdeletionロールとして表示されている様子](./06-10-a11y-tree-firefox.png?w=620&h=222)

Firefoxも同様だ。一方で、支援技術側のサポート状況は次のようになっている。

| AT                         | Google Chromeでの読み上げ内容                            |
| -------------------------- | -------------------------------------------------------- |
| Voice Over (macOS 12)      | 私は昨日、ラーメンお寿司を食べました。                   |
| Voice Over (iOS)           | 私は昨日、ラーメンお寿司を食べました。                   |
| ナレーター (Windows 10)    | 私は昨日、ラーメンお寿司を食べました。                   |
| PC-Talker NEO (Windows 10) | 私は昨日、ラーメンお寿司を食べました。                   |
| NVDA (Windows 10)          | 私は昨日、**削除マークあり**ラーメンお寿司を食べました。 |

セマンティクスとしては`s`要素を採用することが望ましいが、スクリーンリーダを利用するユーザにとって、手元で確認できる範囲ではほとんどのケースで意味がないことがわかる。ラーメンお寿司ってなんだろう。おいしいのかな。

## 実例を見てみる

一般的に価格の変更についてどのような実装になっているか、4つのWebサービスを調査してみた。金額表示部分以外については言及しないものとする。

### Amazon

[https://www.amazon.co.jp/](https://www.amazon.co.jp/)

![Amazonの商品ページで、参考価格に打ち消し線が引かれた価格表示のキャプチャ（記事執筆時点）](./06-10-amazon.jpg?w=1200&h=600)

参考価格に打ち消し線が入った見た目になっているが、参考にしていた価格としては現在も正しい情報と解釈できるので、`s`要素を採用する妥当性は低く感じる。

なお、実際の構造は以下の通りで`s`要素は採用されていない。

```html
<span>
  <span>￥147,000</span>
  <span aria-hidden="true">
    <span>￥</span>
    <span>147,000</span>
  </span>
</span>
<div>
  <span>参考:</span>
  <span>
    <span>￥161,700</span>
    <span aria-hidden="true">￥161,700</span>
  </span>
</div>
```

また、打ち消し線も`text-decoration`ではなく、疑似要素によって表現されている。

### 楽天市場

[https://www.rakuten.co.jp/](https://www.rakuten.co.jp/)

![楽天市場の商品一覧画面で、最終的な金額のみが表示されているキャプチャ（記事執筆時点）](./06-10-rakuten-01.jpg?w=1200&h=600)

![楽天市場の商品一覧画面で、商品価格・送料・獲得予定ポイントが表で表示されているキャプチャ（記事執筆時点）](./06-10-rakuten-02.jpg?w=1200&h=600)

最終的な金額のみの表示か、「商品価格＋送料−獲得予定ポイント」の表で価格が掲載されている。
セール価格の場合も同様で、通常価格や参考価格が書かれるパターンは見当たらなかった。

![楽天市場の商品詳細画面で、通常価格が打ち消し線なしで表示されているキャプチャ（記事執筆時点）](./06-10-rakuten-03.jpg?w=1200&h=600)

商品詳細画面には通常価格があるが、打ち消し線の表現はされていない。

```html
<tr>
  <td>
    <div>当店通常価格</div>
    <div>103,290</div>
    <span>
      <div>円</div>
    </span>
  </td>
</tr>
<tr>
  <td>
    <div></div>
    <span>
      <span>
        <div>92,961</div>
      </span>
      <div>円</div>
    </span>
    <span>
      <div>送料無料</div>
    </span>
  </td>
</tr>
```

### Yahoo!ショッピング

[https://shopping.yahoo.co.jp/](https://shopping.yahoo.co.jp/)

![Yahoo!ショッピングの商品一覧画面で、通常価格は表示されずセール価格のみが表示されているキャプチャ（記事執筆時点）](./06-10-yahoo-01.jpg?w=1200&h=600)

商品一覧画面では通常価格は書かれておらず、セール表示のみ。

![Yahoo!ショッピングの商品詳細画面で、メーカー希望小売価格に打ち消し線が引かれているキャプチャ（記事執筆時点）](./06-10-yahoo-02.jpg?w=1200&h=600)

商品詳細画面ではメーカー希望小売価格が表示されており、打ち消し線が表示されている。
セマンティクスは以下の通りで、`text-decoration`が用いられていた。

```html
<p>メーカー希望小売価格 45,210円</p>
```

### ZOZOTOWN

[https://zozo.jp/](https://zozo.jp/)

![ZOZOTOWNの商品一覧画面で、通常価格は表示されずセール価格のみが表示されているキャプチャ（記事執筆時点）](./06-10-zozo-01.jpg?w=1200&h=600)

商品一覧画面では通常価格は書かれておらず、セール表示のみ。

![ZOZOTOWNの商品詳細画面で、メーカー希望小売価格に打ち消し線が引かれているキャプチャ（記事執筆時点）](./06-10-zozo-02.jpg?w=1200&h=600)

商品詳細画面ではメーカー希望小売価格が表示されており、打ち消し線が表示されている。
`div`要素と`span`のみでマークアップされおり、`text-decoration`が用いられていた。

```html
<div>
  <span>¥7,920</span>
  （2024年5月27日時点の価格）
</div>
```

## 個人的なベストプラクティス

ワイヤーフレームの段階で調整ができるのであれば、素直にすべて文字列で表示するのが好みではある。こうなっていれば読み間違えることも少なく、スクリーンリーダユーザへの誤解も避けられる。また、著者がセール価格を重要だと考えるならば`strong`要素を採用できる。

[Codepen: \[Markup example\] Discount price 1](https://codepen.io/hiroya_uga/pen/NPpNpag?tab=result)

```html
<p>
  <span>通常価格：¥3,000</span>
  <strong>
    <span>セール価格（税込）：</span>
    <span>¥1,980</span>
  </strong>
</p>
```

もし元の価格に打ち消し線を引きたい場合は、`s`要素を用いずにCSSのみで表現するのが妥当だろう。打ち消し線が引かれていても「元の金額」は正確でなくなった情報**ではない**ためだ。

[Codepen: \[Markup example\] Discount price 2](https://codepen.io/hiroya_uga/pen/MYpyprG?tab=result)

```html
<p>
  通常価格：
  <span class="line-through">¥3,000</span>
  <strong>
    <span class="sr-only">セール価格</span>
    ¥1,980
  </strong>
</p>
```

もっとシンプルに「現在の金額」「元の金額」だけの表示で、且つ元の金額を打ち消し線だけで表現したい場合は、スクリーンリーダ用の文字列を設置するとよいかもしれない。

[Codepen: \[Markup example\] Discount price 3](https://codepen.io/hiroya_uga/pen/gbmrmew?tab=result)

```html
<p>
  <s>
    <span class="sr-only">価格</span>
    ¥3,000
  </s>
  <strong>
    <span class="sr-only">セール価格</span>
    ¥1,980
  </strong>
</p>
```

なお、疑似要素でこれを再現しようとするとWCAGの達成基準 [1.3.1 情報及び関係性](https://www.w3.org/TR/WCAG22/#info-and-relationships)（[日本語版](https://waic.jp/translations/WCAG22/#info-and-relationships)）に反することに注意が必要だ。

> The CSS ::before and ::after pseudo-elements specify the location of content before and after an element's document tree content. The content property, in conjunction with these pseudo-elements, specifies what is inserted. For users who need to customize style information in order to view content according to their needs, they may not be able to access the information that is inserted using CSS. Therefore, it is a failure to use these properties to insert non-decorative content.
>
> 出典：[Technique F87: Failure of Success Criterion 1.3.1 due to inserting non-decorative content by using ::before and ::after pseudo-elements and the 'content' property in CSS](https://www.w3.org/WAI/WCAG22/Techniques/failures/F87)
