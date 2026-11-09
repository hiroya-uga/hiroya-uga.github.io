---
title: "一部のUIが\n`appearance: base;`時は\n`cursor: pointer;`になる"
publishedAt: '2026-11-08T21:20:00+09:00'
topics: [Web標準, UI]
proficiencyLevel: 'Beginner'
---

<!-- textlint-disable ja-technical-writing/ja-no-weak-phrase -->

[リンクでないUIならば、カーソルを指ポインタにするべきではない。](/articles/tech-blog/2026/11-09-css-cursor-pointer-01)という記事を書いている最中に、こんなニュースが飛び込んできました。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The debate is over, and evil has won.

`cursor: pointer` now means clickable.

RIP my ability to tell whether ⌘-clicking something will open it in a new window.

https://t.co/zy9qGHxeVI</p>&mdash; Haz (@diegohaz) <a href="https://x.com/diegohaz/status/2117248983168942488?ref_src=twsrc%5Etfw">November 2, 2026</a></blockquote>

<script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

<!-- textlint-disable sentence-length, ja-technical-writing/sentence-length -->

フォーム関連要素の見た目を、CSSでカスタマイズしやすくするための仕組み「`appearance: base;`」に関する議論の中で、次の要素に`appearance: base;`を指定したときのデフォルトが`pointer`になるとのことです。

<!-- textlint-enable sentence-length, ja-technical-writing/sentence-length -->

```css
select,
option,
input[type='checkbox'],
input[type='radio'],
button,
input[type='button'],
input[type='submit'],
input[type='reset'],
input[type='color'],
input[type='image'],
::file-selector-button {
  cursor: pointer;
}
```

途中までは、`cursor: default;`を採用する方向で決議されていましたが、10月21日に方針が変更されたようです。記事の叩きを書いたのは10月17日でしたので、超絶タイムリーな変更です。

時系列としては以下の通り。

フォーム関連要素における`appearance: base;`指定時のカーソルの振る舞いについての議論：

