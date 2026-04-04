---
title: "パッケージマネージャーの\nサプライチェーン攻撃対策\n（npm / Yarn / pnpm / Bun）"
publishedAt: '2026-04-04T07:27:04+09:00'
updatedAt: '2026-04-04T12:21:49+09:00'
topics: [Security, JavaScript, npm, Yarn, pnpm, Bun]
proficiencyLevel: 'Intermediate'
---

2026年3月、週間1億ダウンロードを超える`axios`に悪意あるコードが混入しました。過去にも`ua-parser-js`や`@solana/web3.js`など、広く使われるパッケージが同様の被害を受けています。

主要なパッケージマネージャー（npm、Yarn、pnpm、Bun）や自動アップデートツール（Dependabot、Renovate）は、こうした**サプライチェーン攻撃**への対策を整備してきました。

本記事では、2026年時点でのサプライチェーン攻撃対策についてまとめたいと思います[^1]。

[^1]: 本記事は一般的な対策を整理したものであり、すべてのリスクを防げるものではありません。

## 1. パッケージのエイジゲート（`min-release-age`系）

主要なパッケージマネージャーには、**公開から一定期間が経過していないバージョンをインストール対象から除外する設定**が用意されています。

悪意のあるパッケージは公開から数時間〜数日以内に検出・削除されることがほとんどです[^2]。この「検出までの空白期間」にインストールしてしまわないよう、どのパッケージマネージャーでも閾値を設定しておくことが一般的に有効とされています。

