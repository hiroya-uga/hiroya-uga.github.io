---
title: "Pull Requestの初回だけ\npackage.jsonが原因で\nフォーマットチェックCIが失敗する問題"
publishedAt: '2026-04-14T19:20:15+09:00'
topics: [DevOps, Yarn, Node.js, Formatter, Prettier, Tips]
proficiencyLevel: 'Intermediate'
---

Yarn Berry（v4）は`yarn install`時に`package.json`の一部のメタデータフィールドを複数行に正規化する仕様になっていて、CIのフォーマットチェックで*初回だけ*転ける原因になることがあります。

## 発生する事象

- Yarn: 4.x (Berry)
- Prettier: 3.x
- Node.js: 24.x

PullRequestを立てると、なぜか初回だけフォーマットチェックが落ちて、Re-runすると通る。そんな妙な挙動に遭遇しました。

1. Botや開発者がPRを作成
2. CIで`yarn install --immutable`が実行される
3. フォーマットチェックが **失敗** する
4. Re-runすると **成功** する

```plain:エラーメッセージ
Checking formatting...
[warn] package.json
Code style issues found in the above file. Run Prettier with --write to fix.
```

## 原因

```diff:差分イメージ
- "keywords": ["yarn", "prettier", "ci"],
+ "keywords": [
+   "yarn",
+   "prettier",
+   "ci"
+ ],
```

なんと`yarn install`自体が`package.json`をフォーマットすることが原因でした。~~`immutable`とは一体…？~~

なお、この挙動にオプトアウトする設定は存在しないようです[^1]。

[^1]: Yarnの[issue #6282](https://github.com/yarnpkg/berry/issues/6282)と[issue #6298](https://github.com/yarnpkg/berry/issues/6298)はいずれも"not planned"でクローズされていて、機能リクエストである[issue #2712](https://github.com/yarnpkg/berry/issues/2712)は数年間大きな動きがない。

こうした背景があるため、依存キャッシュの有無で`yarn install`の実行可否が分岐するCI構成では、初回とRe-runで次のように結果が変わるようです。

初回実行:

1. `yarn install --immutable`が実行される
2. `package.json`が書き換わる
3. フォーマットチェック失敗

Re-run:

1. キャッシュ読み込み
2. `yarn install`処理をスキップ
3. フォーマットチェック成功

## 解決策

フォーマッターの設定で`package.json`に対する`printWidth`を`1`に設定するだけです。

```js:.prettierrc.jsの例
overrides: [
  {
    // Yarn Berryがinstall時にpackage.jsonの配列を複数行に正規化するため、
    // prettierの出力をYarnと一致させてフォーマットチェックの不整合を防ぐ
    files: ['package.json'],
    options: {
      printWidth: 1,
    },
  },
],
```

もともとが改行する設定になっていれば問題ないですが、1行にできるなら1行にしたい！という現場だと、なかなかエッジケースな落とし穴ですね🪤