| 日付     | 決議・議論                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 26.07.31 | `button`と`select`に`default`を提案<br>[w3c/csswg-drafts#14251](https://github.com/w3c/csswg-drafts/issues/14251)                                             |
| 26.09.02 | 無効なフォーム部品に`not-allowed`を指定<br>[#issuecomment-5512419301](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-5512419301)               |
| 26.09.09 | `button`や`select`などに`default`を指定する方向で決議<br>[#issuecomment-5606178556](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-5606178556) |
| 26.10.21 | `pointer`を指定するよう方針転換<br>[#issuecomment-6322899089](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-6322899089)                       |

方針転換のきっかけは、9月9日に報告されたデザインシステムの調査結果でした。最終的には「`pointer`はクリックできることを示す手がかりになる」という主張が支持され、決議に至ったようです。

## デザインシステムが採用していることは、そこまで強い根拠になるのか？

9月9日の会議では、カーソルを指定している33のデザインシステムのうち27が`pointer`を採用しており、ブラウザの標準は少数派であると[報告](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-5596376115)されていました。

しかし筆者は、これがそこまで強い根拠になるのかどうか懐疑的です。デザインシステムでの採用状況は、あくまでもデザインシステムでの採用状況でしかなく、Web全体からするとわずかな領域に感じます。

それぞれのデザインシステムが、ユーザテストを経てリンク以外でも指ポインタを採用するべきだと判断したのか、そうでないのかも明らかにされていません。

Issueの中でも、colmtuite氏によって次のような指摘がされています。

> The prevalence of these conventions across design systems is not compelling evidence for adopting them as browser defaults. It tells us what authors (both human + agent) commonly choose, but not what produces the best user experience.
> 出典：[[css-forms-1] Cursors for base appearance · Issue #14251 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-6592600931)

さらに10月21日の会議では、調査対象のデザインシステムを増やして見直したところ、`default`と`pointer`がおよそ半々に分かれたという発言もありました。

> nsull: When I went back to look, especially when I added more design systems  
> ... split 50/50 between 'default' and 'pointer'  
> nsull: 'pointer' \*is\* overwhemlingly provided by npm modules  
> nsull: but design systems like Bootstrap/Tailwind is morelike 60/40 in favor of default
> 出典：[css-meeting-botによるコメント（The full IRC log of that discussion） - w3c/csswg-drafts#14251](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-6322899089)

npmで配布されているモジュールでは`pointer`が圧倒的に多い一方、BootstrapやTailwindのようなデザインシステムでは60対40で`default`のほうが優勢だったようです。

だと言うのに、どうしてそんなに指ポインタがいいんでしょうか…。

## それでも、CSSWGの決定は受け入れよう

[リンクでないUIならば、カーソルを指ポインタにするべきではない。](/articles/tech-blog/2026/11-09-css-cursor-pointer-01)の記事内で紹介しているCodePenには含めませんでしたが、実はすでにリンクでなくても指ポインタになる例外が存在します。

当時の状況を考えると、画像で表現されたボタンの多くが押せると認識しづらかったためでしょうか。`input[type="image"]`は送信ボタンとして振る舞うにもかかわらず、たいていのブラウザCSSでは指ポインタになります。

[[Example] Default value of cursor (with input[type="image"])](https://codepen.io/hiroya_uga/pen/pveGzPL?tab=result)

今あるものから最善を目指し、さまざまな意見を総合して仕様を決め、進化していく。そういった側面も含めて、筆者はWebというテクノロジーを素晴らしいものだと思っています。

誤字がそのまま生き残っていたり、命名規則が他とズレていたり。Webとは、そういうものなのです。

いつかこの決定が、Webの体験をより素晴らしいものにしてくれることを願って、本方針を受け入れようと思います。

## 余談1：「してもいい」であって「しなければならない」ではない

今回の決議は、ブラウザが標準で適用するスタイル（UAスタイルシート）を決めるものです。

クリック可能なフォーム関連要素が`appearance: base;`で`cursor: pointer;`になるからといって、開発者は`pointer`を採用しなければならない、というわけではありません。

最終的にカーソルをどう表現するかは、「ブラウザの外にあるOSやアプリケーションのUIと操作感を揃えたい」といった、Webデザイナーの意図によって決められてよいはずです。

今回の決議は、リンク以外のクリック可能なUIも指ポインタに「してもいいこと」を明確にしたものであって、「するべき」でも「しなければならない」でもない話だと筆者は理解しています。人によっては画面遷移を伴う場合は指ポインタ、という使い分けをするかもしれません。

よって、当サイトでは引き続き「リンクならば指ポインタ」という従来の整理を維持したいと思います。

## 余談2：`cursor`の仕様を拡張してくれません？

そもそも、リンクなのか別窓で開くリンクなのか、ボタンなのかがわかるように、UA側で教えてくれればよいのではないでしょうか。`pointer`だけだからおかしくなるのであって、`default`と`progress`の見た目の違いのように、指ポインタの横にもう1つアイコンを付けたらいいだけな気もします[^cursor]。

[^cursor]: `cursor: url()`で同様の表現が実現できるが、そういうことじゃないねん。

先ほど紹介したHaz氏（diegohaz氏）もIssueで同じような趣旨のことを述べていますが、筆者も本当にそう思います。

<!-- textlint-disable sentence-length, ja-technical-writing/sentence-length -->

![Issueの画面キャプチャ。diegohaz氏がmacOS風とWindows風の指ポインタそれぞれについて、右下に鎖のアイコンを添えたリンク用カーソルと、別窓で開く矢印のアイコンを添えた外部リンク用カーソルの案を画像で示している様子。](./11-09-css-cursor-pointer-02/01.webp?size=1200x798)

<!-- textlint-enable sentence-length, ja-technical-writing/sentence-length -->

→ [diegohaz氏のコメント - w3c/csswg-drafts#14251](https://github.com/w3c/csswg-drafts/issues/14251#issuecomment-6598105940)

## 余談3：フォーム関連要素以外はどうするんだろう

`summary`要素とか`[tabindex]:not([tabindex="-1"])`とかも、どうにかなって`pointer`に揃う未来があるのでしょうか。

フォーム関連要素のスタイリングを扱う仕様の議論なので対象外なのかもしれませんが、Issueを読んだ限りでは、`summary`要素や`details`要素への言及は見当たりませんでした。

こうなったら、フォーム関連要素とそれ以外のマウス操作ができる要素で表現を分ける必要はないはずなので、この辺りのチグハグがどう解決されていくのか、とても気になります。