[^2]: **ua-parser-js（2021年10月）** は約4時間で検出〜対処（[Sonatype](https://www.sonatype.com/blog/npm-project-used-by-millions-hijacked-in-supply-chain-attack)）、**@solana/web3.js（2024年12月）** は約5時間で検出〜対処（[SecurityWeek](https://www.securityweek.com/solana-web3-js-library-backdoored-in-supply-chain-attack/)）、**axios（2026年3月）** は約3時間で検出〜対処（[Snyk](https://snyk.io/blog/axios-npm-package-compromised-supply-chain-attack-delivers-cross-platform/)）

| パッケージマネージャー | プロパティ名          |  単位  | 3日の場合 |
| :--------------------- | :-------------------- | :----: | :-------: |
| **npm** (v11.10+)      | `min-release-age`     |   日   |    `3`    |
| **pnpm** (v10.16+)     | `minimum-release-age` |   分   |  `4320`   |
| **Yarn** (v4.10+)      | `npmMinimalAgeGate`   | string |   `3d`    |
| **Bun** (v1.3+)        | `minimumReleaseAge`   |   秒   | `259200`  |

### なぜ3日？

パッケージマネージャーにはアップデートの性質が緊急なのか軽微な修正なのかを判断する仕組みがありません。あまり長い期間に設定すると緊急のセキュリティパッチの適用が遅れるリスクや、バイパスして無理やりアップデートする手間が出てきてしまいます。

最短で考えると、前述の通り主要な攻撃は数時間で検出されているので24時間でもよさそうに感じます。

しかし、木曜日に公開された悪意のあるバージョンが金曜日に適用され、週末を挟んで月曜まで気づかれないというケースがありそうです。~~いや、週末にパッケージアップデートすな~~。

そう考えると、3日が妥当に感じますね。

ちなみに後述でも触れますが、Renovateの`config:best-practices`のプリセットでも3日がデフォルト値として採用されています[^3]。

[^3]: [Upgrade best practices - Renovate Docs](https://docs.renovatebot.com/upgrade-best-practices/)によると、`config:best-practices`には`security:minimumReleaseAgeNpm`の設定が含まれていて、[その初期値は3日](https://docs.renovatebot.com/presets-security/)に設定されている。

## 2. ロックファイルを使おう

ロックファイルとは、`npm install`などで解決された依存関係の**正確なバージョンとハッシュ**を記録するファイルです。

これをリポジトリにコミットしておくことで、うっかり違うバージョンをインストールする事態を防げます。

| パッケージマネージャー | ロックファイル      | 形式     |
| :--------------------- | :------------------ | :------- |
| **npm**                | `package-lock.json` | JSON     |
| **Yarn**               | `yarn.lock`         | 独自形式 |
| **pnpm**               | `pnpm-lock.yaml`    | YAML     |
| **Bun**                | `bun.lock`          | JSONC    |

さらに、インストール時にロックファイル内に記録されたハッシュでパッケージを検証するため、**レジストリ側でパッケージの中身が差し替えられた場合にも検知**できます。

また、攻撃が発覚した際、汚染されたバージョンが自分のプロジェクトに含まれているかどうかを、ロックファイルを確認するだけですぐに判断できます。

### CI環境では`--frozen-lockfile`系を使おう

CI環境やデプロイ時には、ロックファイルの内容を厳密に再現するコマンドを使いましょう。`package.json`と一致しなければCIが転けるため、意図しないバージョンの混入を防げます。

| パッケージマネージャー | コマンド                         |
| :--------------------- | :------------------------------- |
| **npm**                | `npm ci`                         |
| **Yarn**               | `yarn install --immutable`       |
| **pnpm**               | `pnpm install --frozen-lockfile` |
| **Bun**                | `bun install --frozen-lockfile`  |

Yarn Classic（v1）では`--frozen-lockfile`だったが、Yarn v2以降では`immutable`になりました。統一して…。~~`yarn ci`でええんじゃないですかね。~~

## 3. `postinstall`の無効化

パッケージのインストール時に、**サードパーティのスクリプトが自動実行されないようにする**ことも効果的です。先日のaxiosの件は、この`postinstall`スクリプトが攻撃の起点でした。

- **npm**： `.npmrc` に `ignore-scripts=true` を追加する。
- **pnpm（v10以降）**：**デフォルトで無効**[^4]
- **Bun（v1.2以降）**：**デフォルトで無効**[^5]
- **Yarn Berry（v2以降）**：**デフォルトで無効**[^6]

[^4]: [Mitigating supply chain attacks | pnpm](https://pnpm.io/ja/supply-chain-security)

[^5]: [Lifecycle scripts - Bun](https://bun.com/docs/pm/lifecycle)

[^6]: [Settings (.yarnrc.yml) | Yarn](https://yarnpkg.com/configuration/yarnrc#:~:text=Define%20whether%20to%20run%20postinstall%20scripts%20or%20not.)

> Postinstall scripts should be avoided at all cost, as they make installs slower and riskier. Many users will refuse to install dependencies that have postinstall scripts. Additionally, since the output isn't shown out of the box, using them to print a message to the user will not work as you expect.
>
> 引用：[Lifecycle Scripts | Yarn](https://yarnpkg.com/advanced/lifecycle-scripts)

上記のようにYarnも`postinstall`スクリプトの使用を強く非推奨としています。

パッケージインストール後にスクリプトを自動実行してくれる`postinstall`は便利な側面もありますが、こういうリスクがあるのは恐ろしいですね。自分の目に見えない範囲では動かないようにしておくのが良さそうです[^7]。

[^7]: ほとんどの環境ではデフォルトが無効であるものの、途中で切り替えた場合は一部のパッケージが正常に動作しなくなる場合があることに注意。

## 4. アップデートツールにもエイジゲートを設定しよう

パッケージマネージャーの設定だけでは、DependabotやRenovateが生成するプルリクエスト経由で新しいバージョンが入り込む可能性があります。

こちらにも設定を追記しましょう。

### Renovate: `minimumReleaseAge`

Renovateではアップデートの性質によってエイジゲートの日数を調整できるので、通常は3日、差分が大きいもの[^8]については5日、セキュリティパッチ[^9]（`vulnerabilityAlerts`）については即時に設定しておくのが良さそうです。こうすることで、緊急度の高いセキュリティパッチは即座にPRが作成され、それ以外は指定した日数待機してからPRが作成されます。

[^8]: [セマンティックバージョニング（semver）](https://semver.org/lang/ja/)に基づいて判断される

[^9]: 緊急度の高いセキュリティパッチかどうかは[GitHub Security Alerts](https://docs.github.com/ja/code-security/concepts/security-at-scale/auditing-security-alerts)や[Open Source Vulnerabilities](https://osv.dev/)などの脆弱性データベースを参照して判別しているらしい。[CVE](https://www.ipa.go.jp/security/vuln/scap/cve.html)があるかどうかが判断基準にみえる。

```json:renovate.json
{
  "minimumReleaseAge": "3 days",
  "packageRules": [
    {
      "matchUpdateTypes": ["major"],
      "minimumReleaseAge": "5 days"
    },
    {
      "matchUpdateTypes": ["minor"],
      "minimumReleaseAge": "5 days"
    }
  ],
  "vulnerabilityAlerts": {
    "minimumReleaseAge": "0 days"
  }
}
```

### Dependabot: `cooldown`

`cooldown`ブロックでアップデートの性質ごとにエイジゲートの日数を指定できます。セキュリティアップデートの場合はエイジゲートを無視するため、明示的に`0`を指定する必要はありません。

```yml:.github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'daily'
    cooldown:
      default-days: 3
      semver-major-days: 5
      semver-minor-days: 5
```

## まとめ

- `min-release-age`で公開されてから時間が経ったパッケージだけを利用する
- ロックファイルを厳格に管理し、意図しない変更を防ぐ
- `ignore-scripts`で`postinstall`由来のコード実行をブロックする
- アップデートツールにもエイジゲートを設ける

それぞれは簡単な設定変更ですが、サプライチェーン攻撃にたいして有意義な対策です。みなさんのプロジェクトもぜひ見直してみてください💡

ところでこの`min-release-age`の概念って日本語でなんていうのがいいんだろう。クールダウン？エイジゲートでいいのかな？

…年確？

…。

エイジゲートでいいか…。

## 謝辞

[@mehm8128さん](https://x.com/mehm8128/status/2040262590094537086)より、pnpm v10以降・Bun v1.2以降はデフォルトで`postinstall`が無効化されている旨をご指摘いただき記事を修正しました。ありがとうございます!!🙏
