---
title: "私は「本文へジャンプ」\nスキップリンクがほしい"
publishedAt: '2026-09-15T13:03:47+09:00'
topics: [アクセシビリティ, ユーザビリティ, UI]
proficiencyLevel: 'Beginner'
---

確かにHTMLさえセマンティックであれば、スクリーンリーダ利用者は共通UIを読み飛ばしてメインコンテンツへ直接アクセスできます。当たり前になってから、もうずいぶん年数も経ちました。

それを根拠に、定期的に時代遅れのいらない子として槍玉に挙げられているのを見かけるスキップリンク。

果たして、本当にそこまで否定されるべきUIなのでしょうか。

## スキップリンクとは？

スキップリンク、ジャンプリンク、コンテンツジャンプ──。  
いろいろな呼ばれ方をされながら、かつては多くのWebサイトで活躍していました。

WCAG 2.2の達成基準2.4.1 Bypass Blocksでは、複数ページに共通して登場するグローバルヘッダなどのUIをスキップできることが求められています。

> A mechanism is available to bypass blocks of content that are repeated on multiple web pages.
>
> 出典：[Understanding SC 2.4.1 Bypass Blocks (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)（[日本語訳](https://waic.jp/translations/WCAG22/Understanding/bypass-blocks.html)）

この達成基準に適合するための方法として、スキップリンクの導入は非常にポピュラーな達成方法でした。

![Google検索画面のスキップリンクのキャプチャ](./09-15-skip-link.webp?size=1200x500)

一見実装されていなさそうなページでも、読み込み直後に`Tab`キーを押下することで表示されるケースがあります。

## ブラウザの標準機能では代替できない

スキップリンクは時代遅れだという意見が強くなったのは、HTMLの進化と[支援技術](https://ja.wikipedia.org/wiki/%E6%94%AF%E6%8F%B4%E6%8A%80%E8%A1%93)によるサポートが充実した結果だと思っています。

しかし、**晴眼者であるキーボード利用者**にとってはどうでしょう。

Chrome・Safari・Firefoxのいずれも、スクリーンリーダなしで`main`要素などのランドマークへジャンプする機能は実装されていません[^記事執筆時点]。現状ではブラウザ拡張を利用するしかありません。

[^記事執筆時点]: 2026年09月15日現在。

> They are, however, only beneficial for users who have ways of navigating with this information. For example, adding headings to a document will only help users who can “jump” from heading to heading (such a possibility can be provided by browsers, browsers plugins, screen readers, or other assistive technologies). Techniques and solutions based on links will benefit all users (for example, sighted keyboard users with no other assistive technology) and are therefore recommended.
>
> 出典：[Bypass Blocks of Repeated Content[proposed] | ACT Rule | WAI | W3C](https://www.w3.org/WAI/standards-guidelines/act/rules/cf77f2/proposed/)

ACT規則[^act]をみてみると、`main`要素のようなランドマークがあれば2.4.1は適合となりますが、重要な補足情報も添えられています。

[^act]: ACTはW3C-WAIの「Accessibility Conformance Testing」ルール群。達成基準ごとにテストの合否判定手順を標準化し、ツール間で結果を揃える目的で策定された。

ランドマーク要素があること自体は、スクリーンリーダ利用者など「特定のユーザにしか有益ではない」ため、リンクを使ったソリューションは現在も推奨とされているのです。

## だからスキップリンクをつけろ、という話ではない

WCAGの達成基準を気にしたり、コントラスト比を気にしたり、スクリーンリーダで利用できるかどうかを気にしたりする意見は多く見かけます。一方で、本当にそれは使いやすいのか考えることを忘れてしまっている瞬間がないでしょうか。

そのUIがあることで、誰かが助かっているのか。逆に誰かにとって不利になっていないか。

要件はWebコンテンツによってさまざまだと思います。しかしながら、誰にとっても使いやすいこと自体が要件と衝突することはないでしょう[^使いやすさ？]。

[^使いやすさ？]: ビジネスの都合上、使いやすすぎたら困っちゃうケースの話は除外。ここでの「使いやすいこと」とは知覚可能性、操作可能性、理解可能性、堅牢性に限った話。

とくにフロントエンドの領域を担当しているならば、1人でも多くのユーザが使える品質を目指す職責を担っているはず。

ポインティングデバイスが使えない場合や、視覚情報が使えない場合などを想定して、実際に世に出す前のWebコンテンツを操作してみるだけでいいんです。そうすれば、途方もなく長い共通ヘッダやグローバルナビゲーションをタブキーで進んでいかなければいけない現実に直面するかもしれません。

その時に、本当に必要がないならスキップリンクをオミットすればいいし、必要だと感じたなら実装すればいい。

```html:TailwindCSS V4での簡単な実装イメージ
<body>
    <p class="not-focus-within:sr-only focus-within:fixed left-0 top-0 z-50 bg-white">
      <a href="#main">本文へジャンプ</a>
    </p>

    <header></header>
    <main id="main" tabindex="-1">本文</main>
    <footer></footer>
</body>
```

TailwindCSSを導入しているなら、たったこれだけでおしまい。

もしも、あなたの関わるプロダクトのメインコンテンツまでの道のりが長いならば、スキップリンクを実装してほしいと思っているユーザがここに一人いますよ。

## 参考資料

[Codepen: [Example] Skip Link](https://codepen.io/hiroya_uga/pen/yyMVyee?tab=result)

- [I want landmark navigation to be implemented natively in the browsers · WebWeWant/webwewant.fyi · Discussion #63](https://github.com/WebWeWant/webwewant.fyi/discussions/63)
- [Nascent Proposal: keyboard navigation of headings and HTML5 ‘landmark’ elements](https://discourse.wicg.io/t/nascent-proposal-keyboard-navigation-of-headings-and-html5-landmark-elements/948/)
- [Improving access to landmark navigation - TPGi — a Vispero company (web.archive.org)](https://web.archive.org/web/20250927025310/https://www.tpgi.com/improving-access-to-landmark-navigation/)
- [スクリーンリーダーを併用しなくてもランドマーク間の移動 (ユーザ操作) を可能にする「Landmarks」 | Accessible & Usable](https://accessible-usable.net/2017/06/entry_170612.html)
