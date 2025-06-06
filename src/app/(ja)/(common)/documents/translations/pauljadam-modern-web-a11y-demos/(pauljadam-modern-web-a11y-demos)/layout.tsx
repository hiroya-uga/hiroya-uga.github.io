'use client';

import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/common.css';
import { PAUL_J_ADAM_MODERN_WEB_A11Y_DEMOS_CONTENT } from '@/constants/id';
import Image from 'next/image';

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
    ? `https://pauljadam.com/csunmobile/${fileName.replace('csunmobile-', '')}.html`
    : `https://pauljadam.com/demos/${fileName}.html`;

  return (
    <>
      <p className="mb-1 text-xs">
        原文：
        <a href={originalPath} hrefLang="en" className="break-all">
          {originalPath}
        </a>
      </p>
      <p className="mb-2 flex flex-wrap sm:mb-0">
        {/*
         * SPA遷移を考慮していない画面をリフレッシュさせる必要があるため、a要素を用いる
         * /documents/translations/pauljadam-modern-web-a11y-demos/buttons/
         */}
        <span className='after:mx-2 after:content-["|"]'>
          <a href="/documents/translations/pauljadam-modern-web-a11y-demos">
            <Image
              src="/common/images/icons/arrow-left.svg"
              width={16}
              height={16}
              alt=""
              className="mb-1 mr-1 inline-block size-3"
            />
            <span>DEMO一覧に戻る</span>
          </a>
        </span>
        <a href="https://pauljadam.com/demos/" hrefLang="en">
          PaulJAdam.comでさらに詳しく（外部サイト）
        </a>
      </p>

      <div id={PAUL_J_ADAM_MODERN_WEB_A11Y_DEMOS_CONTENT}>
        {isCsunmobile && <CsunmobileNavigation fileName={fileName} />}

        {children}
      </div>
    </>
  );
}
