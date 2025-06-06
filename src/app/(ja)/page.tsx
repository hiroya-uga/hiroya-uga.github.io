import { useId } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { Counter, LinkList, TopImage } from '@/app/(ja)/Client';
import { Button, TextLink } from '@/components/Clickable';
import { Footer } from '@/components/structures/Footer';
import { SITE_NAME } from '@/constants/meta';
import { SNS_LINKS } from '@/constants/sns';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/');

export default function Home() {
  const captionId = useId();

  return (
    <>
      <header className="px-4 pb-12 pt-10 lg:pb-[3.75rem] lg:pt-14">
        <div className="mx-auto max-w-content">
          <div className="items-center text-center lg:mb-2 lg:flex">
            <h1 className="mb-3 text-xl font-bold leading-none sm:text-2xl lg:mb-0">{metadata.pageTitle}</h1>
            <p className="text-xs">
              <span className="hidden px-2 lg:inline">-</span>
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

        <div className="mb-8 px-[var(--content-padding-inline)] sm:mb-28">
          <div className="mx-auto max-w-content">
            <p className="mb-20 text-center text-sm sm:mb-28">
              <span>ようこそ {SITE_NAME} へ。</span>
              <span className="block sm:inline">
                あなたは
                <Counter />
                番目の訪問者かもしれません。
              </span>
            </p>
          </div>
        </div>

        <div className="mb-8 bg-white px-[var(--content-padding-inline)] py-8 sm:mb-28 sm:pb-11 sm:pt-7">
          <div className="mx-auto max-w-content">
            <h2 className="mb-4 mt-0 text-xl font-bold sm:text-2xl">The power of the web</h2>

            <blockquote cite="https://www.w3.org/mission/accessibility/" lang="en" className="lg:text-center">
              <p className="mb-2 text-xs sm:my-6 sm:text-base">
                “
                <a href="https://www.w3.org/mission/accessibility/#:~:text=The%20power%20of%20the%20Web%20is%20in%20its%20universality.%20Access%20by%20everyone%20regardless%20of%20disability%20is%20an%20essential%20aspect.">
                  The power of the Web is in its universality. Access by everyone regardless of disability is an
                  essential aspect.
                </a>
                ”
              </p>

              <footer className="text-right text-2xs sm:text-sm lg:text-center">
                <p>—Tim Berners-Lee, W3C Director and inventor of the World Wide Web</p>
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mb-16 px-[var(--content-padding-inline)] sm:mb-28">
          <div className="mx-auto max-w-content">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Pick up</h2>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  emoji: '🌳',
                  href: '/tools/an-alt-decision-tree',
                },
                {
                  emoji: '🥋',
                  href: '/documents/notes',
                },
                {
                  emoji: '📝',
                  href: '/documents/translations/pauljadam-modern-web-a11y-demos',
                },
                {
                  emoji: '🔔',
                  href: '/tools/slack-reminder-command-generator',
                },
                {
                  emoji: '👆',
                  href: '/tools/touch-event-touches',
                },
                {
                  emoji: '📏',
                  href: '/tools/css-units',
                },
              ].map(({ emoji, href }) => {
                const { pageTitle, description } = getMetadata(href);
                const id = String(description) && href;

                return (
                  <li key={href}>
                    <p className="mb-1">
                      <Link
                        href={href}
                        className="group flex flex-col-reverse rounded-md no-underline"
                        aria-describedby={id}
                      >
                        <span className="inline-block leading-normal group-hover:underline">
                          {pageTitle}
                          {/* {item.isWip && <b>（WIP）</b>} */}
                        </span>
                        <span
                          className="mb-3 grid aspect-[1.618_/_1] place-content-center overflow-hidden rounded-md bg-gray-200 font-emoji text-[3.5rem] leading-none"
                          aria-hidden="true"
                        >
                          <span className="rotate-[0.1deg] scale-[0.85] transition-transform duration-300 [backface-visibility:hidden] group-hover:scale-100">
                            {emoji}
                          </span>
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

        <div className="mb-20 bg-slate-200 px-[var(--content-padding-inline)] py-11 pb-12 sm:mb-28">
          <div className="mx-auto max-w-content">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Category</h2>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  emoji: '🔧',
                  href: '/tools',
                },
                {
                  emoji: '📚',
                  href: '/documents',
                },
              ].map(({ emoji, href }) => {
                const { pageTitle } = getMetadata(href);

                return (
                  <li key={href}>
                    <Link href={href} className="group block rounded-md no-underline">
                      <span
                        className="mb-2 grid aspect-[1.618_/_1] place-content-center overflow-hidden rounded-md bg-gray-50 font-emoji text-5xl leading-none"
                        aria-hidden="true"
                      >
                        <span className="transition-transform duration-300 group-hover:scale-[1.15]">{emoji}</span>
                      </span>
                      <span className="font-bold group-hover:underline">→ {pageTitle}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="px-[var(--content-padding-inline)]">
          <div className="mx-auto max-w-content">
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">Media</h2>

            <p className="mb-4">{getMetadata('/documents/media').description}</p>

            <table className="mb-4 sm:mb-2">
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
              <Button href="/documents/media/">外部メディアリンク一覧を見る</Button>
            </p>

            <h2 className="mb-2 text-xl font-bold sm:text-2xl">Bookmarks</h2>

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

            <div className="mb-10 mt-12 grid-cols-[1fr_auto] grid-rows-[auto_1fr] border-t border-dashed border-t-gray-400 pt-12 sm:mb-0 sm:mt-28 sm:grid sm:gap-x-12 sm:pt-28">
              <h2 className="col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold sm:text-2xl">
                PROFILE
              </h2>

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
                  <Image width={160} height={160} src="/profile.png" alt="似顔絵アイコン" />
                </span>
              </p>

              <div className="col-start-1 col-end-2 row-start-2 row-end-3 sm:mb-6">
                <div className="sm:max-w-xl sm:pr-4">
                  <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
                  <p className="sm:palt inline-block">
                    「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
                  </p>
                  <p>
                    詳しくは<TextLink href="/about">当サイトおよび管理人について</TextLink>をご覧ください。
                  </p>
                </div>
              </div>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-4 sm:-m-2 sm:justify-start sm:gap-2">
              {SNS_LINKS.map(({ href, alt, ...props }) => {
                return (
                  <li key={href}>
                    <a href={href} className="block rounded-lg p-2 transition-colors hover:bg-gray-300 sm:p-3">
                      <Image {...props} width={32} height={32} alt={alt} className="sm:size-7" />
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
