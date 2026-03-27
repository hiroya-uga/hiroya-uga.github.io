import { HelpLink } from '@/components/Clickable';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { Lang } from '@/types/lang';
import { Metadata } from '@/utils/get-metadata';
import Link from 'next/link';
import { Suspense } from 'react';
import { NuValidatorBookmarkletGenerator } from './Client';

const i18n = {
  ja: {
    aboutLink: 'The Nu Html Checkerについて',
    howToUseTitle: '使い方',
    steps: [
      'ブックマークレット（JavaScriptコード）をコピーする',
      'ブラウザで新しいブックマークを作成し、ブックマークのURL欄にコピーしたコードを貼り付ける',
      '検証したいWebページを開く',
      '作成したブックマーク（＝ブックマークレット）をクリックする',
    ],
  },
  en: {
    aboutLink: 'About the Nu Html Checker',
    howToUseTitle: 'How to use',
    steps: [
      'Copy the bookmarklet (JavaScript code)',
      'Create a new bookmark in your browser and paste the copied code into the URL field',
      'Open the web page you want to validate',
      'Click the bookmark you just created (= the bookmarklet)',
    ],
  },
} satisfies Record<Lang, unknown>;

export const ToolsNuBookmarkletGeneratorPage = ({
  lang,
  metadata,
}: {
  lang: Lang;
  metadata: Pick<Metadata, 'pageTitle' | 'following' | 'description'>;
}) => {
  const t = i18n[lang];

  return (
    <>
      <PageTitle title={metadata.pageTitle} following={metadata.following} lang={lang} shouldShowPrivacyPolicyMessage>
        {metadata.description.split('\n').map((description) => {
          return <p key={description}>{description}</p>;
        })}
        <p className="mt-4">
          <HelpLink href="https://validator.w3.org/nu/about.html" hrefLang="en">
            {t.aboutLink}
          </HelpLink>
        </p>
      </PageTitle>

      <div className="bg-secondary mx-auto max-w-5xl rounded-2xl px-4 pb-10 pt-2.5 shadow-md sm:pb-14">
        <p className="sm:mb-34px mb-2 text-right text-xs">
          {lang === 'ja' ? <Link href="./en">* View in English</Link> : <Link href="../">※ 日本語はこちら</Link>}
        </p>
        <Suspense>
          <NuValidatorBookmarkletGenerator lang={lang} />
        </Suspense>
      </div>

      <section className="mx-auto mt-12 max-w-5xl px-4">
        <h2 className="mb-4 text-lg font-bold">{t.howToUseTitle}</h2>
        <ol className="space-y-2.5 pl-0.5 [counter-reset:step]">
          {t.steps.map((step) => (
            <li
              key={step}
              className="flex items-start gap-3 text-sm [counter-increment:step] before:shrink-0 before:content-[counter(step)_'.']"
            >
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink hashtags={['html', 'bookmarklet']} lang={lang} />
      </p>
    </>
  );
};
