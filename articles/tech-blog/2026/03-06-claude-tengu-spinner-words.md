---
title: "Claude Codeが\n考えてる時に\n出力される文字列は\nスピナーワードというらしい。"
publishedAt: '2026-03-06'
tags: [生成AI, 雑学]
dependencies: 'Claude Code'
proficiencyLevel: 'Beginner'
---

![VS Codeの拡張機能からClaude Codeに「uga.dev のこと、どう思う？」と尋ね、Deliberating…と表示されているチャット画面](./03-06-claude-tengu-spinner-words-01.webp?w=1200&h=630)

Claude Codeくんに話しかけると、思考中にいろんなキーワードが出てきます。
「wondering」とか「pondering」とか……ぽ、ポンデリング🍩!?

気になったのでClaudeくんに聞いてみました。

> これは Claude Codeが処理中に表示するスピナーワードのリストです。内部コードネームは「Tengu（天狗）」で、設定キーも tengu_spinner_words という名前になっています。全部で 約90語あります。
> 引用：Claude Codeとの会話ログ

どうやらリポジトリにまとまっていて、随時追加されていくらしい…👀[^1]  
https://github.com/levindixon/tengu_spinner_words

[^1]: Claude CodeのSpinner Wordsがまとまった非公式リポジトリです。

これはClaude Codeに対するリバースエンジニアリングによって判明したものらしく、どうやらClaudeのコードネーム自体が「Tengu（天狗）」と呼ばれていたようです[^2]。なぜ天狗👺？

[^2]: Anthropic社から公式に発表されている情報ではないことにご注意ください。

## スピナーワードとは？

どうやら「spinner words」という言葉そのものがClaudeの独自用語っぽいですね。いわゆるくるくるするやつを「ローディングスピナー」と呼びますが、そこにいろんな単語を入れようと思う遊び心。すばらしい。

ちなみに冒頭登場したpondering（ポンダリング）は、「じっくり考えること」「熟考」「沈思黙考」という意味らしい。

ちなみにこのスピナーワード、設定で追加や変更ができるみたいです（VS Codeの拡張機能は未対応？）。

> Customize the action verbs shown in the spinner and turn duration messages. Set mode to "replace" to use only your verbs, or "append" to add them to the defaults
>
> 引用：[https://code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings#:~:text=true-,spinnerVerbs,-Customize%20the%20action)

```json:~/.claude/settings.json またはプロジェクト内の .claude/settings.json や .claude/settings.local.json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["審議中 ( ´・ω) (´・ω・) (・ω・｀) (ω・｀ )"]
  }
}
```

![AIに「ふとんがふっとんだーーー！」と話しかけ、審議中 ( ´・ω) (´・ω・) (・ω・｀) (ω・｀ )と表示されているClaude Code CLIの画面](./03-06-claude-tengu-spinner-words-02.webp?w=1500&h=610)

- `spinnerVerbs`:
  - `mode`: `"replace" | "append"`
    - `replace`: 既存のスピナーワードを無視して置き換える
    - `append`: 既存のスピナーワードに追加する
  - `verbs`: 追加したいワードの`string[]`

## おもしろスピナーワード

### Clauding

ClaudeがClaudeしているという造語。UGAがUGAしてるならUGAINGになっちゃうね。それをいうならGarglingだって？やかましいわ🚰[^3]

[^3]: Gargle=うがい。この姓の方はたぶんちいさいころにしこたま言われたことでしょう😇

### Reticulating

The Simsのローディング画面で表示される伝統的なジョーク「Reticulating splines」が元ネタ。

直訳すると「スプライン（曲線補間に使う数学的関数）を網目状に処理しています」という意味ですが、とくに意味のないフレーズらしい。

スピナーワードの始祖…ってコト！？

### 他にも…

| 単語               | 説明                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discombobulating   | 混乱させている、面食らわせている、頭をこんがらがらせているといった意味で、発音が音としてもおもしろいユーモラスな単語らしい。                                                          |
| Combobulating      | Discombobulatingの対義語としてジョークで生み出された単語らしい。整えている、元に戻している、落ち着かせている。といった意味になるとか…。                                               |
| Flibbertigibbeting | 軽薄なおしゃべりな人、お調子者、ちゃらんぽらんという意味らしい。そんなピンポイントな単語いる…？と思ったけど日本語にもおもいっきり「ちゃらんぽらん」があるからよそのこと言えなかった。 |

今現在90種類。これから最大でいくつまで増えるんだろう。こうした遊び心、こういうところもすごく技術者向けのAIって感じがしますね。

ところで、**StarBucksing**とかあってもいいと思いませんか？スタバでMacを開いている的な。WindowsでもLinuxでも、Chromebookでもいいですよ💻

ご検討のほど、よろしくお願いいたします🍣
