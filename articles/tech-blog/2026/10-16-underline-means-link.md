---
title: "下線を持つUIは\nすべてリンクなのか？"
publishedAt: '2026-10-16T12:34:11+09:00'
topics: [UI, アクセシビリティ, ユーザビリティ, ビジュアルデザイン, CSS]
proficiencyLevel: 'Beginner'
---

筆者は、そうあってほしい。

---

Webを構成する基本的な要素は、文書とリンクです。Web誕生当時、そのリンクを識別するために考えられた方法が「下線」でした[^始祖]。現在もCSSで無効化しない限り、多くのWebブラウザでリンクには下線が表示されます。

[^始祖]: [Why are hyperlinks blue? - Mozilla](https://blog.mozilla.org/en/internet-culture/deep-dives/why-are-hyperlinks-blue/)によると、Tim Berners-Leeが作った最初のブラウザ「WorldWideWeb」は白黒表示で、リンクには下線がついていた。なお、同記事は1987年としているが、このブラウザが書かれたのは[Tim Berners-Lee本人の説明](https://www.w3.org/People/Berners-Lee/WorldWideWeb.html)では1990年。

![ブラウザのウィンドウ内にある文中のテキストリンク「TextLink」に下線がついており、その部分が拡大されているイメージ図（ChatGPTで生成）](./10-16-underline-means-link/01.webp?size=1200x800)

かつて、Googleの検索結果のリンクから下線が外れたとき、ちょっとした混乱が起きたのを覚えています[^google検索]。当時はそれくらい、下線がリンクを見分ける重要な手がかりとして受け止められていたのでしょう。

<!-- textlint-disable ja-technical-writing/sentence-length -->

[^google検索]: 2014年3月にGoogleが検索結果のリンクから下線を外した際、反応は分かれた（参考記事：[End of an era: Google no longer underlining hyperlinks in search - Los Angeles Times](https://www.latimes.com/business/technology/la-fi-tn-google-search-no-underlining-hyperlinks-20140313-story.html)、[I Don’t Care What Google Did, Just Keep Underlining Links](https://adrianroselli.com/2014/03/i-dont-care-what-google-did-just-keep.html)）。[MozillaZine日本語版のフォーラム](https://forums.mozillazine.jp/viewtopic.php?f=2&t=14654)には同月5日、Firefoxだけで下線が消えたとの相談がある。また、同時期の議論には[On Link Underlines](https://adrianroselli.com/2016/06/on-link-underlines.html)などもある。

<!-- textlint-enable ja-technical-writing/sentence-length -->

逆にリンク以外についてはどうでしょう。古い記事ですが、Adobe Blogの「[ユーザー体験を向上させるテキストの下線の使い方](https://blog.adobe.com/jp/publish/2017/12/25/web-use-underline-text-improve-ux)」では、次のように紹介されています。

> ### リンク以外のテキストに下線を付けない
>
> リンク以外のテキストに下線を付けるべきではありません。たとえリンクに下線を付けないデザインだとしてもです。下線は、クリック可能という認識を強く与えるため、その期待に合わないとユーザーの混乱や不満の元になります。単語や語句を強調したければ、太字等を使用する方がずっと安全です。
> 出典：Adobe Blog [ユーザー体験を向上させるテキストの下線の使い方](https://blog.adobe.com/jp/publish/2017/12/25/web-use-underline-text-improve-ux#:~:text=%E3%81%A7%E3%81%AF%E3%81%82%E3%82%8A%E3%81%BE%E3%81%9B%E3%82%93%E3%80%82-,%E3%83%AA%E3%83%B3%E3%82%AF%E4%BB%A5%E5%A4%96%E3%81%AE%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%AB%E4%B8%8B%E7%B7%9A%E3%82%92%E4%BB%98%E3%81%91%E3%81%AA%E3%81%84,-%E3%83%AA%E3%83%B3%E3%82%AF%E4%BB%A5%E5%A4%96%E3%81%AE)

まさしく筆者の考え方がそのまま書かれているわけですが、この認識は2026年現在でも一般的なのでしょうか。

## リンク以外で下線が引かれているUIを探してみる

リンクにおける下線の有無に揺れはありますが、WebコンテンツであれOSであれ、*リンクではないUI*に下線がついているものは、探した限りだと見つけられませんでした[^例外]。

[^例外]: `abbr`要素による点線下線などは例外。基本的には`text-decoration`に注目しています。

### Webサイト

例としていくつかの行政のWebサイトなどを見てみると、下線がついているのは一貫してテキストリンクです。

- [総務省](https://www.soumu.go.jp/)
- [デジタル庁](https://www.digital.go.jp/)
- [東京都庁](https://www.metro.tokyo.lg.jp/)

Google検索では前述の通り下線が使われていませんが、下線が採用されているUI自体がなさそうです。

![Google検索のキャプチャ。リンクには下線がついていない。](./10-16-underline-means-link/02.webp?size=1200x512)

ただし、ページネーションはマウスホバーすることで下線が出る模様。

![Google検索のページネーションUIで「9」にマウスホバーしている様子。](./10-16-underline-means-link/03.webp?size=1281x222)

### Google Chrome

ソフトウェアはどうかということで、手始めにブラウザのUIを見てみます。たとえば、Google Chromeの設定画面はどうなっているでしょうか。

![Google Chromeの検索エンジン設定画面のキャプチャ（バージョン 155）。仕組み上WebのUIではあるが、テキストリンクには下線がついている代表的なソフトウェア。](./10-16-underline-means-link/04.webp?size=1980x826)

説明文の末尾にある「詳細」には下線がついており、クリックすると[Google Chrome Help](https://support.google.com/chrome?p=settings_omnibox)が開くリンクになっています。他の画面も同様に、下線がリンクかどうかの手がかりになっているように見えます。

### Adobe Photoshop

環境設定を覗いてみると、こちらもリンクにのみ下線が付いています。

![Adobe Photoshopの環境設定、インターフェースのキャプチャ。「ニュートラルカラーモードの詳細」のテキストリンクにだけ下線があり、ほかのUIに下線はない。](./10-16-underline-means-link/05.webp?size=2108x1412)

「[ニュートラルカラーモードの詳細](https://helpx.adobe.com/jp/photoshop/desktop/get-started/settings-and-preferences/adjust-preferences.html#neutral-color-mode)」へのリンクは下線を持っていますが、それ以外のUIは下線を持っていません。

### Windows 11

OSレベルになるとどうでしょうか。  
WindowsのUIをいくつか確認してみます。

![Windowsのコントロールパネルのキャプチャ。「システムとセキュリティ」にマウスホバーしている様子。](./10-16-underline-means-link/06.webp?size=1125x634)

![Windowsのシステム詳細設定のキャプチャ。「ヘルプを表示」にマウスホバーしている様子。](./10-16-underline-means-link/07.webp?size=1202x934)

古くからあるコントロールパネルではホバーで下線がつきますが、比較的新しい設定アプリの中のリンクは、マウスホバーをしても下線がつきません。Windows内部ではすべてのリンクに下線がついていると思っていたのですが、どうやらそうはなっていないようです。

とはいえ「リンクではないのに下線を持っているUI」は見当たりません。

### macOS Tahoe

macOSも場所によって揺れていて、一貫した整理にはなっていないようですが、少なくとも下線がついているものはリンクでした。

![macOSのシステム設定、一般→情報のキャプチャ。最下部の4つのリンクに下線がついており、「ディスプレイ設定…」などのボタンにはない。](./10-16-underline-means-link/08.webp?size=1446x940)

![macOSのシステム設定、Spotlightのキャプチャ。説明文の末尾にある「検索とプライバシーについて…」のリンクは青色だが、下線がない。](./10-16-underline-means-link/09.webp?size=1446x940)

「一般」→「情報」の最下部にあるリンクには下線があります。一方、Spotlightのリンクにはなく、ユーザガイドのリンクはマウスホバー時に下線がつくようです。

![macOSのユーザガイドのキャプチャ。「会話の音声とコンピュータのオーディオを字幕にする」にマウスホバーしている様子。](./10-16-underline-means-link/10.webp?size=1936x1430)

## 下線を付けるべき、付けないべきシチュエーション

リンクではないUIは下線を持たない。今回確認した範囲では、現在でもこの原則はある程度守られていました。

余談ですが、下線がない*文中の*テキストリンクもよく見かけます。それについては下線を付けたほうが良いでしょう。

![Googleプライバシーポリシーのキャプチャ。文中のテキストリンクには下線がついている。](./10-16-underline-means-link/11.webp?size=1200x512)

グローバルナビゲーションや検索結果一覧では、リンクが並んでいることが、UIの見た目や文脈から判断しやすいです。一方、文中のテキストだとそうとは限りません。

WCAG 2.2の[1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)では、情報の区別が色だけに頼った見た目であってはならないとされており[^コントラスト]、下線がないリンクはこの達成基準を満たすことが難しくなっています。

[^コントラスト]: リンクの文字色と周囲の本文の文字色とのコントラスト比が3:1以上あれば、色相だけでなく明度差でもリンクを識別できるため、1.4.1を満たす方法として十分である（[G183](https://www.w3.org/WAI/WCAG22/Techniques/general/G183.html)）。ただし、下線などの手がかりがホバー時やフォーカス時にしか現れない場合は、1.4.1を満たさない（[F73](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73.html)）。筆者は、色の組み合わせごとに3:1を確認するより、常に下線を付ける方がデザインシステムの運用コストを抑えやすいと考える。

## 結論

長々と書きましたが、本記事における筆者の主張は1つです。

「**リンクではないUIに下線を付けるべきではない**」

非リンクUIへ下線を求められて悩んでいる方にとって、本記事が議論の根拠として助けになれば幸いです。

## 参考文献

- [ユーザー体験を向上させるテキストの下線の使い方](https://blog.adobe.com/jp/publish/2017/12/25/web-use-underline-text-improve-ux)
- [アンダーラインと可読性：リンクをどのようにデザインするか？ - ポップインサイト](https://popinsight.jp/blog/?p=56533)
- [Understanding SC 1.4.1: Use of Color | WAI | W3C](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [G183: Using a contrast ratio of at least 3:1 to distinguish inline text links from surrounding text | WAI | W3C](https://www.w3.org/WAI/WCAG22/Techniques/general/G183.html)
- [F73: Failure of Success Criterion 1.4.1 due to creating links that are not visually evident without color vision | WAI | W3C](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73.html)
- [Guidelines for Visualizing Links - NN/g](https://www.nngroup.com/articles/guidelines-for-visualizing-links)
- [Why are hyperlinks blue? - Mozilla](https://blog.mozilla.org/en/internet-culture/deep-dives/why-are-hyperlinks-blue/)
- [On Link Underlines - Adrian Roselli](https://adrianroselli.com/2016/06/on-link-underlines.html)
- [I Don’t Care What Google Did, Just Keep Underlining Links - Adrian Roselli](https://adrianroselli.com/2014/03/i-dont-care-what-google-did-just-keep.html)
