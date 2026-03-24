import { CodeBlock } from '@/components/CodeBlock';
import { getMetadata } from '@/utils/get-metadata';
import Link from 'next/link';

const GIST_ID = '0743a5e48238c053efac69c200e609ec';
const INSTALL_COMMAND = `curl -fsSL https://gist.githubusercontent.com/hiroya-uga/${GIST_ID}/raw/install-vnu-with-java.sh | zsh`;

const features = [
  { cmd: 'vnu', desc: 'localhost:8888 でサーバーが起動していなければ Nu Html Checker を起動し、ブラウザで開く' },
  { cmd: 'vnu --update', desc: 'vnu.jar を最新バージョンに更新する' },
  { cmd: 'vnu --stop', desc: 'vnu のプロセスを停止する' },
  { cmd: 'vnu --uninstall', desc: 'vnu および関連ファイルを削除する' },
  { cmd: 'vnu --help', desc: 'ヘルプを表示する' },
];

const steps = [
  {
    key: '1',
    content: (
      <>
        Java JDKがなければ
        <a href="https://brew.sh/" className="dark:text-[#85b4ff]">
          Homebrew
        </a>
        でインストール（Temurin）
      </>
    ),
  },
  {
    key: '2',
    content: (
      <>
        <code>~/.vnu</code>に
        <a href="https://github.com/validator/validator/releases/tag/latest" className="dark:text-[#85b4ff]">
          vnu.jar
        </a>
        をダウンロード
      </>
    ),
  },
  {
    key: '3',
    content: (
      <>
        <code>~/.local/bin/vnu</code> コマンドを生成
      </>
    ),
  },
  {
    key: '4',
    content: (
      <>
        <code>~/.zshenv</code> に PATH を追加
      </>
    ),
  },
];

export const metadata = getMetadata('/tools/nu-installer');

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl font-['LINE_Seed_JP',sans-serif] text-slate-600 dark:text-[#a5b4cd]">
      <h1 className="mb-5 rounded-md bg-[#365d95] p-3 pt-3.5 text-center font-[sans-serif] text-[1.625rem] leading-snug tracking-tight text-[#fdfdfd]">
        Nu Html Checker Installer <span className="block text-sm">for macOS</span>
      </h1>

      <div className="@w640:text-center @w640:pl-1.5 @w640:text-sm mb-14">
        <p>
          macOS に Nu Html Checker (vnu) をセットアップするスクリプトです。
          <span className="@w640:block">
            Javaが未インストールの場合も自動でインストールします（
            <a href="https://adoptium.net/temurin" className="dark:text-[#85b4ff]">
              Temurin
            </a>
            ）。
          </span>
        </p>
      </div>

      <section className="mb-14">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9eb4da]">
          ターミナルに貼り付けて実行
        </h2>

        <CodeBlock
          language="sh"
          title="インストールコマンド"
          code={INSTALL_COMMAND}
          className="rounded-b-lg"
          nowrap
          copyButton
        />
      </section>

      <section className="mb-14">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9eb4da]">インストール内容</h2>

        <ol className="space-y-2.5 [counter-reset:step]">
          {steps.map(({ key, content }) => (
            <li
              key={key}
              className="flex items-start gap-3 text-sm [counter-increment:step] before:shrink-0 before:content-[counter(step)_'.']"
            >
              <span>{content}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-14 mt-10 border-t border-t-slate-200 pt-10 dark:border-t-slate-700">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9eb4da]">コマンド一覧</h2>

        <div className="bg-secondary mb-3 grid grid-cols-[auto_1fr] divide-y divide-slate-400 overflow-hidden rounded border border-slate-400 dark:divide-slate-600 dark:border-slate-600">
          {features.map(({ cmd, desc }) => (
            <p key={cmd} className="col-start-1 -col-end-1 grid grid-cols-subgrid items-center gap-4 px-3 py-2">
              <span>
                <code>{cmd}</code>
              </span>
              <span className="text-sm leading-relaxed">{desc}</span>
            </p>
          ))}
        </div>

        <p>
          ※{' '}
          <Link
            href="/tools/nu-bookmarklet-generator/?url=http%3A%2F%2Flocalhost%3A8888"
            className="dark:text-[#85b4ff]"
          >
            ブックマークレットの作成はこちら
          </Link>
        </p>
      </section>

      <p className="mt-10 border-t border-t-slate-200 pt-20 text-center text-xs dark:border-t-slate-700">
        <a
          href={`https://gist.github.com/hiroya-uga/${GIST_ID}`}
          className="underline underline-offset-2 transition-colors dark:text-[#85b4ff]"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Gist →
        </a>
      </p>
    </div>
  );
}
