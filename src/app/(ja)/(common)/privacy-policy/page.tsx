import { PageTitle } from '@/components/structures/PageTitle';
import { TextLink } from '@/components/ui/buttons/TextLink';
import { Heading } from '@/components/ui/headings/Heading';
import { DiscList } from '@/components/ui/lists/DiscList';
import { Table } from '@/components/ui/tables/Table';
import { getMetadata } from '@/utils/get-metadata';
import React from 'react';

export const metadata = getMetadata('/privacy-policy');

const externalTransmissions = [
  {
    name: 'Google Analytics（Google LLC）',
    items: 'Cookieによる識別子、IPアドレス、閲覧ページ、アクセス情報、端末情報、サイト内の操作情報。',
    policy: {
      href: 'https://policies.google.com/privacy?hl=ja',
      text: 'Googleプライバシーポリシー',
    },
    purposes: ['サイトの利用状況の分析', 'サイトの改善'],
    optOut: (
      <>
        Cookieの利用に同意した場合のみ計測します。同意は
        <TextLink href="/config/">設定ページ</TextLink>
        で取り消せます。取り消した後は、ページを読み込み直すと計測が停止します。補助として、Googleの
        <TextLink href="https://tools.google.com/dlpage/gaoptout" target="_blank">
          オプトアウトアドオン
        </TextLink>
        でも停止できます。
      </>
    ),
  },
  {
    name: 'Cloudflare Workers・D1（Cloudflare, Inc.）',
    items: 'ページの読み込み時にIPアドレスとブラウザ情報。いいねを押したときは、加えて記事のパス。',
    policy: {
      href: 'https://www.cloudflare.com/ja-jp/privacypolicy/',
      text: 'Cloudflareプライバシーポリシー',
    },
    purposes: [
      'いいね数の表示と集計',
      'いいねの重複および大量送信の防止',
      'アクセス数の表示と集計',
      'アクセス数の重複加算およびボットの除外',
    ],
    optOut:
      'Cookieの同意設定とは連動せず、同意の有無にかかわらず送信します。ブラウザの設定や拡張機能で通信をブロックすると停止できます。',
  },
];

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <div className="mt-2 text-right text-sm">
          <p>
            改定日：<span className="font-sans tabular-nums">2026年10月13日</span>
          </p>
          <p>
            制定日：<span className="font-sans tabular-nums">2025年06月02日</span>
          </p>
        </div>
      </PageTitle>

      <Heading level={2}>適用範囲</Heading>

      <p>
        本プライバシーポリシーは、当サイトで提供されるツールや情報（以下、コンテンツ）をご利用いただく際に適用されます。
      </p>

      <Heading level={2}>Cookieと類似技術について</Heading>

      <p>
        当サイトでは、コンテンツの利便性向上のため、ユーザーの入力内容や操作状況、設定、いいねした記事を
        <TextLink
          href="https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A7%E3%83%96%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B8"
          target="_blank"
        >
          Web Storage
        </TextLink>
        を用いてブラウザ内に保存することがあります。保存された情報は、ブラウザの設定から削除できます。設定ページでは、ツールの設定、閲覧履歴、実績などの一部を初期化できます。
      </p>

      <p>
        Web
        Storageへの保存は、Cookieの同意設定とは連動しません。保存された値そのものを、当サイトが外部サービスへ送信することはありません。
      </p>

      <Heading level={3}>アクセス解析</Heading>

      <p>
        当サイトでは、利用状況の分析と改善のため、Google LLCが提供するGoogle Analyticsを利用しています。Google
        AnalyticsはCookieを使用し、Cookieの利用に同意した場合にのみ有効になります。送信される情報や停止方法については、後述の「Google
        Analytics（Google LLC）」をご覧ください。
      </p>

      <Heading level={2}>外部サービスへの情報送信</Heading>

      <p>
        当サイトのツールのうち、ブラウザ内で処理が完結するものについては、入力内容を当サイトのサーバーへ送信しません。ブラウザ内への保存については、前述のとおりです。ただし、アクセス解析、アクセスカウンター、いいね機能、埋め込みコンテンツの表示に伴い、利用者に関する情報が各事業者へ送信されます。
      </p>

      {externalTransmissions.map(({ name, items, policy, purposes, optOut }) => (
        <React.Fragment key={name}>
          <Heading level={3}>{name}</Heading>
          <Table>
            <colgroup>
              <col style={{ width: '25%' }} />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">送信される情報</th>
                <td>{items}</td>
              </tr>
              <tr>
                <th scope="row">利用目的</th>
                <td>
                  <DiscList list={purposes} />
                </td>
              </tr>
              <tr>
                <th scope="row">送信先のプライバシーポリシー</th>
                <td>
                  <TextLink href={policy.href} target="_blank">
                    {policy.text}
                  </TextLink>
                </td>
              </tr>
              <tr>
                <th scope="row">停止方法</th>
                <td>{optOut}</td>
              </tr>
            </tbody>
          </Table>
        </React.Fragment>
      ))}

      <Heading level={3}>埋め込みコンテンツ</Heading>

      <p>当サイトでは、コンテンツの表示を利用目的としてYouTube、X、CodePenのコンテンツを埋め込んでいます。</p>
      <p>これらの表示に伴い、IPアドレス、ブラウザ情報、閲覧中のページのURLなどが各事業者へ送信される場合があります。</p>
      <p>これらの通信はCookieの同意設定とは連動しません。</p>
      <p className="mt-pa">各事業者での取り扱いは、各事業者のプライバシーポリシーをご確認ください。</p>

      <Heading level={3}>Vercel（Vercel Inc.）</Heading>

      <p>
        当サイトのサーバーは第三者（
        <TextLink href="https://vercel.com" target="_blank">
          Vercel
        </TextLink>
        ）に委託されており、IPアドレス、ブラウザ情報、アクセス日時などが記録される場合があります。これらの情報の取り扱いについては、
        <TextLink href="https://vercel.com/legal/privacy-policy" target="_blank">
          Vercelのプライバシーポリシー
        </TextLink>
        をご確認ください。
      </p>

      <Heading level={2}>第三者への提供</Heading>

      <p>当サイトが保有する情報を、法令に基づく場合を除き、ユーザーの同意なく第三者へ提供することはありません。</p>
    </>
  );
}
