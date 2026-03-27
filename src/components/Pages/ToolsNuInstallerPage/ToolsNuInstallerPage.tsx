import { TweetLink } from '@/components/Clickable/TweetLink';
import { CodeBlock } from '@/components/CodeBlock';
import { Lang } from '@/types/lang';
import Link from 'next/link';

const INSTALL_COMMAND =
  'curl -fsSL https://github.com/hiroya-uga/vnu-installer/releases/latest/download/install.sh | zsh';

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

const i18n = {
  ja: {
    description: 'macOS に Nu Html Checker (vnu) をセットアップするスクリプトです。',
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
        <code>~/.vnu</code>に<VnuJarLink />
        をダウンロード
      </>,
      <>
        <code>~/.local/bin/vnu</code> コマンドを生成
      </>,
      <>
        <code>~/.zshenv</code> に PATH を追加
      </>,
    ],
    commandsSection: 'コマンド一覧',
    features: [
      { cmd: 'vnu', desc: 'localhost:8888 でサーバーが起動していなければ Nu Html Checker を起動し、ブラウザで開く' },
      { cmd: 'vnu --port PORT', desc: '指定したポート番号でサーバーを起動する（例: vnu --port 9090）' },
      { cmd: 'vnu --version', desc: 'インストール済みの vnu.jar のバージョン（更新日）を表示する' },
      { cmd: 'vnu --update', desc: 'vnu.jar を最新バージョンに更新する' },
      { cmd: 'vnu --stop', desc: 'vnu のプロセスを停止する' },
      { cmd: 'vnu --uninstall', desc: 'vnu および関連ファイルを削除する' },
      { cmd: 'vnu --help', desc: 'ヘルプを表示する' },
    ],
    bookmarkletNote: 'ブックマークレットの作成はこちら',
  },
  en: {
    description: 'A simple one-command script to install and run Nu Html Checker (vnu) on macOS.',
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
        Downloads <VnuJarLink /> to <code>~/.vnu</code>
      </>,
      <>
        Creates the <code>~/.local/bin/vnu</code> command
      </>,
      <>
        Adds <code>~/.local/bin</code> to your PATH in <code>~/.zshenv</code>
      </>,
    ],
    commandsSection: 'Commands',
    features: [
      {
        cmd: 'vnu',
        desc: 'Starts the checker on http://localhost:8888 (if not already running) and opens it in your browser',
      },
      { cmd: 'vnu --port PORT', desc: 'Launches the checker on a specific port (e.g. vnu --port 9090)' },
      { cmd: 'vnu --version', desc: 'Shows the release date of the installed vnu.jar' },
      { cmd: 'vnu --update', desc: 'Updates vnu.jar to the latest release' },
      { cmd: 'vnu --stop', desc: 'Stops the running vnu process' },
      { cmd: 'vnu --uninstall', desc: 'Removes vnu and all its related files' },
      { cmd: 'vnu --help', desc: 'Shows usage information' },
    ],
    bookmarkletNote: 'Create a bookmarklet for Nu Html Checker',
  },
} satisfies Record<Lang, unknown>;

interface Props {
  pageTitle: string;
  lang: Lang;
}

export const ToolsNuInstallerPage = ({ pageTitle, lang }: Props) => {
  const t = i18n[lang];

  return (
    <div className="mx-auto max-w-2xl font-['LINE_Seed_JP',sans-serif] text-slate-600 dark:text-[#a5b4cd]">
      <h1 className="mb-5 rounded-md bg-[#365d95] p-3 pt-3.5 text-center font-[sans-serif] text-[1.625rem] leading-snug tracking-tight text-[#fdfdfd]">
        {pageTitle} <span className="block text-sm">for macOS</span>
      </h1>

      <div className="@w640:text-center @w640:pl-1.5 @w640:text-sm mb-2">
        <p>
          {t.description}
          <span className="@w640:block">
            {t.descriptionExtra}
            <a href="https://adoptium.net/temurin" className="dark:text-[#85b4ff]">
              Temurin
            </a>
            {t.descriptionExtraClose}
          </span>
        </p>
      </div>

      <p className="mb-14 text-right text-xs">
        {lang === 'ja' ? <Link href="./en">* View in English</Link> : <Link href="../">※ 日本語はこちら</Link>}
      </p>

      <section className="mb-14">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9eb4da]">
          {t.installSection}
        </h2>
        <CodeBlock
          language="sh"
          title={t.installTitle}
          code={INSTALL_COMMAND}
          className="rounded-b-lg"
          nowrap
          copyButton
        />
      </section>

      <section className="mb-14">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9eb4da]">{t.stepsSection}</h2>
        <ol className="space-y-2.5 [counter-reset:step]">
          {t.steps.map((content, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm [counter-increment:step] before:shrink-0 before:content-[counter(step)_'.']"
            >
              <span>{content}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-14 mt-10 border-t border-t-slate-200 pt-10 dark:border-t-slate-700">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9eb4da]">
          {t.commandsSection}
        </h2>
        <div className="bg-secondary mb-3 grid grid-cols-[auto_1fr] divide-y divide-slate-400 overflow-hidden rounded border border-slate-400 dark:divide-slate-600 dark:border-slate-600">
          {t.features.map(({ cmd, desc }) => (
            <p key={cmd} className="col-start-1 -col-end-1 grid grid-cols-subgrid items-center gap-4 px-3 py-2">
              <span>
                <code>{cmd}</code>
              </span>
              <span className="text-sm leading-relaxed">{desc}</span>
            </p>
          ))}
        </div>
        <p>
          {lang === 'ja' ? '※' : '*'}{' '}
          <Link
            href={`/tools/nu-bookmarklet-generator/${lang === 'ja' ? '' : 'en'}?url=http%3A%2F%2Flocalhost%3A8888`}
            className="dark:text-[#85b4ff]"
          >
            {t.bookmarkletNote}
          </Link>
        </p>
      </section>

      <div className="mt-20 border-t border-t-slate-200 pt-8 dark:border-t-slate-700">
        <p className="mb-8 text-right text-xs">
          <a
            href="https://github.com/hiroya-uga/vnu-installer"
            className="underline underline-offset-2 transition-colors dark:text-[#85b4ff]"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub →
          </a>
        </p>
        <p className="mt-share-buttons grid justify-end">
          <TweetLink hashtags={['html']} lang={lang} />
        </p>
      </div>
    </div>
  );
};
