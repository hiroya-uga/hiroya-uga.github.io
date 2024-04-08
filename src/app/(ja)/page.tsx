import { Counter, LinkList, TopImage } from '@/app/(ja)/Client';
import { Footer } from '@/components/structures/Footer';
import { SITE_NAME } from '@/constants/meta';
import { externalMediaLinkList } from '@/data/externalMediaLinkList';
import { Metadata } from '@/types/seo';

import { useId } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'Web標準とWebアクセシビリティの話が好きな、大器晩成型のフロントエンドエンジニアの物置。',
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Web標準とWebアクセシビリティの話が好きな、大器晩成型のフロントエンドエンジニアの物置。',
  },
};

export default function Home() {
  const captionId = useId();

  return (
    <>
      <header className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-content">
          <div className="items-center text-center md:mb-2 md:flex">
            <h1 className="mb-3 text-2xl font-bold leading-none md:mb-0">{metadata.title}</h1>
            <p className="text-xs">
              <span className="hidden px-2 md:inline">-</span>
              <span>
                Web標準とアクセシビリティの話が好きな、
                <span className="inline-block">大器晩成型のフロントエンドエンジニアの物置。</span>
              </span>
            </p>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto mb-4 max-w-content">
          <TopImage captionId={captionId} />
        </div>

        <div className="mb-16 px-[16px] sm:mb-28">
          <div className="mx-auto max-w-content">
            <p className="mb-20 text-center text-sm sm:mb-28">
              <span>ようこそ {SITE_NAME} へ。</span>
              <span className="block sm:inline">
                あなたは
                <Counter />
                番目の訪問者かもしれません。
              </span>
            </p>

            <h2 className="mb-4 text-2xl">The power of the web</h2>

            <blockquote
              cite="https://www.w3.org/mission/accessibility/"
              lang="en"
              className="mb-20 text-center sm:mb-24"
            >
              <p className="mb-2 text-xs sm:text-base">
                “
                <a href="https://www.w3.org/mission/accessibility/">
                  The power of the Web is in its universality. Access by everyone regardless of disability is an
                  essential aspect.
                </a>
                ”
              </p>

              <footer className="text-center text-2xs sm:text-sm">
                <p>—Tim Berners-Lee, W3C Director and inventor of the World Wide Web</p>
              </footer>
            </blockquote>

            <h2 className="mb-4 text-2xl">Pick up</h2>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  emoji: '🌳',
                  href: '/tools/an-alt-decision-tree',
                  title: '代替テキスト２択チャート',
                  description:
                    'An alt Decision Treeを参考に作られた、画像の代替テキストと呼ばれるalt属性値を決める手助けをする２択チャートです。',
                },
                {
                  emoji: '🖼',
                  href: '/documents/translations/w3c/wai/tutorials/images',
                  title: '日本語訳：Images Tutorial',
                  description: 'WAI(W3C)による代替テキストに関するチュートリアルの日本語訳。',
                },
                {
                  emoji: '📝',
                  href: '/documents/translations/pauljadam-modern-web-a11y-demos',
                  title: "日本語訳：PaulJAdam's Modern Web Accessibility Demos",
                  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
                },
                {
                  emoji: '📛',
                  href: '/tools/accessible-name-and-description-computation/',
                  title: 'Accessible Name and Description Computation Playground',
                  description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
                },
                {
                  emoji: '👆',
                  href: '/tools/touch-event-touches',
                  title: 'TouchEvent.touches Playground',
                  description: 'デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかをテストできます。',
                },
                {
                  emoji: '📏',
                  href: '/tools/css-units/',
                  title: 'CSS Units Playground',
                  description: 'それぞれのCSSの単位が、実際にはどのようなCSSピクセルになるのかを確認できるページです。',
                },
              ].map(({ emoji, href, title, description }) => {
                const id = description && href;

                return (
                  <li key={href}>
                    <p className="mb-1">
                      <Link href={href} className="flex flex-col-reverse no-underline" aria-describedby={id}>
                        <span className="inline-block leading-normal">
                          {title}
                          {/* {item.isWip && <b>（WIP）</b>} */}
                        </span>
                        <span
                          className="mb-3 grid aspect-[1.618_/_1] place-content-center rounded-md bg-gray-200 font-emoji text-5xl leading-none"
                          aria-hidden="true"
                        >
                          {emoji}
                        </span>
                      </Link>
                    </p>
                    {description && (
                      <p className="text-xs" id={id}>
                        {description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mb-20 bg-slate-200 px-[16px] py-11 pb-12 sm:mb-28">
          <div className="mx-auto max-w-content">
            <h2 className="mb-4 text-2xl">カテゴリー</h2>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  emoji: '🔧',
                  href: '/tools',
                  title: 'ツール集',
                },
                {
                  emoji: '📚',
                  href: '/documents',
                  title: '資料集',
                },
              ].map(({ emoji, href, title }) => {
                return (
                  <li key={href}>
                    <a href={href} className="block no-underline">
                      <span
                        className="mb-2 grid aspect-[1.618_/_1] place-content-center rounded-md bg-gray-50 font-emoji text-5xl leading-none"
                        aria-hidden="true"
                      >
                        {emoji}
                      </span>
                      <span className="font-bold">→ {title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="px-[16px]">
          <div className="mx-auto max-w-content">
            <h2 className="mb-7 text-2xl">外部メディア</h2>

            <table className="mb-2">
              <tbody>
                {externalMediaLinkList.slice(0, 3).map(({ date, title, href }, index) => {
                  return (
                    <tr key={href} className="leading-6 sm:leading-7">
                      <td className="pr-2 font-mono text-xs leading-[inherit] sm:pr-8 sm:text-sm">
                        <span className="inline-block">{date}</span>
                      </td>
                      <td className={clsx([index !== 2 && 'pb-3 sm:pb-4', 'text-sm leading-[inherit] sm:text-base'])}>
                        <a href={href} className="break-all">
                          {title}
                        </a>

                        <p className="overflow-hidden text-ellipsis text-xs text-gray-600">{new URL(href).hostname}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="mb-12 text-right sm:mb-28">
              <a href="/documents/media/">外部メディアリンク一覧</a>
            </p>

            <h2 className="mb-2 text-2xl">Bookmarks</h2>

            <p className="mb-4">外部サイトへのリンク集です。</p>

            <LinkList
              list={[
                {
                  href: 'https://html.spec.whatwg.org/multipage/',
                  hrefLang: 'en',
                  title: 'HTML Living Standard',
                  japanese: 'https://momdo.github.io/html/',
                },
                {
                  href: 'https://www.w3.org/TR/wai-aria-1.2/',
                  hrefLang: 'en',
                  title: 'Accessible Rich Internet Applications (WAI-ARIA) 1.2',
                  japanese: 'https://momdo.github.io/wai-aria-1.2/',
                },
                {
                  href: 'https://www.w3.org/TR/html-aria/',
                  hrefLang: 'en',
                  title: 'ARIA in HTML',
                  japanese: 'https://momdo.github.io/html-aria/',
                },
                {
                  href: 'https://w3c.github.io/wcag/guidelines/22/',
                  hrefLang: 'en',
                  title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
                  japanese: 'https://waic.jp/translations/WCAG22/',
                },
                {
                  href: 'https://www.w3.org/TR/wcag-3.0/',
                  hrefLang: 'en',
                  title: 'W3C Accessibility Guidelines (WCAG) 3.0',
                },
                {
                  href: 'https://www.w3.org/TR/html-aam-1.0/',
                  hrefLang: 'en',
                  title: 'HTML Accessibility API Mappings 1.0',
                },
                {
                  href: 'https://www.w3.org/WAI/ARIA/apg/',
                  hrefLang: 'en',
                  title: 'ARIA Authoring Practices Guide (APG)',
                },
                {
                  href: 'https://www.w3.org/WAI/tutorials/images/decision-tree/',
                  hrefLang: 'en',
                  title: 'An alt Decision Tree',
                  japanese: 'https://www.w3.org/WAI/tutorials/images/decision-tree/ja',
                },
                {
                  href: 'https://www.w3.org/Provider/Style/URI.html',
                  hrefLang: 'en',
                  title: "Hypertext Style: Cool URIs don't change.",
                  japanese: 'https://www.kanzaki.com/docs/Style/URI.html',
                },
                {
                  href: 'https://a11ysupport.io/',
                  hrefLang: 'en',
                  title: 'Accessibility Support',
                },
              ]}
            />

            <div className="mb-8 mt-12 grid-cols-[1fr_auto] grid-rows-[auto_1fr] border-t border-dashed border-t-gray-400 pt-12 sm:mb-0 sm:mt-28 sm:grid sm:gap-x-12 sm:pt-28">
              <h2 className="col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-2xl">PROFILE</h2>

              <p className="mx-auto mb-8 flex aspect-[8_/_5] max-w-[22.5rem] items-center gap-4 pr-4 leading-none sm:col-start-2 sm:col-end-3 sm:row-start-1 sm:row-end-3 sm:m-0 sm:aspect-auto sm:gap-x-6">
                <span className="grow whitespace-nowrap text-center text-xl leading-tight">
                  <span className="tracking-widest">宇賀景哉</span>
                  <span
                    className="palt block text-xs"
                    style={{
                      letterSpacing: '0.1375rem',
                    }}
                  >
                    Hiroya UGA
                  </span>
                </span>
                <span className="w-40">
                  <Image width={160} height={160} src="/profile.png" alt="" />
                </span>
              </p>

              <div className="col-start-1 col-end-2 row-start-2 row-end-3">
                <div className="sm:mb-4 sm:max-w-xl sm:pr-4">
                  <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
                  <p className="sm:palt inline-block">
                    「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
                  </p>
                  <p>アイコンは昔の上司がスマホで描いて送ってくれた似顔絵。</p>
                </div>
              </div>
            </div>

            <ul className="flex flex-wrap items-center gap-4">
              {(
                [
                  {
                    href: 'https://github.com/hiroya-uga',
                    src: '/common/images/github.svg',
                    alt: 'GitHub',
                  },
                  {
                    href: 'https://x.com/hiroya_UGA',
                    src: '/common/images/twitter.svg',
                    alt: 'Twitter',
                  },
                  {
                    href: 'https://www.instagram.com/hiroya_uga',
                    src: '/common/images/instagram.svg',
                    alt: 'Instagram',
                  },
                ] as const
              ).map(({ href, alt, ...props }) => {
                return (
                  <li key={href}>
                    <a href={href}>
                      <Image {...props} width={32} height={32} alt={alt} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
