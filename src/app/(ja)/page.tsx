import { Counter, LinkList, TopImage } from '@/app/(ja)/Client';
import { Footer } from '@/components/structures/Footer';
import { SITE_NAME } from '@/constants/meta';
import { externalMediaLinkList } from '@/data/externalMediaLinkList';
import { Metadata } from '@/types/seo';

import { useId } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

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
      <header className="py-12 px-4 sm:py-16">
        <div className="max-w-content mx-auto">
          <div className="md:flex items-center md:mb-2 text-center">
            <h1 className="text-2xl font-bold leading-none mb-3 md:mb-0">{metadata.title}</h1>
            <p className="text-xs">
              <span className="px-2 hidden md:inline">-</span>
              <span>
                Web標準とアクセシビリティの話が好きな、
                <span className="inline-block">大器晩成型のフロントエンドエンジニアの物置。</span>
              </span>
            </p>
          </div>
        </div>
      </header>

      <main>
        <div className="mb-4 max-w-content mx-auto">
          <TopImage captionId={captionId} />
        </div>

        <div className="px-[16px]">
          <div className="max-w-content mx-auto">
            <p className="text-sm text-center mb-20 sm:mb-28">
              <span>ようこそ {SITE_NAME} へ。</span>
              <span className="block sm:inline">
                あなたは
                <Counter />
                番目の訪問者かもしれません。
              </span>
            </p>

            <h2 className="text-2xl mb-4">The power of the web</h2>

            <blockquote cite="https://www.w3.org/mission/accessibility/" lang="en" className="mb-20 text-center">
              <p className="mb-2 text-xs sm:text-base">
                “
                <a href="https://www.w3.org/mission/accessibility/">
                  The power of the Web is in its universality. Access by everyone regardless of disability is an
                  essential aspect.
                </a>
                ”
              </p>

              <footer className="text-center text-[0.625rem] sm:text-sm">
                <p>—Tim Berners-Lee, W3C Director and inventor of the World Wide Web</p>
              </footer>
            </blockquote>

            <h2 className="text-2xl mb-4">Pick up</h2>

            <ul className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  emoji: '🌳',
                  href: '/tools/an-alt-decision-tree',
                  title: '代替テキスト２択チャート',
                  desctiption:
                    'An alt Decision Treeを参考に作られた、画像の代替テキストと呼ばれるalt属性値を決める手助けをする２択チャートです。',
                },
                {
                  emoji: '🖼',
                  href: '/documents/translations/w3c/wai/tutorials/images',
                  title: '日本語訳：Images Tutorial',
                  desctiption: 'WAI(W3C)による代替テキストに関するチュートリアルの日本語訳。',
                },
                {
                  emoji: '📝',
                  href: '/documents/translations/pauljadam-modern-web-a11y-demos',
                  title: "日本語訳：PaulJAdam's Modern Web Accessibility Demos",
                  desctiption: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
                },
                {
                  emoji: '📛',
                  href: '/tools/accessible-name-and-description-computation/',
                  title: 'Playground: Accessible Name and Description Computation',
                  desctiption: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
                },
                {
                  emoji: '👆',
                  href: '/tools/touch-event-touches',
                  title: 'Playground: TouchEvent.touches',
                  desctiption: 'デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかをテストできます。',
                },
                {
                  emoji: '💭',
                  href: '/documents/fantasized-specs',
                  title: 'Fantasized Web Standards and Specifications',
                  desctiption: '日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
                },
              ].map(({ emoji, href, title, desctiption }) => {
                const id = desctiption && href;

                return (
                  <li key={href}>
                    <p className="mb-1">
                      <a href={href} className="no-underline flex flex-col-reverse" aria-describedby={id}>
                        <span className="inline-block leading-normal">
                          {title}
                          {/* {item.isWip && <b>（WIP）</b>} */}
                        </span>
                        <span
                          className="grid bg-gray-200 place-content-center text-5xl aspect-[1.618_/_1] mb-3 rounded-md leading-none font-emoji"
                          aria-hidden="true"
                        >
                          {emoji}
                        </span>
                      </a>
                    </p>
                    {desctiption && (
                      <p className="text-xs" id={id}>
                        {desctiption}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>

            <h3 className="text-lg mt-12 mb-4">外部メディア</h3>

            <table className="mb-2">
              <tbody>
                {externalMediaLinkList.slice(0, 3).map(({ date, title, href }, index) => {
                  return (
                    <tr key={href} className="leading-6 sm:leading-7">
                      <td className="pr-2 font-mono text-xs leading-[inherit] sm:text-sm sm:pr-8">
                        <span className="inline-block">{date}</span>
                      </td>
                      <td className={clsx([index !== 2 && 'pb-3 sm:pb-4', 'text-sm leading-[inherit] sm:text-base'])}>
                        <a href={href} className="break-all">
                          {title}
                        </a>

                        <p className="text-xs text-gray-600 text-ellipsis overflow-hidden">{new URL(href).hostname}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="text-right mb-12">
              <a href="/documents/media/">外部メディアリンク一覧</a>
            </p>
          </div>
        </div>

        <div className="px-[16px] py-11 pb-12 bg-slate-200 mb-12 sm:mb-28">
          <div className="max-w-content mx-auto">
            <h2 className="text-2xl mb-4">カテゴリー</h2>

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
                    <a href={href} className="no-underline block">
                      <span
                        className="grid bg-gray-50 place-content-center text-5xl aspect-[1.618_/_1] mb-2 rounded-md leading-none font-emoji"
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
          <div className="max-w-content mx-auto">
            <h2 className="text-2xl mb-2">Bookmarks</h2>

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
                  href: 'https://www.w3.org/Provider/Style/URI.html',
                  hrefLang: 'en',
                  title: "Hypertext Style: Cool URIs don't change.",
                  japanese: 'https://www.kanzaki.com/docs/Style/URI.html',
                },
              ]}
            />

            <div className="mt-12 pt-12 sm:mt-28 sm:pt-28 border-t border-t-gray-400 border-dashed mb-8 grid-cols-[1fr_auto] grid-rows-[auto_1fr] sm:grid sm:gap-x-12 sm:mb-0">
              <h2 className="text-2xl mt-0 mb-4 row-start-1 row-end-2 col-start-1 col-end-2">PROFILE</h2>

              <p className="leading-none mb-8 flex mx-auto pr-4 items-center gap-4 sm:row-start-1 sm:row-end-3 sm:col-start-2 sm:col-end-3 sm:gap-x-6 sm:m-0 max-w-[22.5rem] aspect-[8_/_5] sm:aspect-auto">
                <span className="whitespace-nowrap grow text-center text-xl leading-tight">
                  <span className="tracking-widest">宇賀景哉</span>
                  <span
                    className="block text-xs palt"
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

              <div className="row-start-2 row-end-3 col-start-1 col-end-2">
                <div className="sm:max-w-xl sm:mb-4 sm:pr-4">
                  <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
                  <p className="inline-block sm:palt">
                    「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
                  </p>
                  <p>アイコンは昔の上司がスマホで描いて送ってくれた似顔絵。</p>
                </div>
              </div>
            </div>

            <ul className="flex gap-4 flex-wrap items-center">
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
