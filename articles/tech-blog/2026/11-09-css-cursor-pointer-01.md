---
title: "リンクでないUIならば、\nカーソルを指ポインタに\nするべきではない。"
ogImage: './11-09-css-cursor-pointer-01/thumb.jpg'
ogImageGenerate: false
publishedAt: '2026-11-08T21:19:00+09:00'
topics: [Web標準, UI, ユーザビリティ, ビジュアルデザイン]
proficiencyLevel: 'Beginner'
---

<!-- textlint-disable ja-technical-writing/ja-no-weak-phrase -->

⚠️ **そのはずでした。** しかし、執筆している間に話が変わってしまったかもしれません。

詳細：[一部のUIが`appearance: base;`時は`cursor: pointer;`になる](/articles/tech-blog/2026/11-09-css-cursor-pointer-02)

---

クリックできるUIならば、すべてカーソルは「指ポインタ」になる。世の中には、そういった考え方があるようです。

「指ポインタ」または「指カーソル」とは、右の手のひらを下に向けてから、拳を握って人差し指だけ伸ばした形をしているアレのことを指します。

<!-- textlint-disable sentence-length, ja-technical-writing/sentence-length -->

![上段は、カード、ボタン、テキストリンクの上ですべて指ポインタになっている図。下段は、カード内のハートボタン、ボタン、下線付きでリンクのように見える「Submit」ボタンの上で、矢印ポインタのままになっている図](./11-09-css-cursor-pointer-01/01.webp?size=1200x798)

<!-- textlint-enable sentence-length, ja-technical-writing/sentence-length -->

筆者は「クリックできるからといって、なんでもかんでも指ポインタを採用するべきではない」と考えています。具体的には、`button`要素などに`cursor: pointer;`を指定するべきではない、ということですね。

## そもそも、`cursor: pointer;`とは何か？

UI関連のCSSプロパティを定めるCSSの仕様「[CSS Basic User Interface Module Level 3](https://www.w3.org/TR/css-ui-3/)」では、指ポインタについて「リンクであることを示す」と説明されています。

> <dl><dt><dfn>pointer</dfn></dt><dd>The cursor is a pointer that indicates a link.</dd></dl>
> 出典：[§ 6.1.1.1. Predefined Cursors CSS Basic User Interface Module Level 3](https://www.w3.org/TR/css-ui-3/#valdef-cursor-pointer)

大抵のブラウザでも意図的に変更しない限り、マウスホバー時にカーソルが指ポインタになるのは、ハイパーリンクくらいです。

ここに、クリックできる要素をいくつかならべた、プレーンなHTMLを用意しました。今マウスカーソルを動かせる方は、ぜひカーソルをそれぞれの要素の上に乗せてみてください。

[[Example] Default value of cursor](https://codepen.io/hiroya_uga/pen/EaWGbWK?tab=result)

<!-- textlint-disable sentence-length, ja-technical-writing/sentence-length -->

なお、Adam Silver氏の記事「[Buttons shouldn’t have a hand cursor part 2](https://adamsilver.io/blog/buttons-shouldnt-have-a-hand-cursor-part-2/#:~:text=It%20first%20appeared%20in%20Apple%E2%80%99s%20HyperCard%20in%201987.%20It%20was%20used%20to%20signify%20things%20you%20can%20click.%20When%20the%20Internet%20came%20along%2C%20Mosaic%20used%20the%20pointer%20cursor%20just%20for%20links.)」によると、Mosaic時代からリンクでのみ指ポインタを使うようになったと紹介されています。

<!-- textlint-enable sentence-length, ja-technical-writing/sentence-length -->

## 操作できることを伝えるのは、`cursor`ではない

「指ポインタにならないと、押せるのかどうかわからないじゃん！」

はたして本当にそうでしょうか？

![さまざまなクリック可能なUIのサンプルが並んでいるイメージ図](./11-09-css-cursor-pointer-01/02.webp?size=1200x630)

実際に、視覚情報を頼りにしているスマートフォンなどのタッチデバイス利用者は、カーソルがなくてもUIが操作できることを理解できています。「操作できる」ということは、UIに添えられたテキストや、配置・形状などのシグニファイア[^シグニファイア]によって示されます。

[^シグニファイア]: 可能な行為（アフォーダンス）の存在を、人に知覚させるための手がかりのこと。ボタンの枠線や影、リンクの下線、「送信」といったラベルなど。

もし指ポインタがクリックできることを示すために必要ならば、タッチデバイスは成立しなくなるように思います。

つまり、カーソルの形状に頼らなければUIがクリックできるかわかりづらい場合、デザインを改善する必要があるはずです。

実際のところ普段PCを使っているみなさんも、ブラウザの外では指ポインタに頼らずUIが操作できることを認識できているのではないでしょうか。

それが、デザインが機能している状態だと筆者は考えています。

### 全部を指ポインタにしたら誰か困るの？

カーソルの形状でリンクとボタンを区別しているユーザにとっては、普段やっていることができないわけですから、単純に不便でしょう。

カーソルを合わせるたびに、画面左下にURLがでるかを気にしないといけないのはストレスかもしれません。

![テキストリンクに指ポインタを合わせると、画面左下にURLが表示されるブラウザのイメージ図](./11-09-css-cursor-pointer-01/03.webp?size=1200x798)

こうした話をすると、そういうのは「リテラシーの高い、**一部のユーザ**だけの問題だ」と言われることがあります。なぜ、一部のユーザを犠牲にしてシグニファイアを整えない道を選ぼうとするのでしょうか。筆者は理解に苦しみます。

<!-- textlint-disable jtf-style/1.1.2.見出し -->

## なぜ、仕様がそうなっているのかを考えてほしい。

<!-- textlint-enable jtf-style/1.1.2.見出し -->

本質的には「リンクであること」がカーソルの形状だけで理解できればよいので、すべてを指ポインタにした上で、独自のカーソル変化でそれをポインティングデバイス利用者に通知する道もあります。

しかし、これまで整っていた「リンクならば指ポインタ」という整理を乱してまで、新しい表現を採用するにはかなり強い動機とユーザへのメリットを揃える必要があるでしょう。

ユーザ環境の多様化からかもしれないですが、昨今、古くからあるこうしたUIの慣例が徐々に薄まってきているように感じています。タッチデバイスが当たり前になり、「マウスホバー」について考える機会が減っていたりするのでしょうか。

職種にかかわらず、クリックできるUIをひとまとまりに「クリックできるUI」と認識している方も増えてきている印象です。

ビジュアルデザインを整えて、開発者も素直にCSSを書いていれば、こうした議論に悩む必要はないはずですし、OSのUIとも操作感の一貫性を保つことができます。

仕様に則ってHTMLを書くだけでアクセシビリティが向上するように、リンクではないなら指ポインタを採用しない。それだけで、UIは洗練されていくはずです。

---

よかったら、みなさんのプロダクトも含めて、世の中のカーソルがどう実装されているか、シグニファイアが十分かどうかをチェックしてみてください。

## 参考文献

- [Buttons shouldn’t have a hand cursor | by Adam Silver | Simple = Human | Medium](https://medium.com/simple-human/buttons-shouldnt-have-a-hand-cursor-b11e99ca374b)
- [Buttons shouldn’t have a hand cursor part 2 - Adam Silver](https://adamsilver.io/blog/buttons-shouldnt-have-a-hand-cursor-part-2/)
- [Revisiting Buttons and Cursors](https://www.abeautifulsite.net/posts/revisiting-buttons-and-cursors)
