import { PageTitle } from '@/components/structures/PageTitle';
import { ShareSection } from '@/components/structures/ShareSection';
import { CodeBlock } from '@/components/ui/embed/CodeBlock';
import { CodeBlockWithPlatform } from '@/components/ui/embed/CodeBlockWithPlatform';
import { LangSwitchLink } from '@/components/ui/features/LangSwitchLink';
import { Heading } from '@/components/ui/headings/Heading';
import { NoteList } from '@/components/ui/lists/NoteList';
import { CommandTable } from '@/components/ui/tables/CommandTable';
import { Table } from '@/components/ui/tables/Table';
import { GETTING_STARTED_ID } from '@/constants/id';
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
          <LangSwitchLink lang={inLanguage} />
        </p>
      </PageTitle>

      <Heading level={2}>{t.whySection}</Heading>
      <p className="-mt-3 mb-4 text-sm">
        <Link href={`#${GETTING_STARTED_ID}`} className='after:content-["_↓"]'>
          {t.installSection}
        </Link>
      </p>
      <div className="mb-4 space-y-2 text-sm leading-relaxed">
        {t.whyTexts.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <Heading level={3}>{t.comparisonSection}</Heading>
      <div className="mb-8">
        <Table>
          <thead className="w640:table-header-group border-primary block border-b bg-slate-50 dark:bg-slate-800/50">
            <tr className="w640:table-row block">
              <th scope="col" className="w640:table-cell block px-3 py-2 text-left font-medium">
                {t.comparisonMethodLabel}
              </th>
              <th scope="col" className="w640:table-cell block px-3 py-2 text-left font-medium">
                {t.comparisonNoteLabel}
              </th>
            </tr>
          </thead>
          <tbody className="w640:table-row-group w640:[&>tr:not(:first-child)>*]:border-t w640:[&>tr:not(:first-child)>*]:border-primary divide-primary block divide-y dark:divide-slate-600">
            {t.comparisonItems.map(({ method, note, highlight }) => (
              <tr key={method} className="w640:table-row block">
                <th
                  scope="row"
                  className={`w640:table-cell w640:py-2 block overflow-auto whitespace-nowrap px-3 pt-2 text-left align-middle ${highlight ? 'font-semibold' : 'font-normal'}`}
                >
                  {method}
                </th>
                <td
                  className={`w640:table-cell w640:py-2 block px-3 pb-2 align-middle leading-relaxed ${highlight ? 'font-semibold' : ''}`}
                >
                  {note}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Heading level={3}>{t.targetSection}</Heading>
      <ul className="mb-8 list-disc space-y-1 pl-5 text-sm">
        {t.targetItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <Heading level={2} id={GETTING_STARTED_ID}>
        {t.installSection}
      </Heading>

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
      </div>

      <ShareSection lang={inLanguage} />
    </>
  );
};
