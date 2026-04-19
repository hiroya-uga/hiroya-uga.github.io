'use client';

import { GA_MEASUREMENT_ID } from '@/constants/id';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import ReactGA from 'react-ga4';

import { RunButton, TextLink } from '@/components/Clickable';
import { SITE_NAME } from '@/constants/meta';
import { Lang } from '@/types/lang';
import clsx from 'clsx';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './CookieConsentDialog.module.css';

const initGA = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send({ hitType: 'pageview', page: pathname + searchParams.toString() });
};

const i18n = {
  ja: {
    title: 'Cookieについて',
    agreeLabel: '同意する',
    disagreeLabel: '同意しない',
    descriptions: [
      '当サイトでは Google社が提供するアクセス解析ツール「Google Analytics」を利用しています。',
      (agreeLabel: string) => `Cookieの利用に同意していただける場合は${agreeLabel}ボタンからご入場ください。`,
    ] as const,
    readMoreLabel: 'もっと詳しく',
    moreDescriptions: [
      '「Google Analytics」は利用状況の把握のためにCookieを使用して、利用者のウェブサイト訪問履歴などの情報を収集しています。',
      '収集されたデータは匿名で集計されており、個人を特定する情報は含まれません。',
      '「同意しない」を選択すると、Cookieを利用せずに当サイトが閲覧できます。',
      '同意後もプライバシーポリシーページから再度拒否することができます。',
      <>
        詳細は
        <TextLink href="https://policies.google.com/privacy?hl=ja" target="_blank">
          Googleのプライバシーポリシー
        </TextLink>
        および
        <TextLink href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank">
          オプトアウト方法
        </TextLink>
        をご確認ください。
      </>,
    ] as const,
  },
  en: {
    title: 'We use cookies',
    agreeLabel: 'Accept',
    disagreeLabel: 'Decline',
    descriptions: [
      'We use Google Analytics to understand how visitors use this site.',
      (agreeLabel: string) => `If you agree to the use of cookies, click "${agreeLabel}" to continue using this site.`,
    ] as const,
    readMoreLabel: 'Learn more about cookies',
    moreDescriptions: [
      'Google Analytics uses cookies to collect information about how visitors use this site in order to analyze usage.',
      'The collected data is aggregated and anonymized, and does not identify individual users.',
      'If you choose "Decline", you can continue to browse this site without the use of cookies.',
      'You can change your preference at any time from the privacy policy page.',
      <>
        For more details, please refer to{' '}
        <TextLink href="https://policies.google.com/privacy?hl=en" target="_blank" lang="en">
          Google's Privacy Policy
        </TextLink>{' '}
        and{' '}
        <TextLink href="https://tools.google.com/dlpage/gaoptout?hl=en" target="_blank" lang="en">
          opt-out options
        </TextLink>
        .
      </>,
    ] as const,
  },
} satisfies Record<Lang, unknown>;

const MajimenaNaiyou = ({ lang = 'ja', agreeLabel }: { lang?: Lang; agreeLabel: string }) => {
  const t = i18n[lang];

  return (
    <>
      <p>{t.descriptions[0]}</p>
      <p>{t.descriptions[1](agreeLabel)}</p>
      <details className="group">
        <summary className="group-open:list-[disclosure-open]! list-item w-fit [list-style:inside_disclosure-closed] after:hidden hover:underline">
          {t.readMoreLabel}
        </summary>
        <div className="pl-4 pt-4">
          <p>{t.moreDescriptions[0]}</p>
          <p>{t.moreDescriptions[1]}</p>
          <p>{t.moreDescriptions[2]}</p>
          <p>{t.moreDescriptions[3]}</p>
          <p className="mt-2">{t.moreDescriptions[4]}</p>
        </div>
      </details>
    </>
  );
};

