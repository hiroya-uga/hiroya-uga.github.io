import { Button, TextLink } from '@/components/Clickable';
import { Heading } from '@/components/Heading';
import { DiscList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/privacy-policy');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <div className="mt-2 text-right text-sm">
          <p>改定日: 2025年07月10日</p>
          <p>制定日: 2025年06月02日</p>
        </div>
      </PageTitle>

      <Heading level={2}>適用範囲</Heading>

      <p>
        本プライバシーポリシーは、当サイトで提供されるツールや情報（以下、コンテンツ）をご利用いただく際に適用されます。
      </p>
      <p>当サイトからリンクされた先のWebサイトのプライバシーポリシーについては、当サイトは一切の責任を負いかねます。</p>

      <Heading level={2}>Cookieと類似技術について</Heading>

      <p>
        当サイトでは、コンテンツの利便性向上のために、ユーザーの入力内容や設定を
        <TextLink href="https://ja.wikipedia.org/wiki/HTTP_cookie" target="_blank">
          Cookie
        </TextLink>
        や
        <TextLink
          href="https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A7%E3%83%96%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B8"
          target="_blank"
        >
          Web storage
        </TextLink>
        を用いてお使いのブラウザに保存することがあります。
      </p>
      <p>また、ブラウザに保存された情報はお使いのブラウザの機能から削除でき、有効・無効の切り替えも行えます。</p>

      <Heading level={2}>アクセス解析</Heading>

      <p className="mb-paragraph">
        当サイトでは、ウェブサイトの利用状況の分析および改善を目的として、Google, Inc.が提供するGoogle
        Analyticsを利用しています。Google
        Analyticsは、クッキー（Cookie）を使用して、ユーザーので得た利用状況等はで収集します。これにより、ユーザーの個人を特定する情報（氏名、住所、電話番号など）は収集されません。
      </p>
      <p className="mb-paragraph">
        収集されたデータは、Googleのサーバーに送信され、ウェブサイトの利用状況（アクセス数、閲覧ページ、滞在時間など）を分析するために使用されます。このデータは、Googleのプライバシーポリシーに基づいて管理されます。Google
        Analyticsの詳細およびGoogleのプライバシーポリシーについては、以下のリンクをご覧ください。
      </p>

      <DiscList
        list={[
          {
            key: 'Google Analyticsの利用規約',
            value: (
              <TextLink href="https://www.google.com/analytics/terms/jp.html" target="_blank">
                Google Analyticsの利用規約
              </TextLink>
            ),
          },
          {
            key: 'Googleのプライバシーポリシー',
            value: (
              <TextLink href="https://policies.google.com/privacy?hl=ja" target="_blank">
                Googleのプライバシーポリシー
              </TextLink>
            ),
          },
        ]}
      />

      <p className="my-paragraph">
        ユーザーは、ブラウザの設定でクッキーの使用を無効にすることで、Google
        Analyticsによるデータ収集を拒否することができます。ただし、その場合、ウェブサイトの一部の機能が制限される可能性があります。
      </p>

      <p className="mt-6 grid place-items-center sm:mt-8">
        <Button href="https://tools.google.com/dlpage/gaoptout" target="_blank">
          アクセス解析を拒否する
        </Button>
      </p>

      <Heading level={2}>第三者への提供</Heading>

      <p className="mb-paragraph">当サイトのコンテンツに入力されたデータや個人情報は、収集されることはありません。</p>
      <p>
        ただし、当サイトのコンテンツが外部APIやサービスを利用する場合、それらのサービスのプライバシーポリシーが適用される場合があります。
      </p>
      <p>
        当サイトのサーバーは第三者（
        <TextLink href="https://vercel.com" target="_blank">
          Vercel
        </TextLink>
        ）に委託されており、IPアドレス、ブラウザ情報、アクセス日時などが記録される場合があります。これらのデータはサーバー提供者のプライバシーポリシーに基づいて管理されます。
      </p>
      <p>
        アクセス解析で得た利用状況含め、法令に基づく場合を除き、ユーザーの同意なし第三者に提供することはありません。
      </p>
    </>
  );
}
