---
title: "VoiceOverをONにすると\n出てくる青いリングの正体は\nトラックパッドコマンド"
publishedAt: '2026-05-22T01:57:02+09:00'
topics: [VoiceOver, macOS, Tips]
proficiencyLevel: 'Beginner'
---

結論、**VOキー＋2本指を反時計回りに回してオフ。**  
時計回りでオン。

---

先日、macOSでVoiceOverを起動すると、なにかしたわけでもないと思いますが、マウスカーソルが消えて代わりに青いリングが現れました。

![VoiceOverの青いリング（トラックパッドコマンド）がVoiceOverユーティリティの上に表示されている様子](./05-22-voice-over-blue-circle-01.webp?size=1200x738)

普段のマウス操作ができない不思議な挙動に困ってしまい、恥ずかしながら解決策を求めてネットの海を漂うこと数分😭

> macOS voiceover マウスカーソル 消える 青いリング なぜ

「トラックパッドコマンド（Trackpad Commander）」という機能が動いていただけだったことがわかった[^1]ので、メモ書きとして残しておきます。

[^1]: [How do I turn off the VoiceOver 'blue circle pointer' functionality? - Apple Community](https://discussions.apple.com/thread/256016767)

## 切り替え方法

VOキー（`Control + Option` または `Caps Lock`）を押しながらトラックパッドで2本指を時計回りに回すと有効化、反時計回りに回すと無効化できるようです。

また、[VoiceOverユーティリティ](https://support.apple.com/ja-jp/guide/voiceover/vo28017/mac)からも切り替えることができます。

![VoiceOverユーティリティで「トラックパッド」のチェックを外す様子](./05-22-voice-over-blue-circle-02.webp?size=1200x738)

1. VoiceOverユーティリティを開く
   - アプリケーション → ユーティリティ → VoiceOverユーティリティ。VoiceOver起動中の場合は`VO + Fn + F8`。
2. 左サイドバーから「コマンド」を選択
3. 「VoiceOverのほかの制御方法」を見つける
4. 「トラックパッド」のチェックを外す

## VoiceOverのトラックパッドコマンドとは？

そもそもこれは何かというと、macOSのVoiceOverをiOSと同じように操作することができるようになる機能でした。

![トラックパッドコマンドでVoiceOverローターを表示させ、見出しを選択している様子](./05-22-voice-over-blue-circle-03.webp?size=1200x798)

iOSのVOと同じ操作だとわかっていれば、思った通りに操作できて不思議な感じです。ローターも2本指Zジェスチャーキャンセル（スクラブ）も使えました。

公式ドキュメントでは[トラックパッドジェスチャ](https://support.apple.com/ja-jp/guide/voiceover/vo28030/10/mac/26)と呼ばれているようですが、実装上はトラックパッドコマンドとなっているようです。

![トラックパッドコマンドをオンにしたときのキャプションパネル。「トラックパッドコマンドオン」と表示されている。](./05-22-voice-over-blue-circle-04.webp?size=1200x798)

余談ですが、トラックパットコマンドと誤字しそうになりますねこれ。それも含めて日本語での検索難易度が高い。

どこかのだれかの助けになればさいわいです🍵
