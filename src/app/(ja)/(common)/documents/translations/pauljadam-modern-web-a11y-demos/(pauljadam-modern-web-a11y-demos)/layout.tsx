'use client';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/layout.module.css';

import Image from 'next/image';
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
      <p className="mb-1 text-xs">
        原文：
        <a href={originalPath} hrefLang="en" className="break-all">
          {originalPath}
        </a>
      </p>
      <p className="mb-2 flex flex-wrap sm:mb-4">
        <span className='after:mx-2 after:content-["|"]'>
          <Link href="/documents/translations/pauljadam-modern-web-a11y-demos">
            <Image
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
