import { TweetLink } from '@/components/Clickable/TweetLink';
import { CodeBlock } from '@/components/CodeBlock';
import { CommandTable } from '@/components/Table';
import { Lang } from '@/types/lang';
import Link from 'next/link';
import { vnuxLocales } from './locales';

const INSTALL_COMMAND = 'curl -fsSL https://github.com/hiroya-uga/vnux/releases/latest/download/install.sh | zsh';

const i18n = vnuxLocales;

interface Props {
  pageTitle: string;
  following?: string;
  inLanguage?: Lang;
}

export const ToolsVnuxPage = ({ pageTitle, following, inLanguage = 'ja' }: Props) => {
  const t = i18n[inLanguage];

  return (
    <div className="text-slate-600 dark:text-[#a5b4cd]">
      <h1 className="mb-5 rounded-md bg-[#365d95] p-3 pt-3.5 text-center font-[sans-serif] text-[1.625rem] leading-snug tracking-tight text-[#fdfdfd]">
        {pageTitle} - {following}
        <span className="block text-sm">for macOS</span>
      </h1>

      <div className="@w640:text-center @w640:pl-1.5 @w640:text-sm mb-2">
        <p className="@w640:space-y-2">
          {t.descriptions.map((description) => (
            <span key={description} className="@w640:text-balance inline-block">
              {description}
            </span>
          ))}
          <span className="@w640:block mb-6">
            {t.descriptionExtra}
            <a href="https://adoptium.net/temurin" className="dark:text-[#85b4ff]">
              Temurin
            </a>
            {t.descriptionExtraClose}
          </span>
        </p>
      </div>

      <p className="mb-14 text-right text-xs">
        {inLanguage === 'ja' ? <Link href="./en">* View in English</Link> : <Link href="../">※ 日本語はこちら</Link>}
      </p>

      <section className="mb-14">
        <h2 className="mb-3 text-sm font-bold tracking-widest text-[#4a5466] dark:text-[#9eb4da]">
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
        <h2 className="mb-3 text-sm font-bold tracking-widest text-[#4a5466] dark:text-[#9eb4da]">{t.stepsSection}</h2>
        <ol className="space-y-2.5 [counter-reset:step]">
          {t.steps.map((content, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm [counter-increment:step] before:shrink-0 before:content-[counter(step)_'.']"
            >
              <span>{content}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-14 mt-10 border-t border-t-slate-200 pt-10 dark:border-t-slate-700">
        <h2 className="mb-3 text-sm font-bold tracking-widest text-[#4a5466] dark:text-[#9eb4da]">
          {t.commandsSection}
        </h2>
        <div className="mb-3 space-y-6">
          {t.featureGroups.map(({ label, features }) => (
            <div key={label}>
              <h3 className="mb-1.5 text-xs font-bold text-[#4d5460] dark:text-[#9eb4da]">{label}</h3>
              <CommandTable items={features} lang={inLanguage} />
            </div>
          ))}
        </div>
        <p className="mb-10">
          {inLanguage === 'ja' ? '※' : '*'}{' '}
          <Link
            href={`/tools/nu-bookmarklet-generator/${inLanguage === 'ja' ? '' : 'en'}?url=http%3A%2F%2Flocalhost%3A8888`}
            className="dark:text-[#85b4ff]"
          >
            {t.bookmarkletNote}
          </Link>
        </p>

        <CodeBlock
          language="sh"
          title="Example"
          code="vnux check --fragment '<p>Hello, world!</p>'"
          className="rounded-b-lg"
          nowrap
          copyButton
        />
      </section>

      <div className="mt-20 border-t border-t-slate-200 pt-8 dark:border-t-slate-700">
        <p className="mb-8 text-right text-xs">
          <a
            href="https://github.com/hiroya-uga/vnux"
            className="underline underline-offset-2 transition-colors dark:text-[#85b4ff]"
          >
            View on GitHub →
          </a>
        </p>
        <p className="mt-share-buttons grid justify-end">
          <TweetLink hashtags={['html']} lang={inLanguage} />
        </p>
      </div>
    </div>
  );
};
