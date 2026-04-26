import { TweetLink } from '@/components/Clickable/TweetLink';
import { CodeBlock } from '@/components/CodeBlock';
import { Heading } from '@/components/Heading';
import { NoteList } from '@/components/List';
import { CommandTable } from '@/components/Table';
import { CodeBlockWithPlatform } from '@/components/client/CodeBlockWithPlatform';
import { PageTitle } from '@/components/structures/PageTitle';
import { Lang } from '@/types/lang';
import Link from 'next/link';
import { SwitchByPlatformSection } from './client/SwitchByPlatformSection';
import { gitCdLocales } from './locales';

interface Props {
  pageTitle: string;
  following?: string;
  description: string;
  inLanguage?: Lang;
}

export const ToolsGitCdPage = ({ pageTitle, following, description, inLanguage = 'ja' }: Props) => {
  const t = gitCdLocales[inLanguage];
  const languageByPlatform = {
    macOS: t.platforms.macOS.language,
    Windows: t.platforms.Windows.language,
  };
  const quickInstallCommandByPlatform = {
    macOS: t.platforms.macOS.quickInstallCommand,
    Windows: t.platforms.Windows.quickInstallCommand,
  };
  const cloneInstallCommandByPlatform = {
    macOS: t.platforms.macOS.cloneInstallCommand,
    Windows: t.platforms.Windows.cloneInstallCommand,
  };

  const renderStepsSection = (platform: keyof typeof t.platforms) => {
    const currentPlatform = t.platforms[platform];
    return (
      <>
        <Heading level={3}>{t.setupStepsSection}</Heading>
        <ol className="mb-4 space-y-2.5 [counter-reset:step]">
          {currentPlatform.steps.map((step, index) => {
            const key = `${platform}-step-${index}`;
            return (
              <li
                key={key}
                className="flex items-start gap-3 text-sm [counter-increment:step] before:shrink-0 before:content-[counter(step)_'.']"
              >
                <span>{step}</span>
              </li>
            );
          })}
        </ol>
      </>
    );
  };

  return (
    <>
      <PageTitle title={pageTitle} following={following} lang={inLanguage} description={description}>
        <div className="my-paragraph">
          <CodeBlock
            title="📁 Here’s how it works - zsh"
            code={[
              '$ pwd',
              '/Users/admin',
              '$ git cd',
              '$ pwd',
              '/Users/admin/repos/github.com/hiroya-uga/git-cd',
            ].join('\n')}
            language="sh"
            className="rounded-b-lg"
            nowrap
          />
        </div>
        <p>{t.introText}</p>
        <p className="mt-2 text-right text-xs text-slate-600 dark:text-[#a5b4cd]">
          {inLanguage === 'ja' ? <Link href="./en">* View in English</Link> : <Link href="../">※ 日本語はこちら</Link>}
        </p>
      </PageTitle>

      <Heading level={2}>{t.installSection}</Heading>

      <p className="mb-4 text-sm leading-relaxed">{t.installDescription}</p>
      <div className="space-y-4">
        <CodeBlockWithPlatform
          codes={cloneInstallCommandByPlatform}
          language={languageByPlatform}
          title={t.cloneInstallTitle}
          className="rounded-b-lg"
          nowrap
          copyButton
        />
        <CodeBlockWithPlatform
          codes={quickInstallCommandByPlatform}
          language={languageByPlatform}
          title={t.quickInstallTitle}
          className="rounded-b-lg"
          nowrap
          copyButton
        />
      </div>

      <SwitchByPlatformSection
        content={{
          macOS: renderStepsSection('macOS'),
          Windows: renderStepsSection('Windows'),
        }}
      />
      <NoteList
        list={[
          {
            key: 'restart-notice',
            value: t.restartNotice,
          },
        ]}
      />

      <Heading level={2}>{t.commandsSection}</Heading>

      <div className="mb-4">
        <CodeBlock code={t.basicCommandsCode} language="sh" nowrap />
      </div>
      <NoteList
        list={[
          {
            key: 'fzf',
            value: t.fzfNote,
          },
        ]}
      />

      <Heading level={3}>{t.configSection}</Heading>
      <div className="mb-4 text-sm leading-relaxed">
        {t.configNotes.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      <CodeBlock
        code="git config --global git-cd.root ~/works"
        language="sh"
        className="rounded-b-lg"
        nowrap
        copyButton
      />

      <Heading level={3}>{t.commandGroups.options.label}</Heading>
      <div className="mb-paragraph">
        <CommandTable items={t.commandGroups.options.features} lang={inLanguage} />
      </div>
      <CodeBlock code="git cd ~/projects --depth 3" language="sh" className="rounded-b-lg" nowrap copyButton />

      <div className="mt-20 border-t border-t-slate-200 pt-8 text-slate-600 dark:border-t-slate-700 dark:text-[#a5b4cd]">
        <p className="mb-8 text-right text-xs">
          <a
            href="https://github.com/hiroya-uga/git-cd"
            className="underline underline-offset-2 transition-colors dark:text-[#85b4ff]"
          >
            View on GitHub →
          </a>
        </p>
        <p className="mt-share-buttons grid justify-end">
          <TweetLink hashtags={['git']} lang={inLanguage} />
        </p>
      </div>
    </>
  );
};
