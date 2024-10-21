'use client';

import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/common.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/structures/Footer';
import { SiteName } from '@/components/structures/Header/SiteName';

const CsunmobileNavigation = ({ fileName }: { fileName: string }) => {
  const linkList = [
    ['../csunmobile-form-bad', 'Form Bad'],
    ['../csunmobile-form-aria', 'Form ARIA'],
    ['../csunmobile-form-html5', 'Form HTML5'],
    ['../csunmobile-accordion-bad', 'Accordion Bad'],
    ['../csunmobile-accordion-aria', 'Accordion ARIA'],
  ];

  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
      {/*<!-- script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script -->*/}
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

      <nav role="navigation" className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            {' '}
            <a className="navbar-brand" href="./csunmobile-index">
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
    ? `https://pauljadam.com/csunmobile/${fileName.replace('csunmobile-', '')}.html`
    : `https://pauljadam.com/demos/${fileName}.html`;

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <div>
        <header>
          <SiteName />
          <div className="mb-12 px-4 pt-4 sm:pt-12">
            <div className="mx-auto max-w-content">
              <p className="mb-4 rounded border border-gray-400 p-4">
                原文：
                <a href={originalPath} hrefLang="en" className="break-all">
                  {originalPath}
                </a>
              </p>
              <p className="text-xs sm:text-sm">
                {/*
                 * SPA遷移を考慮していない画面をリフレッシュさせる必要があるため、a要素を用いる
                 * /documents/translations/pauljadam-modern-web-a11y-demos/buttons/
                 */}
                <a href="../">DEMO一覧に戻る</a> |{' '}
                <a href="https://pauljadam.com/demos/" hrefLang="en">
                  PaulJAdam.comでさらに詳しく（外部サイト）
                </a>
              </p>
            </div>
          </div>
        </header>

        {isCsunmobile && (
          <div className="px-4">
            <div className="mx-auto max-w-content">
              <CsunmobileNavigation fileName={fileName} />
            </div>
          </div>
        )}
      </div>

      <main className="px-4">
        <div className="mx-auto max-w-content">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
