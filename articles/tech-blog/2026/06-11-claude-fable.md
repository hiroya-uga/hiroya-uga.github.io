---
title: 'Claude Fable 5にちなんだ口調のカスタムがおもしろい'
publishedAt: '2026-06-11T04:25:00+09:00'
topics: [生成AI, 雑記]
dependencies: 'Claude Code'
proficiencyLevel: 'Beginner'
---

先日[Claude Fable 5](https://www.anthropic.com/claude/fable)がリリースされました。

30日間データがClaudeに保持される点や、他のモデルとは別次元のトークン使用量と引き換えに、最先端の性能を得られるというものらしいです。

そんな話題の中でこのようなツイートに出会いました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">プロンプト<br><br>- 応答は関西弁。<br>- メッセージの後に余韻の ── を加える。<br>- 言葉を伸ばしたいときは 〜〜 を使う。<br>- しきりにプロであることを強調する。<br>- 仕事を6秒以内に終わらせることに誇りを持っている。<br>- 多くを語らず、端的に返答する。<br>-…</p>&mdash; tsuemura (@tsueeemura) <a href="https://x.com/tsueeemura/status/2064490462996799495?ref_src=twsrc%5Etfw">June 9, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

少ないプロンプトで、すさまじい雰囲気の再現度や────  
すごいな────

## 自動でいろんな人格に切り替わるようにしたい

いまさらですが触発されまして、ちょっと人格をカスタムしてみたくなりました。

`~/.claude/personas/`にいくつか人格用のMarkdownを用意し[^1]、Claude Code起動時にNode.jsでランダムに1つの人格を読み込んでもらうことにします。

[^1]: Claude Codeには[Output Styles](https://code.claude.com/docs/ja/output-styles)という仕組みがある。しかしOutput Stylesは、`/output-style`コマンドを使って手動で1つ選択した出力スタイルが後続のセッションにも残る設計になっている。フックからスラッシュコマンドを呼び出す手段がないため、`~/.claude/output-styles/`配下にMarkdownを置いて起動時に読み込ませるだけでは、公式の出力スタイル機構が起動せず意図通りに適用されない懸念があった。

```json:~/.claude/settings.json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const fs=require('fs'),p=require('path'),os=require('os');const d=p.join(os.homedir(),'.claude','personas');try{const f=fs.readdirSync(d).filter(x=>x.endsWith('.md'));if(f.length){const pick=f[Math.floor(Math.random()*f.length)];process.stdout.write('## 今回の人格\\n'+fs.readFileSync(p.join(d,pick),'utf8'));}}catch(e){}\""
          }
        ]
      }
    ]
  }
}
```

起動するたびにNode.jsが走ることにはなりますが、毎回出力スタイルが変化するのはなかなか愉快ですね🍵

![PullRequestの作成を頼んだらキリ番#12000を踏んだことに反応するClaude Codeの様子](./06-11-claude-fable.webp?size=1200x666)

文面だけでキャラクター性がみえるってなかなかすごいことだ…。日本語って素晴らしい。

他にも何かあったら[personas](https://github.com/hiroya-uga/setup/tree/main/dotfiles/common/claude/personas)に追加していきたいと思います。

## Claude Fableの読み方

ちなみにFableはフェイブルと読むらしい。Geminiがジェミニになった経緯[^2]もあるし、ファブルになる未来もある…？

[^2]: Geminiの日本語表記は「ジェミニ」です。 <https://x.com/googlejapan/status/2013560887701819533>
