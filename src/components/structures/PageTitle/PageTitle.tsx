import { PrivacyPolicyMessage } from '@/constants/message';
import clsx from 'clsx';

export const PageTitle = ({
  title,
  pageTitle,
  previous,
  following,
  description,
  children,
  shouldShowPrivacyPolicyMessage = false,
  shouldShowNonAccessibleMessage = false,
}: {
  title?: string;
  pageTitle?: string;
  previous?: string;
  following?: string;
  children?: React.ReactNode;
  description?: string;
  shouldShowPrivacyPolicyMessage?: boolean;
  shouldShowNonAccessibleMessage?: boolean;
}) => {
  const hasSubtitle = Boolean(previous || following);
  return (
    <div className="mb-14 sm:mb-20">
      <h1
        className={clsx([
          hasSubtitle
            ? 'not-last:mb-2.5'
            : 'not-last:mb-3 sm:not-last:mb-2.5 text-3xl font-bold leading-relaxed sm:text-[2.625rem]',
          'leading-relaxed',
        ])}
      >
        {hasSubtitle ? (
          <>
            {previous && (
              <span className="relative -left-3 block w-fit rounded-2xl bg-white px-3 py-1 text-sm font-bold text-[#666]">
                {previous}
              </span>
            )}
            <strong className="block min-h-[3.046875rem] pt-1 text-3xl font-bold leading-snug sm:text-[2.625rem]">
              {title}
            </strong>
            {following && (
              <span className="relative mt-3 block pl-9 font-bold leading-normal before:absolute before:left-0 before:top-[0.5lh] before:w-8 before:-translate-y-1/2 before:border before:border-t-black sm:mt-2 sm:text-lg">
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
            ※このページは動作確認用ページです。 一部アクセシビリティに配慮していないコンテンツが含まれます。
          </strong>
        </p>
      )}

      <div className="text-sm sm:text-base">
        {description?.split('\n').map((description) => {
          return <p key={description}>{description}</p>;
        })}
        {children}

        {shouldShowPrivacyPolicyMessage && (
          <p className="flex gap-1 text-sm">
            <span>※</span>
            <small>
              <PrivacyPolicyMessage />
            </small>
          </p>
        )}
      </div>
    </div>
  );
};