export function CookieConsentDialog() {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isInEnglish = usePathname().endsWith('/en/');
  const isFromSNSApp = useSearchParams()?.get('utm_medium') === 'social';
  const shouldShowBanner = useRef(isInEnglish || isFromSNSApp);

  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isAfterBannerDialogCloseRequest, setIsAfterBannerDialogCloseRequest] = useState(false);

  const shouldShowDialog = useSyncExternalStore(
    () => () => () => {},
    () => {
      const cookieConsent = getLocalStorage('cookie-consent');
      return cookieConsent === null;
    },
    () => true,
  );

  useEffect(() => {
    if (shouldShowDialog === false) {
      initGA();
      return;
    }

    if (dialogRef.current) {
      if (shouldShowBanner.current) {
        const dialog = dialogRef.current;
        const setTimeoutId = globalThis.window.setTimeout(() => {
          setIsBannerDialogOpen(true);
          requestAnimationFrame(() => {
            dialog.querySelector('h2')?.focus({
              preventScroll: true,
            });
          });
        }, 10000);
        return () => {
          clearTimeout(setTimeoutId);
        };
      } else {
        // SNS経由ではない場合
        dialogRef.current.showModal();
        dialogRef.current.scroll(0, 0);
      }
    }
  }, [shouldShowDialog]);

  const closeDialog = useCallback((state: 'accepted' | 'rejected') => {
    setLocalStorage('cookie-consent', state);
    setIsAfterBannerDialogCloseRequest(true);

    if (state === 'accepted') {
      initGA();
    }

    document.documentElement.setAttribute('data-cookie-consent', state);
    dialogRef.current?.close();
    document.body.tabIndex = -1;
    document.body.focus({
      preventScroll: true,
    });
  }, []);

  if (shouldShowDialog === false && isBannerDialogOpen === false) {
    return;
  }

  if (shouldShowBanner.current) {
    const t = i18n[isInEnglish ? 'en' : 'ja'];

    return (
      <dialog
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby={id}
        aria-describedby={`${id}-description`}
        aria-modal="false"
        className={clsx([
          'bg-secondary border-t-primary @container bottom-0 left-0 block w-full border-t p-4 transition-[translate,opacity,visibility] duration-500',
          isAfterBannerDialogCloseRequest ||
            'not-open:translate-y-full not-open:invisible not-open:opacity-0 not-open:pointer-events-none sticky',
          isAfterBannerDialogCloseRequest && 'pointer-events-none invisible fixed opacity-0',
        ])}
        closedby="none"
        open={isBannerDialogOpen}
      >
        <h2 id={id} className="mb-2 font-bold" tabIndex={-1}>
          {t.title}
        </h2>
        <div className="text-xs" id={`${id}-description`}>
          <MajimenaNaiyou lang={isInEnglish ? 'en' : 'ja'} agreeLabel={t.agreeLabel} />
        </div>
        <div className="@w400:mr-0 mx-auto mt-2 grid w-fit grid-cols-2 gap-4">
          <p className="">
            <RunButton onClick={() => closeDialog('rejected')}>{t.disagreeLabel}</RunButton>
          </p>

          <p className="">
            <RunButton type="button" onClick={() => closeDialog('accepted')}>
              {t.agreeLabel}
            </RunButton>
          </p>
        </div>
      </dialog>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={id}
      className={clsx(
        styles.root,
        'starting:opacity-0 text-primary transition-fade inset-0 m-auto cursor-crosshair duration-500',
      )}
      closedby="none"
    >
      <div className="@container scroll-hint-y m-auto grid place-items-center overflow-auto rounded-lg px-4 pb-8 pt-6 text-sm shadow-lg">
        <div className="@w640:pt-2 w-full max-w-[min(40rem,88%)]">
          <h2
            tabIndex={-1} // for Safari
            id={id}
            className="mb-paragraph pb-paragraph border-b border-dashed border-[#585858]/50 shadow-none outline-none dark:border-[#c2c2c2]/50"
          >
            <span className="@w640:mx-0 @w640:text-lg mx-auto block w-fit text-base text-[#585858] dark:text-[#c2c2c2]">
              † YOUR COOKIE PREFERENCES †
            </span>
          </h2>
          <div className="mb-paragraph text-sm">
            <p>当サイトは「うぇぶ⭐︎ひょーじゅん！」の二次創作を扱う非公式ファンサイトです。</p>
            <ul className="mb-4">
              {[
                '当サイトの画像および内容などの無断転載、加工使用、再配布、直リンクなどは禁止です。',
                '表示がおかしい場合はIE6.0以上、800×600以上の環境でご覧ください。',
                'この先、BGMが自動再生されます。不要な方はBGMオフのリンクからご入場ください。',
              ].map((item) => (
                <li key={item} className="flex">
                  <span aria-hidden="true">・</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mb-1">
              <p className="min-w-200px aspect-200/40 grid w-fit cursor-default border border-solid border-black dark:border-white">
                <span className="bg-tertiary content-end border border-solid border-transparent px-1 py-1.5 text-right font-mono text-xs leading-none dark:border-black dark:bg-gray-300 dark:text-black">
                  <span>{SITE_NAME}</span>
                </span>
              </p>
            </div>
            <p className="flex text-xs">
              <span className="shrink-0">推奨環境：</span>
              <span>Windows XP IE6.0↑／フォントサイズ：中↑／解像度：1024ｘ768↑</span>
            </p>
          </div>

          <p>
            なお、ここまでの内容はすべて
            <strong>
              <ruby>
                嘘<rt>うそ</rt>
              </ruby>
            </strong>
            です。
          </p>

          <MajimenaNaiyou agreeLabel="Enter" />

          <p className="mt-8">
            <button
              type="button"
              className="@w640:text-4xl hover:text-link text-3xl underline"
              onClick={() => closeDialog('accepted')}
              title="Cookie利用に同意してコンテンツを閲覧する"
            >
              {`>>ENTER`}
            </button>
          </p>
        </div>
        {/* 目の錯覚分 + 5rem */}
        <div className="@w640:mt-0 mt-8 w-full max-w-[min(45rem,88%)]">
          <p className="@w640:justify-end grid justify-center">
            <RunButton onClick={() => closeDialog('rejected')}>同意せずに閲覧する</RunButton>
          </p>
        </div>
      </div>
    </dialog>
  );
}
