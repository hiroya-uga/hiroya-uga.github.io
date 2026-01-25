'use client';

import { GA_MEASUREMENT_ID } from '@/constants/id';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useId, useRef, useSyncExternalStore } from 'react';
import ReactGA from 'react-ga4';

import { RunButton, TextLink } from '@/components/Clickable';
import styles from '@/components/Dialog/CookieConsentDialog.module.css';
import { SITE_NAME } from '@/constants/meta';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

const initGA = () => {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send({ hitType: 'pageview', page: pathname + searchParams.toString() });
};

const MajimenaNaiyou = ({ agreeLabel }: { agreeLabel: string }) => {
  return (
    <>
      <p>当サイトでは Google社が提供するアクセス解析ツール「Google Analytics」を利用しています。</p>
      <p>Cookieの利用に同意していただける場合は{agreeLabel}からご入場ください。</p>
      <details className="group">
        <summary className="group-open:list-[disclosure-open]! list-item w-fit [list-style:inside_disclosure-closed] after:hidden hover:underline">
          もっと詳しく
        </summary>
        <div className="pl-4 pt-4">
          <p>
            「Google
            Analytics」は利用状況の把握およびサービス改善のためにCookieを使用して、利用者のウェブサイト訪問履歴などの情報を収集しています。
          </p>
          <p>収集されたデータは匿名で集計されており、個人を特定する情報は含まれません。</p>
          <p>「同意しない」を選択すると、Cookieを利用せずに当サイトが閲覧できます。</p>
          <p>同意後もプライバシーポリシーページから再度拒否することができます。</p>
          <p className="mt-2">
            詳細は
            <TextLink href="https://policies.google.com/privacy?hl=ja" target="_blank">
              Googleのプライバシーポリシー
            </TextLink>
            および
            <TextLink href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank">
              オプトアウト方法
            </TextLink>
            をご確認ください。
          </p>
        </div>
      </details>
    </>
  );
};

export function CookieConsentDialog() {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isFromSNSApp = useSearchParams()?.get('utm_medium') === 'social';
  const shouldShowDialog = useSyncExternalStore(
    () => () => () => {},
    () => {
      const cookieConsent = getLocalStorage('cookie-consent');
      return cookieConsent !== 'accepted';
    },
    () => true,
  );

  useEffect(() => {
    if (shouldShowDialog === false) {
      initGA();
      return;
    }

    if (dialogRef.current) {
      if (dialogRef.current.open === false) {
        // SNS経由ではない場合
        dialogRef.current.showModal();
        dialogRef.current.scroll(0, 0);
      } else {
        dialogRef.current.focus({
          preventScroll: true,
        });
      }
    }
  }, [shouldShowDialog]);

  const closeDialog = useCallback((state: 'accepted' | 'rejected') => {
    setLocalStorage('cookie-consent', state);

    if (state === 'accepted') {
      initGA();
    }

    document.documentElement.setAttribute('data-cookie-consent', state);
    dialogRef.current?.close();
    document.body.tabIndex = -1;
    document.body.focus();
  }, []);

  if (shouldShowDialog === false) {
    return;
  }

  if (isFromSNSApp === true) {
    return (
      <dialog
        ref={dialogRef}
        aria-labelledby={id}
        className="not-open:transition-fade not-open:opacity-0 not-open:invisible bg-secondary border-t-primary @container starting:translate-y-full sticky bottom-0 left-0 block w-full border-t p-4 transition-[translate] focus-visible:shadow-none focus-visible:outline-none"
        open
      >
        <h2 id={id} className="mb-2 font-bold">
          Cookieについて
        </h2>
        <div className="text-xs">
          <MajimenaNaiyou agreeLabel="同意ボタン" />
        </div>
        <div className="@w400:mr-0 mx-auto mt-2 grid w-fit grid-cols-2 gap-4">
          <p className="">
            <RunButton onClick={() => closeDialog('rejected')}>同意しない</RunButton>
          </p>

          <p className="">
            <RunButton type="button" onClick={() => closeDialog('accepted')}>
              同意する
            </RunButton>
          </p>
        </div>
      </dialog>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={id}
      className={clsx(styles.root, 'starting:opacity-0 text-primary transition-fade inset-0 m-auto duration-500')}
    >
      <div className="@container scroll-hint-y m-auto grid place-items-center overflow-auto rounded-lg px-4 pb-8 pt-6 text-sm shadow-lg">
        <div className="@w640:pt-2 w-full max-w-[min(40rem,88%)]">
          <h2
            tabIndex={-1} // for Safari
            id={id}
            className="mb-paragraph pb-paragraph border-b border-dashed border-[#585858]/50 shadow-none outline-none dark:border-[#c2c2c2]/50"
          >
            <span className="@w640:mx-0 mx-auto block w-fit text-lg text-[#585858] dark:text-[#c2c2c2]">
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
              <p className="min-w-200px cursor- grid aspect-[200/40] w-fit border border-solid border-black dark:border-white">
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
