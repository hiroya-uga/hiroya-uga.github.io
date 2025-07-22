'use client';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/layout.module.css';

import { Picture } from '@/components/Image';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

const CsunmobileNavigation = ({ fileName }: { fileName: string }) => {
  const linkList = [
    ['../form-bad', 'Form Bad'],
    ['../form-aria', 'Form ARIA'],
    ['../form-html5', 'Form HTML5'],
    ['../accordion-bad', 'Accordion Bad'],
    ['../accordion-aria', 'Accordion ARIA'],
  ];

  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
      {/*<!-- script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script -->*/}
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            html[lang] {
              font-size: inherit;
            }`,
        }}
      />

      <nav role="navigation" className="navbar navbar-inverse mt-2">
        <div className="container-fluid">
          <div className="navbar-header">
            {' '}
            <a className="navbar-brand" href="../">
              Workshop
            </a>{' '}
          </div>
          <div>
            <ul className="nav navbar-nav">
              {linkList.map(([href, textContent]) => {
                const current = fileName === href;

                return (
                  <li key={href} className={current ? 'active' : ''}>
                    <a href={`./${href}`} aria-current={current ? 'page' : undefined}>
                      {textContent}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default function PauljadamLayout({ children }: { children: React.ReactNode }) {
  const fileName =
    usePathname()?.replace('/documents/translations/pauljadam-modern-web-a11y-demos/', '').replace(/\/$/, '') ?? '';
  const isCsunmobile = fileName.startsWith('csunmobile');
  const originalPath = isCsunmobile
    ? `https://pauljadam.com/csunmobile/${fileName.replace('csunmobile/', '')}.html`
    : `https://pauljadam.com/demos/${fileName}.html`;

  return (
    <>
      <div className="border-secondary mb-4 mt-[calc(-1*var(--v-header-margin-bottom))] border-b border-dashed pb-6 sm:mb-7 sm:pb-9">
        <div className="text-2xs rounded-md bg-white p-2 leading-snug sm:p-4 sm:text-xs">
          <p className="mb-2 font-bold sm:mb-1.5">
            原文：
            <a href={originalPath} hrefLang="en" className="inline-block break-all">
              {originalPath}
            </a>
          </p>
          <p>
            <strong className="text-alert flex font-normal leading-[inherit] sm:font-bold">
              <span>※</span>
              <span>
                このページは動作確認用ページです。
                <span className="inline-block">一部アクセシビリティに配慮していないコンテンツが含まれます。</span>
              </span>
            </strong>
          </p>
        </div>
      </div>

      <p className="mb-3.5 flex flex-wrap gap-y-2 text-sm sm:mb-4 sm:text-base">
        <span className='after:mx-2 after:content-["|"]'>
          <Link href="/documents/translations/pauljadam-modern-web-a11y-demos">
            <Picture
              src="/common/images/icons/arrow-left.svg"
              width={16}
              height={16}
              alt=""
              className="mb-1 mr-1 inline-block size-3"
            />
            <span>DEMO一覧に戻る</span>
          </Link>
        </span>
        <a href="https://pauljadam.com/demos/" hrefLang="en">
          PaulJAdam.comでさらに詳しく（外部サイト）
        </a>
      </p>

      <div id={styles['pauljadam-modern-web-a11y-demos-content']}>
        {isCsunmobile && <CsunmobileNavigation fileName={fileName} />}

        {children}
      </div>
    </>
  );
}
