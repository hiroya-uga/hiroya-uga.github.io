---
title: "Nu HTML Checkerを\nローカルで使う方法 \n2分でできるセットアップ"
publishedAt: '2026-03-22'
topics: [HTML, Web標準, WHATWG, Tips]
proficiencyLevel: 'Beginner'
---

最終的なHTMLの品質チェック、していますか？

開発中は[markuplint](https://markuplint.dev/ja/)などのLinterでコードをチェックできますが、フレームワークや昔ながらのSSI[^1]などを使っていると、最終的なHTMLではエラーが出ていることがあります。

[^1]: その昔、よく共通ヘッダーや共通フッターなどのガワはServer Side Includeで実装したものです😌

そんなときに便利なのが[The Nu Html Checker](https://validator.w3.org/nu/#textarea)です。

## Nu Html Checkerとは？

Nu Html Checkerは、WHATWGやW3Cでも使われているHTMLのバリデーションツールです。

![](./03-22-nu-html-checker-01.webp?size=1200x740)

Web上にURLを貼り付けたり、HTMLをコピペしたり、ファイルを添付することでHTMLのエラーや警告を検出できます[^2]。

[^2]: 「check as CSS」にチェックをいれればCSSを検査することもできます。

今回はそんなNuを、ローカル環境で起動する方法をご紹介したいと思います。

## コピペだけでできるからやってみよう！

Dockerでも起動できますが、今回はより環境を選ばず使えるJava版を紹介します。Javaの準備ができていない場合は、先に実行環境をインストールしてください[^3]。

[^3]: Dockerが使える方は公式リポジトリから起動コマンドを参照してください。2026年3月現在は21がLTSですが、必要に応じてバージョンは修正してください。JDKはOracleが本家ですが、商用利用に制限があるためここではEclipse Temurinを用います。

なお、Windows向けはPowerShellでの実行を想定しています。

```sh:macOS向け：Java JDKのインストール
brew install temurin@21
```

```sh:Windows向け：Java JDKのインストール
winget install EclipseAdoptium.Temurin.21.JDK
```

### nuのダウンロード

以下のコマンドで[公式リポジトリのRelease](https://github.com/validator/validator/releases)から最新版をダウンロードします[^4]。

[^4]: ここでは、ユーザルートに`vnu`フォルダを作ってその中に`vnu.jar`をダウンロードしていますが、どこにおいてもOK。vnuがNu html Checker本体。

```sh:macOS向け：vnu.jarダウンロード
curl -L -o ~/vnu/vnu.jar https://github.com/validator/validator/releases/download/latest/vnu.jar
```

```pwsh:Windows向け：vnu.jarダウンロード
Invoke-WebRequest -Uri "https://github.com/validator/validator/releases/download/latest/vnu.jar" -OutFile "$HOME\vnu\vnu.jar"
```

### nuの起動

```sh:macOS向け：vnuの起動
java -cp ~/vnu/vnu.jar nu.validator.servlet.Main 8888
```

```pwsh:Windows向け：vnuの起動
Start-Process -NoNewWindow java -ArgumentList @("-cp", "$HOME\vnu\vnu.jar", "nu.validator.servlet.Main", 8888)
```

ブラウザで`http://localhost:8888/`を開くだけ！
ついでに[このツールで](/tools/nu-bookmarklet-generator/?url=http%3A%2F%2Flocalhost%3A8888)ブックマークレットも使えるようにしておきましょう！（よければどうぞ）

これでもうNuがローカルで使えるようになったはずです🎉

### 【全部入り】vnuをコマンド化する

インストールもアップデートも丸ごと1つのコマンドでやりたい！！！  
そんな私のためのメモ書き。

以下のコマンドを1回叩くだけで、`vnu`コマンドを生やせます[^5]。むちゃ便利です。なおご利用は自己責任で🙏

[^5]: Javaのインストールは必要です。Docker版でも似たような感じでコマンドはやしたほうが便利そう。

| コマンド        | 処理                  |
| --------------- | --------------------- |
| `vnu`           | Nuの起動              |
| `vnu --install` | Nuのインストール      |
| `vnu --update`  | Nuのアップデート      |
| `vnu --stop`    | Nu（port 8888）の停止 |

```sh:macOS向け：vnuコマンド有効化
cat >> ~/.zshrc << 'EOF'
vnu() {
  # --install
  if [ "$1" = "--install" ]; then
    echo "installing..."
    mkdir -p ~/vnu
    curl -L -o ~/vnu/vnu.jar https://github.com/validator/validator/releases/download/latest/vnu.jar
    echo "✅ vnu is installed!"
    return

  elif [ ! -f ~/vnu/vnu.jar ]; then
    echo "❌ vnu is not installed."
    echo "Run 'vnu --install' to install vnu."
    return

  # --update
  elif [ "$1" = "--update" ]; then
    echo "updating..."
    curl -L -o ~/vnu/vnu.jar https://github.com/validator/validator/releases/download/latest/vnu.jar
    echo "✅ vnu is updated!"
    return

  # --stop
  elif [ "$1" = "--stop" ]; then
    if lsof -i :8888 > /dev/null 2>&1; then
      kill $(lsof -ti :8888)
      echo "💤 vnu is stopped"
    else
      echo "⚠️ vnu is not running"
    fi
    return
  fi

  # 起動中かチェック
  if lsof -i :8888 > /dev/null 2>&1; then
    echo "⚠️ vnu is already running"
    open http://localhost:8888/
    return
  fi

  # 起動
  echo "starting..."
  java -cp ~/vnu/vnu.jar nu.validator.servlet.Main 8888 &

  # 最大10秒待つ
  for i in $(seq 1 20); do
    if lsof -i :8888 > /dev/null 2>&1; then
      open http://localhost:8888/
      return
    fi
    sleep 0.5
  done
  echo "⚠️ vnu did not start within 10s"
}
EOF
source ~/.zshrc
```

```pwsh:Windows向け：vnuコマンド有効化
Add-Content $PROFILE @'
function vnu {
  $jar = "$HOME\vnu\vnu.jar"
  $url = "https://github.com/validator/validator/releases/download/latest/vnu.jar"
  $port = 8888

  # --install
  if ($args[0] -eq "--install") {
    Write-Host "installing..."
    New-Item -ItemType Directory -Force -Path "$HOME\vnu" | Out-Null
    Invoke-WebRequest -Uri $url -OutFile $jar
    Write-Host "✅ vnu is installed!"
    return
  }

  # jarがない場合
  if (-not (Test-Path $jar)) {
    Write-Host "❌ vnu is not installed."
    Write-Host "Run 'vnu --install' to install vnu."
    return
  }

  # --update
  if ($args[0] -eq "--update") {
    Write-Host "updating..."
    Invoke-WebRequest -Uri $url -OutFile $jar
    Write-Host "✅ vnu is updated!"
    return
  }

  # --stop
  if ($args[0] -eq "--stop") {
    $listeners = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue

    if ($listeners) {
      $pids = $listeners |
        Select-Object -ExpandProperty OwningProcess -Unique |
        Where-Object { $_ -notin 0, 4 }

      if ($pids) {
        foreach ($targetPid in $pids) {
          try {
            Stop-Process -Id $targetPid -ErrorAction Stop
            Write-Host "💤 stopped PID $targetPid"
          } catch {
            Write-Host "⚠️ failed to stop PID $targetPid ($($_.Exception.Message))"
          }
        }
        Write-Host "💤 vnu is stopped"
      } else {
        Write-Host "⚠️ no stoppable process found"
      }
    } else {
      Write-Host "⚠️ vnu is not running"
    }

    return
  }

  # 起動中かチェック
  $running = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
  if ($running) {
    Write-Host "⚠️ vnu is already running"
    Start-Process "http://localhost:$port/"
    return
  }

  # 起動
  Write-Host "starting..."
  Start-Process -NoNewWindow java -ArgumentList @(
    "-cp"
    $jar
    "nu.validator.servlet.Main"
    $port
  )

  # 最大10秒待つ
  $maxWait = 10
  $elapsed = 0

  while ($elapsed -lt $maxWait) {
    $started = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
    if ($started) {
      Start-Process "http://localhost:$port/"
      return
    }

    Start-Sleep -Milliseconds 500
    $elapsed += 0.5
  }

  Write-Host "⚠️ vnu did not start within ${maxWait}s"
}
'@

. $PROFILE
```

## おわりに

新しい技術の話はすぐ盛り上がる一方で、HTMLの品質とかそういう基礎的な部分ってあんまり話題にならないのは、知るチャンスが少ないからだと思うんですよね。

ユーザが触る領域を担うエンジニアならばこそ、先人たちが築き上げてきた偉大なWeb標準を守ることを大切に、できる限り仕様に準拠したものだけを世の中にリリースしていって欲しいと思っています。

そうした小さな積み重ねが、一人一人のユーザの助けになり、ゆくゆくは将来の自分を助けることになるかもしれません。誰かの「使えなくて困った」は、HTMLを正しくするだけで大幅に削減できます。

Nu Validatorを知らなかったあなたも、忘れていたあなたも、日常使いしているあなたも、まだHTMLの品質チェックの仕方を知らない誰かへ伝えてあげてください。

### 余談1：ローカルでNuを動かすとなにがうれしいのか

- 外部サーバにHTMLを送信できない問題[^6]がクリアになる
- インターネットに接続されていない時でもHTMLの品質チェックができる
- 他所様のサーバ負担を考えなくて良くなる（大事）
- ローカルビルドで起動することで、自分なりにカスタマイズできる[^7]

[^6]: 基本的にほとんどのケースでは、所属組織から認証されてない外部サーバに資材を送信することはNGになっていると思います。

[^7]: Python環境が必要です。

### 余談2：社内のイントラでホスティングする場合に、社外のWebページが検査できてしまうと困るんだけど…

URLを入力してそのWebページのHTMLをチェックする機能がありますが、SSRFなどの懸念がありセキュリティ的に避けたい…。

実はそんなあなたのために`--allowed-address-type`オプションが用意されています。

- `all` - URL経由の検査をすべて許可します（デフォルト）
- `same-origin` - 同一オリジンURL経由の検査のみ許可します
- `none` - URL経由のHTML検査を禁止します

サーバで起動する際に設定することで、社内のNuから許可されていないWebページの検査を禁止できます。

#### 関連情報

- [Add --allowed-address-type option by hiroya-uga · Pull Request #1638 · validator/validator](https://github.com/validator/validator/pull/1638)
- [ep.160『HTMLの品質チェックをもっと身近に！Nu HTML Checker セルフホスティングへの道』 | UIT INSIDE](https://uit-inside.linecorp.com/episode/160)
