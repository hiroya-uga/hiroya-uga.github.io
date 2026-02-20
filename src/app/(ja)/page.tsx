import { useId } from 'react';

import { Picture } from '@/components/Image';
import clsx from 'clsx';
import Link from 'next/link';

import { ArticleListForTop, LinkListForTop, PickUpList, TopImage, WelcomeMessage } from '@/app/(ja)/parts';
import { Button, TextLink } from '@/components/Clickable';
import { Doumei } from '@/components/specific/Doumei';
import { Footer } from '@/components/structures/Footer';

import { SvgIcon } from '@/components/Icons';
import { ThemeSwitch } from '@/components/structures/ThemeSwitch';
import { SNS_LINKS } from '@/constants/sns';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/');

const MAIN_PAGES = [
  { emoji: '🔧', href: '/tools' },
  { emoji: '📚', href: '/documents' },
  { emoji: '🎮', href: '/games' },
  { emoji: '✍️', href: '/articles' },
] as const;

export default function Home() {
  const captionId = useId();

  return (
    <>
      <header className="@container">
        <div className="@w1024:pb-60px @w1024:pt-14 px-4 pb-12 pt-20">
          <div className="max-w-content mx-auto">
            <div className="@w1024:mb-2 @w1024:flex items-center text-center">
              <h1 className="@w640:text-2xl @w640:leading-8 @w1024:mb-0 mb-3 text-xl font-bold leading-none">
                {metadata.pageTitle}
              </h1>
              <p className="text-xs">
                <span className="@w1024:inline hidden px-2">-</span>
                <span>
                  Web標準とアクセシビリティの話が好きな、
                  <span className="inline-block">大器晩成型のフロントエンドエンジニアの物置。</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="@w640:fixed @w640:pt-2 @w640:pr-2 absolute right-2 top-2 z-50 w-fit">
          <ThemeSwitch />
        </p>
      </header>

      <main className="@container">
        <div className="max-w-content mx-auto mb-4">
          <TopImage captionId={captionId} />
        </div>

        <div className="px-content-inline @w640:pb-16 pb-8">
          <div className="max-w-content mx-auto">
            <WelcomeMessage />
          </div>
        </div>

        <div className="bg-secondary px-content-inline @w640:mb-28 @w640:pb-11 @w640:pt-7 mb-8 py-8">
          <div className="max-w-content mx-auto">
            <h2 className="@w640:text-2xl mb-4 mt-0 text-xl font-bold">The power of the web</h2>

            <figure>
              <blockquote
                cite="https://www.w3.org/mission/accessibility/"
                lang="en"
                className="@w640:my-6 @w640:text-base @w1024:text-center mb-2 text-xs"
              >
                <p>
                  “
                  <a href="https://www.w3.org/mission/accessibility/#:~:text=The%20power%20of%20the%20Web%20is%20in%20its%20universality.%20Access%20by%20everyone%20regardless%20of%20disability%20is%20an%20essential%20aspect.">
                    The power of the Web is in its universality. Access by everyone regardless of disability is an
                    essential aspect.
                  </a>
                  ”
                </p>
              </blockquote>
              <figcaption className="text-2xs @w640:text-sm @w1024:pr-2 @w1024:text-center text-right">
                <p>
                  — <cite>Tim Berners-Lee</cite>, W3C Director and inventor of the World Wide Web
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="px-content-inline @w640:mb-28 mb-16">
          <div className="max-w-content mx-auto">
            <h2 className="@w640:text-2xl mb-4 text-xl font-bold">Pick up</h2>

            <PickUpList />
          </div>
        </div>

        <div className="bg-tertiary px-content-inline @w640:mb-28 mb-20 py-11 pb-12">
          <div className="max-w-content mx-auto">
            <h2 className="@w640:text-2xl mb-4 text-xl font-bold">Category</h2>

            <div className="@w640:grid @w640:grid-cols-3 @w640:gap-8">
              <ul className="@w640:grid @w640:grid-cols-subgrid @w640:grid-rows-subgrid @w640:col-start-1 @w640:col-end-4 @w640:mb-0 @w640:row-start-1 @w640:row-end-3 mb-4">
                {MAIN_PAGES.map(({ emoji, href }) => {
                  const { pageTitle } = getMetadata(href);
                  return (
                    <li
                      key={href}
                      className="not-last:border-b not-last:border-b-(--background-color-tertiary) @w640:border-0! group border-solid"
                    >
                      <Link
                        href={href}
                        className="@w640:p-0 @w640:rounded-md bg-secondary @w640:bg-transparent group relative block overflow-hidden px-4 py-10 no-underline group-first:rounded-t-lg group-last:rounded-b-lg"
                      >
                        <span
                          className={clsx([
                            '@w640:bg-primary @w640:font-emoji @w640:mb-2 @w640:grid @w640:aspect-[1.618/1] @w640:place-items-center @w640:overflow-hidden @w640:rounded-md @w640:leading-none',
                            // safari bug fix: https://iwb.jp/safari-css-display-grid-place-items-center-bug
                            '@w640:w-full',
                          ])}
                          aria-hidden="true"
                        >
                          <span className="@w640:transition-transform @w640:duration-300 @w640:group-hover:scale-[1.15] @w640:blur-none @w640:opacity-100 @w640:text-5xl @w640:relative @w640:top-0 absolute right-0 top-1.5 text-[200px] leading-none opacity-30 blur-[4px]">
                            {emoji}
                          </span>
                        </span>
                        <span className="font-bold group-hover:underline">
                          <span className="mb-3px @w640:size-3 @w640:mb-5px @w640:ml-1 relative mr-1.5 inline-block size-4 align-middle">
                            <SvgIcon name="arrow2-right" alt="" />
                          </span>
                          {pageTitle}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="@w640:col-start-2 @w640:col-end-4 @w640:row-start-2 @w640:row-end-3 @w640:pl-0 pl-2">
                <ArticleListForTop />
              </div>
            </div>
          </div>
        </div>

        <div className="px-content-inline @w640:pb-20 pb-12">
          <div className="max-w-content mx-auto">
            <h2 className="@w640:text-2xl mb-2 text-xl font-bold">External Media</h2>

            <p className="mb-4">{getMetadata('/documents/media').description}</p>

            <table className="@w640:mb-2 mb-4">
              <tbody>
                {externalMediaLinkList.slice(0, 3).map(({ date, title, href }, index) => {
                  return (
                    <tr key={href} className="leading-6">
                      <td className="@w640:pr-4 @w640:text-sm pr-2 font-mono text-xs leading-[inherit]">
                        <span className="inline-block">{date}</span>
                      </td>
                      <td
                        className={clsx([
                          index !== 2 && '@w640:pb-4 pb-3',
                          '@w640:text-base text-sm leading-[inherit]',
                        ])}
                      >
                        <a href={href} className="break-all">
                          {title}
                        </a>

                        <p className="text-secondary break-all text-xs">{new URL(href).hostname}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="@w640:mb-28 @w640:place-items-end mb-12 grid place-items-center">
              <Button href="/documents/media/">外部メディアリンク一覧を見る</Button>
            </p>

            <h2 className="@w640:text-2xl mb-2 text-xl font-bold">Bookmarks</h2>

            <p className="mb-4">外部サイトへのリンク集です。</p>

            <LinkListForTop
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
                {
                  href: 'https://github.com/tc39/proposals',
                  hrefLang: 'en',
                  title: 'TC39/Proposals',
                },
              ]}
            />

            <div className="@w640:mb-0 @w640:mt-20 @w640:grid @w640:gap-x-12 @w640:pt-20 border-t-secondary mb-8 mt-12 grid-cols-[1fr_auto] grid-rows-[auto_1fr] border-t border-dashed pt-12">
              <h2 className="@w640:text-2xl col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold">
                Profile
              </h2>

              <p className="aspect-8/5 max-w-360px @w640:leading-inherit @w640:col-start-2 @w640:col-end-3 @w640:row-start-1 @w640:row-end-3 @w640:m-0 @w640:aspect-auto @w640:gap-x-6 @w640:flex-nowrap mx-auto mb-8 flex flex-wrap items-center gap-4 pr-4 leading-none">
                <span className="grow whitespace-nowrap text-center text-xl leading-tight">
                  <span className="block leading-6 tracking-widest" translate="no">
                    宇賀景哉
                  </span>
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
                  <Picture
                    width={160}
                    height={160}
                    src="/profile.png"
                    alt="似顔絵アイコン"
                    className="w-full"
                    priority={false}
                  />
                </span>
              </p>

              <div className="@w640:mb-paragraph col-start-1 col-end-2 row-start-2 row-end-3">
                <div className="@w640:max-w-xl @w640:pr-4">
                  <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
                  <p className="@w640:palt inline-block">
                    「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
                  </p>
                  <p>
                    詳しくは<TextLink href="/about">当サイトおよび管理人について</TextLink>をご覧ください。
                  </p>
                </div>
              </div>
            </div>

            <ul className="@w640:-m-2 @w640:justify-start @w640:gap-2 flex flex-wrap items-center justify-center gap-4 dark:invert">
              {SNS_LINKS.map(({ href, alt, ...props }) => {
                return (
                  <li key={href}>
                    <a href={href} className="@w640:p-3 block rounded-lg p-2 transition-colors hover:bg-gray-300">
                      <Picture
                        {...props}
                        width={props.width + 4}
                        height={props.height + 4}
                        alt={alt}
                        className="@w640:h-7 h-8 w-auto"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="@w640:mb-0 @w640:mt-20 @w640:grid @w640:gap-x-12 @w640:pt-20 border-t-secondary mb-10 mt-12 border-t border-dashed pt-12">
              <h2 className="@w640:text-2xl col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold">
                Doumei banners
              </h2>

              <Doumei />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
