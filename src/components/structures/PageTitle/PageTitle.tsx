import { PrivacyPolicyMessage } from '@/components/ui/embed/PrivacyPolicyMessage';
import { LangSwitchLink } from '@/components/ui/features/LangSwitchLink';
import clsx from 'clsx';

interface Props {
  title?: string;
  pageTitle?: string;
  previous?: string;
  following?: string;
  children?: React.ReactNode;
  description?: string;
  lang?: 'ja' | 'en';
  shouldShowPrivacyPolicyMessage?: boolean;
  shouldShowNonAccessibleMessage?: boolean;
  shouldShowOtherLanguageLink?: boolean;
}

export const PageTitle = ({
  title,
  pageTitle,
  previous,
  following,
  description,
  children,
  lang = 'ja',
  shouldShowPrivacyPolicyMessage = false,
  shouldShowNonAccessibleMessage = false,
  shouldShowOtherLanguageLink = false,
}: Readonly<Props>) => {
  const hasSubtitle = Boolean(previous || following);
  return (
    <div className="w640:mb-20 w320:break-normal mb-14 break-all">
      <h1
        className={clsx([
          hasSubtitle
            ? 'not-last:mb-2.5'
            : 'not-last:mb-3 w640:not-last:mb-2.5 w640:text-[2.625rem] w320:text-3xl text-2xl font-bold leading-relaxed',
          'leading-relaxed',
        ])}
      >
        {hasSubtitle ? (
          <>
            {previous && (
              <span className="bg-secondary border-secondary w640:-left-3 relative block w-fit rounded-2xl border px-3 py-1 text-sm font-bold text-[#666] dark:text-[#cacaca]">
                {previous}
              </span>
            )}
            <strong className="w640:text-[2.625rem] w320:text-3xl w320:leading-snug block min-h-[3.046875rem] pt-1 text-2xl font-bold">
              {pageTitle ?? title}
            </strong>
            {following && (
              <span className="w640:mt-2 w640:text-lg relative mt-3 block pl-9 font-bold leading-normal before:absolute before:left-0 before:top-[0.5lh] before:w-8 before:-translate-y-1/2 before:border before:border-t-black">
                {following}
              </span>
            )}
          </>
        ) : (
          (pageTitle ?? title)
        )}
      </h1>

      {shouldShowNonAccessibleMessage && (
        <p className="mb-paragraph">
          <strong className="text-alert">
            {lang === 'ja'
              ? '※このページは動作確認用ページです。 一部アクセシビリティに配慮していないコンテンツが含まれます。'
              : '※This page is for testing purposes. Some content may not be accessible.'}
          </strong>
        </p>
      )}

      <div className="w640:text-base text-sm">
        {description?.split('\n').map((description) => {
          return <p key={description}>{description}</p>;
        })}
        {children}

        {shouldShowPrivacyPolicyMessage && (
          <p className="mt-[0.75lh] flex gap-1 text-sm">
            <span>{lang === 'ja' ? '※' : '*'}</span>
            <small>
              <PrivacyPolicyMessage lang={lang} />
            </small>
          </p>
        )}

        {shouldShowOtherLanguageLink && (
          <p className="mt-2 text-right text-xs text-slate-600 dark:text-[#a5b4cd]">
            <LangSwitchLink lang={lang} />
          </p>
        )}
      </div>
    </div>
  );
};
