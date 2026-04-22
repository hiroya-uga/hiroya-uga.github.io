import { Lang } from '@/types/lang';

const HomebrewLink = () => (
  <a href="https://brew.sh/" className="dark:text-[#85b4ff]">
    Homebrew
  </a>
);

const VnuJarLink = () => (
  <a href="https://github.com/validator/validator/releases/tag/latest" className="dark:text-[#85b4ff]">
    vnu.jar
  </a>
);

export const vnuxLocales = {
  ja: {
    descriptions: [
      'macOS 向け Nu Html Checker (vnu) の CLI ラッパーです。',
      'Nu Html Checkerをインストールし、vnuの起動・停止、HTMLフラグメントのバリデーションなどの機能を提供します。',
    ],
    descriptionExtra: 'Javaが未インストールの場合も自動でインストールします（',
    descriptionExtraClose: '）。',
    installSection: 'ターミナルに貼り付けて実行',
    installTitle: 'インストールコマンド',
    stepsSection: '実行される内容',
    steps: [
      <>
        Javaがなければ
        <HomebrewLink />
        でTemurin JDKをインストール
      </>,
      <>
        <code>~/.vnux</code>に<VnuJarLink />
        をダウンロード
      </>,
      <>
        <code>~/.local/bin/vnux</code> コマンドを生成
      </>,
      <>
        <code>~/.zshenv</code> に PATH を追加
      </>,
    ],
    commandsSection: 'コマンド一覧',
    featureGroups: [
      {
        label: 'サーバーの起動と停止',
        features: [
          { cmd: 'vnux', desc: 'vnux start のエイリアス' },
          { cmd: 'vnux start', desc: 'Nu Html Checkerを起動し、http://localhost:8888 をブラウザで開く' },
          {
            cmd: 'vnux start --port <PORT>',
            desc: '指定したポートでNu Html Checkerを起動し、ブラウザで開く（例: vnux start --port 9090）',
          },
          { cmd: 'vnux serve', desc: 'ブラウザを開かずにNu Html Checkerを起動する' },
          {
            cmd: 'vnux serve --port <PORT>',
            desc: '指定したポート番号でNu Html Checkerを起動する（例: vnux serve --port 9090）',
          },
          { cmd: 'vnux stop', desc: '起動中のNu Html Checkerプロセスを停止する' },
        ],
      },
      {
        label: 'HTML検証',
        features: [
          {
            cmd: 'vnux check <value>',
            desc: 'valueを自動判定して検証する',
          },
          { cmd: 'vnux check --file <file>', desc: 'HTMLファイルを検証する' },
          { cmd: 'vnux check --url <url>', desc: 'URLを検証する' },
          { cmd: "vnux check --html '<html>'", desc: 'HTML文字列全体を検証する' },
          {
            cmd: "vnux check --fragment '<p>...</p>'",
            desc: 'HTMLフラグメントを検証する（完全なドキュメントに自動でラップ）',
          },
        ],
      },
      {
        label: 'その他',
        features: [
          { cmd: 'vnux update', desc: 'vnu.jar と vnux コマンドを最新バージョンに更新する' },
          { cmd: 'vnux uninstall', desc: 'vnux と関連ファイルを削除する' },
          {
            cmd: 'vnux --version',
            desc: 'vnux のバージョンとインストール済みの vnu.jar のバージョン（更新日）を表示する',
          },
          { cmd: 'vnux --help', desc: 'ヘルプを表示する' },
        ],
      },
    ],
    bookmarkletNote: 'ブックマークレットの作成はこちら',
  },
  en: {
    descriptions: [
      'A CLI wrapper for Nu Html Checker (vnu).',
      'Installs Nu Html Checker and provides features such as starting/stopping vnu and validating HTML fragments.',
    ],
    descriptionExtra: "Don't have Java? No problem — it'll be installed automatically (",
    descriptionExtraClose: ').',
    installSection: 'Run this in your terminal',
    installTitle: 'Install command',
    stepsSection: 'What the script does',
    steps: [
      <>
        Installs Temurin JDK via <HomebrewLink /> if you don't have Java yet
      </>,
      <>
        Downloads <VnuJarLink /> to <code>~/.vnux</code>
      </>,
      <>
        Creates the <code>~/.local/bin/vnux</code> command
      </>,
      <>
        Adds <code>~/.local/bin</code> to your PATH in <code>~/.zshenv</code>
      </>,
    ],
    commandsSection: 'Commands',
    featureGroups: [
      {
        label: 'Server',
        features: [
          { cmd: 'vnux', desc: 'Alias for vnux start' },
          {
            cmd: 'vnux start',
            desc: 'Starts the Nu Html Checker on http://localhost:8888 and opens it in your browser',
          },
          {
            cmd: 'vnux start --port <PORT>',
            desc: 'Starts the Nu Html Checker on a specific port and opens it in your browser (e.g. vnux start --port 9090)',
          },
          { cmd: 'vnux serve', desc: 'Starts the Nu Html Checker without opening the browser' },
          {
            cmd: 'vnux serve --port <PORT>',
            desc: 'Starts the Nu Html Checker on a specific port (e.g. vnux serve --port 9090)',
          },
          { cmd: 'vnux stop', desc: 'Stops the running Nu Html Checker process' },
        ],
      },
      {
        label: 'Validation',
        features: [
          {
            cmd: 'vnux check <value>',
            desc: 'Auto-detects and validates the given value',
          },
          { cmd: 'vnux check --file <file>', desc: 'Validates an HTML file' },
          { cmd: 'vnux check --url <url>', desc: 'Validates a URL' },
          { cmd: "vnux check --html '<html>'", desc: 'Validates a full HTML string' },
          {
            cmd: "vnux check --fragment '<p>...</p>'",
            desc: 'Validates an HTML fragment (auto-wrapped in a full document)',
          },
        ],
      },
      {
        label: 'Utilities',
        features: [
          { cmd: 'vnux update', desc: 'Updates vnu.jar and the vnux command to the latest version' },
          { cmd: 'vnux uninstall', desc: 'Removes vnux and related files' },
          { cmd: 'vnux --version', desc: 'Shows the vnux version and the release date of the installed vnu.jar' },
          { cmd: 'vnux --help', desc: 'Shows usage information' },
        ],
      },
    ],
    bookmarkletNote: 'Create a bookmarklet for Nu Html Checker',
  },
} satisfies Record<Lang, unknown>;
