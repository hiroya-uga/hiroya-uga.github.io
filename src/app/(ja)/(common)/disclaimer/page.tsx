import { Heading } from '@/components/Heading';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/disclaimer');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p>当サイトからリンクされた外部サイトや第三者が提供するコンテンツについては、本免責事項は適用されません。</p>
        <p className="mt-4 text-right">制定日: 2025年06月02日</p>
      </PageTitle>

      <Heading level={2}>情報の取り扱いについて</Heading>

      <p className="mb-paragraph">
        当サイトに掲載内容はできる限り正確になるよう努めていますが、必ずしも正確性や安全性を保証するものではありません。
      </p>
      <p>また、当サイトではサイト管理者が自分で利用するため・趣味・練習などの目的で作ったWebツールを提供しています。</p>
      <p>
        それらのツールを利用する際に入力された情報は、皆様が入力したデータは収集、計測、保存したり、第三者に提供することはありません。ただし、サーバーの仕様上、アクセスログなどに一部情報（IPアドレスなど）が記録される場合があります。詳しくは
        <a href="/privacy-policy">プライバシーポリシー</a>をご覧ください。
      </p>

      <Heading level={2}>動作の保証について</Heading>

      <p>
        当サイトに公開されているツールは、サイト管理者が便利に使いたい、または試しに作ってみたものです。商用利用や重要な業務での使用を想定していません。ご利用は自己責任でお願いします。
      </p>
      <p className="mb-paragraph">
        そのため、動作の正確さや安定性を保証するものではありません。ツールの利用により生じたトラブルや損害（データ損失や業務への影響など）について、運営者は一切の責任を負いません。
      </p>

      <p>
        本ツールが外部サービスやAPIを利用する場合、それらの障害や仕様変更による影響について運営者は責任を負いません。
      </p>

      <Heading level={2}>コンテンツの変更・終了</Heading>

      <p>
        当サイトに公開されている内容・ツールは無料で提供しており、予告なく内容の変更や提供の終了を行う場合があります。
      </p>
    </>
  );
}
