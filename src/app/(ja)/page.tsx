import { Footer } from '@/components/structures/Footer';
import { META } from '@/constants/meta';
import { externalMediaLinkList } from '@/data/externalMediaLinkList';

import clsx from 'clsx';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata & { title: string } = {
  title: META.siteName,
  description: 'Web開発者の物置。',
};

export default function Home() {
  return (
    <>
      <header className="py-12 px-4 sm:py-16">
        <div className="max-w-content mx-auto">
          <h1 className="text-2xl font-bold leading-none">{metadata.title}</h1>
        </div>
      </header>

      <main className="px-[16px]">
        <div className="max-w-content mx-auto">
          <blockquote
            cite="https://www.w3.org/mission/accessibility/"
            lang="en"
            className="mb-8 p-4 bg-gray-200 rounded-sm sm:py-6 sm:px-8"
          >
            <p className="mb-2">
              <a href="https://www.w3.org/mission/accessibility/">
                The power of the Web is in its universality. Access by everyone regardless of disability is an essential
                aspect.
              </a>
            </p>

            <footer className="text-right">
              <p>—Tim Berners-Lee, W3C Director and inventor of the World Wide Web</p>
            </footer>
          </blockquote>
          <p className="mb-12 sm:mb-28 leading-relaxed">
            <span>
              Sono uchi main visual wo oku yotei desu. Space ga amatteru kara toriaezu Lorem ipsum demo kaite okouyo:{' '}
            </span>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, voluptates vel voluptatem quae eos
              similique harum at eligendi enim sint pariatur quasi quos, natus quidem laudantium quisquam non minima
              rerum?
            </span>
          </p>

          <h2 className="text-2xl mb-4">Menu</h2>

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
                emoji: '⚗️',
                href: '/tools/dom-events-watcher',
                title: 'DOM Event Watcher',
                desctiption: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
              },
              {
                emoji: '💭',
                href: '/documents/fantasized-specs',
                title: 'Fantasized Web Standards and Specifications',
                desctiption: 'English Only. 日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
                hrefLang: 'en',
              },
            ].map(({ emoji, href, title, hrefLang, desctiption, ...item }) => {
              const id = desctiption && href;

              return (
                <li key={href}>
                  <p className="mb-1">
                    <a
                      href={href}
                      hrefLang={hrefLang}
                      className="no-underline flex flex-col-reverse"
                      aria-describedby={id}
                    >
                      <span className="inline-block leading-normal">
                        {title}
                        {/* {item.isWip && <b>（WIP）</b>} */}
                      </span>
                      <span
                        className="grid bg-gray-200 place-content-center text-5xl aspect-[1.618_/_1] mb-4 rounded-md leading-none"
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

          <h3 className="text-lg mb-4">External Media Links</h3>

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

          <p className="text-right mb-12 sm:mb-28">
            <a href="/documents/media/">View All</a>
          </p>

          <h2 className="text-2xl mb-4">Bookmarks</h2>

          <ul className="mb-2 pl-4 text-xs leading-normal sm:text-sm sm:grid sm:grid-cols-3 sm:gap-4 sm:pl-0">
            {[
              {
                href: 'https://html.spec.whatwg.org/multipage/',
                title: 'HTML Living Standard',
              },
              {
                href: 'https://www.w3.org/WAI/ARIA/apg/',
                title: 'ARIA Authoring Practices Guide (APG)',
              },
              {
                href: 'https://www.w3.org/TR/html-aria/',
                title: 'ARIA in HTML',
              },
              {
                href: 'https://w3c.github.io/wcag/guidelines/22/',
                title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
              },
              {
                href: 'https://www.w3.org/TR/wcag-3.0/',
                title: 'W3C Accessibility Guidelines (WCAG) 3.0',
              },
              {
                href: 'https://www.w3.org/TR/html-aam-1.0/',
                title: 'HTML Accessibility API Mappings 1.0',
              },
            ].map(({ title, href }, index, { length }) => {
              return (
                <li
                  key={href}
                  className={clsx([
                    index !== length - 1 && 'pb-3 sm:pb-0',
                    'list-disc sm:grid sm:min-h-[calc(1em_+_1em_*_2_*_1.5)]',
                  ])}
                >
                  <a href={href} className="break-all sm:bg-gray-200 sm:rounded sm:p-2 sm:grid sm:content-center">
                    {title}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 pt-12 sm:mt-28 sm:pt-28 border-t border-t-gray-400 border-dashed mb-8 grid-cols-[1fr_auto] grid-rows-[auto_1fr] sm:grid sm:gap-x-16 sm:mb-0">
            <h2 className="text-2xl mb-4 row-start-1 row-end-2 col-start-1 col-end-2">PROFILE</h2>

            <p className="leading-none mb-8 flex items-center gap-4 justify-end row-start-1 row-end-3 col-start-2 col-end-3 sm:gap-x-6 sm:m-0">
              <span className="whitespace-nowrap sm:grow text-justify text-xl">
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
              <span className="w-40 min-w-[160px]">
                <Image width={160} height={160} src="/favicon.png" alt="" />
              </span>
            </p>

            <div className="row-start-2 row-end-3 col-start-1 col-end-2">
              <div className="sm:max-w-xl sm:mb-4 sm:pr-4 palt">
                <p>大器晩成型のフロントエンドWeb開発者。</p>
                <p className="inline-block">
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
      </main>

      <Footer />
    </>
  );
}
