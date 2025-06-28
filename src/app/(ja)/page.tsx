import { useId } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { LinkList, PickUpList, TopImage, WelcomeMessage } from '@/app/(ja)/Client';
import { Button, TextLink } from '@/components/Clickable';
import { Doumei } from '@/components/specific/Doumei';
import { Footer } from '@/components/structures/Footer';

import { SvgIcon } from '@/components/Icons';
import { SNS_LINKS } from '@/constants/sns';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/');

export default function Home() {
  const captionId = useId();

  return (
    <>
      <header className="lg:pb-60px px-4 pb-12 pt-10 lg:pt-14">
        <div className="max-w-content mx-auto">
          <div className="items-center text-center lg:mb-2 lg:flex">
            <h1 className="mb-3 text-xl font-bold leading-none sm:text-2xl sm:leading-8 lg:mb-0">
              {metadata.pageTitle}
            </h1>
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
        <div className="@container max-w-content mx-auto mb-4">
          <TopImage captionId={captionId} />
        </div>

        <div className="px-content-inline pb-20 sm:pb-28">
          <div className="max-w-content mx-auto">
            <WelcomeMessage />
          </div>
        </div>

        <div className="bg-section-primary px-content-inline mb-8 py-8 sm:mb-28 sm:pb-11 sm:pt-7">
          <div className="max-w-content mx-auto">
            <h2 className="mb-4 mt-0 text-xl font-bold sm:text-2xl">The power of the web</h2>

            <figure>
              <blockquote
                cite="https://www.w3.org/mission/accessibility/"
                lang="en"
                className="mb-2 text-xs sm:my-6 sm:text-base lg:text-center"
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
              <figcaption className="text-2xs text-right sm:text-sm lg:pr-2 lg:text-center">
                <p>
                  — <cite>Tim Berners-Lee</cite>, W3C Director and inventor of the World Wide Web
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="px-content-inline mb-16 sm:mb-28">
          <div className="max-w-content mx-auto">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Pick up</h2>

            <PickUpList />
          </div>
        </div>

        <div className="bg-section-secondary px-content-inline mb-20 py-11 pb-12 sm:mb-28">
          <div className="max-w-content mx-auto">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Category</h2>

            <div className="@container">
              <ul className="@w640:grid @w640:grid-cols-3 @w640:gap-8">
                {[
                  {
                    emoji: '🔧',
                    href: '/tools',
                  },
                  {
                    emoji: '📚',
                    href: '/documents',
                  },
                  {
                    emoji: '🎮',
                    href: '/games',
                  },
                ].map(({ emoji, href }) => {
                  const { pageTitle } = getMetadata(href);

                  return (
                    <li
                      key={href}
                      className="not-last:border-b not-last:border-b-(--v-color-background-section-secondary) @w640:border-0! group border-solid"
                    >
                      <Link
                        href={href}
                        className="@w640:p-0 @w640:rounded-md bg-banner @w640:bg-transparent group relative block overflow-hidden px-4 py-10 no-underline group-first:rounded-t-lg group-last:rounded-b-lg"
                      >
                        <span
                          className="@w640:bg-card-secondary @w640:font-emoji @w640:mb-2 @w640:grid @w640:aspect-[1.618/1] @w640:place-items-center @w640:overflow-hidden @w640:rounded-md @w640:leading-none"
                          aria-hidden="true"
                        >
                          <span className="@w640:transition-transform @w640:duration-300 @w640:group-hover:scale-[1.15] @w640:blur-none @w640:opacity-100 @w640:text-5xl @w640:relative absolute right-0 top-0 text-[200px] leading-none opacity-30 blur-[3px]">
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
            </div>
          </div>
        </div>

        <div className="px-content-inline">
          <div className="max-w-content mx-auto">
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">Media</h2>

            <p className="mb-4">{getMetadata('/documents/media').description}</p>

            <table className="mb-4 sm:mb-2">
              <tbody>
                {externalMediaLinkList.slice(0, 3).map(({ date, title, href }, index) => {
                  return (
                    <tr key={href} className="leading-6">
                      <td className="pr-2 font-mono text-xs leading-[inherit] sm:pr-8 sm:text-sm">
                        <span className="inline-block">{date}</span>
                      </td>
                      <td className={clsx([index !== 2 && 'pb-3 sm:pb-4', 'text-sm leading-[inherit] sm:text-base'])}>
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

            <p className="mb-12 grid place-items-center sm:mb-28 sm:place-items-end">
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

            <div className="mb-2 mt-12 grid-cols-[1fr_auto] grid-rows-[auto_1fr] border-t border-dashed border-t-gray-400 pt-12 sm:mb-0 sm:mt-20 sm:grid sm:gap-x-12 sm:pt-20">
              <h2 className="col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold sm:text-2xl">
                Profile
              </h2>

              <p className="aspect-8/5 max-w-360px sm:leading-inherit mx-auto mb-8 flex items-center gap-4 pr-4 leading-none sm:col-start-2 sm:col-end-3 sm:row-start-1 sm:row-end-3 sm:m-0 sm:aspect-auto sm:gap-x-6">
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
                  <Image width={160} height={160} src="/profile.png" alt="似顔絵アイコン" className="w-full" />
                </span>
              </p>

              <div className="sm:mb-paragraph col-start-1 col-end-2 row-start-2 row-end-3">
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

            <ul className="flex flex-wrap items-center justify-center gap-4 sm:-m-2 sm:justify-start sm:gap-2 dark:invert">
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

            <div className="mb-10 mt-12 border-t border-dashed border-t-gray-400 pt-12 sm:mb-0 sm:mt-20 sm:grid sm:gap-x-12 sm:pt-20">
              <h2 className="col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold sm:text-2xl">
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
