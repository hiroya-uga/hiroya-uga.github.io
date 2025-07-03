import { Heading } from '@/components/Heading';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';
import Link from 'next/link';

export const metadata = getMetadata('/disclaimer');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p>当サイトからリンクされた外部サイトや第三者が提供するコンテンツについては、本免責事項は適用されません。</p>
        <div className="mt-2 text-right text-sm">
          <p>改定日: 2025年07月03日</p>
          <p>制定日: 2025年06月02日</p>
        </div>
      </PageTitle>

      <Heading level={2}>情報の取り扱いについて</Heading>

      <p>当サイトに掲載されている情報は特別な記載がない限り、すべて組織を代表するものではなく、個人の見解です。</p>

      <p className="mb-paragraph">
        当サイトに掲載内容はできる限り正確になるよう努めていますが、必ずしも正確性や安全性を保証するものではありません。
      </p>
      <p>また、当サイトではサイト管理者が自分で利用するため・趣味・練習などの目的で作ったWebツールを提供しています。</p>
      <p>
        それらを利用する際に入力される情報の取り扱い等については<Link href="/privacy-policy">プライバシーポリシー</Link>
        をご覧ください。
      </p>

      <Heading level={2}>動作の保証について</Heading>

      <p>
        当サイトに公開されているツールは、サイト管理者が便利に使いたい、または試しに作ってみたものです。商用利用や重要な業務での使用を想定していません。ご利用は自己責任でお願いします。
      </p>
      <p className="mb-paragraph">
        そのため、動作の正確さや安定性を保証するものではありません。ツールの利用により生じたトラブルや損害（データ損失や業務への影響など）について、管理者は一切の責任を負いません。
      </p>

      <p>
        本ツールが外部サービスやAPIを利用する場合も、それらの障害や仕様変更による影響について管理者は責任を負いません。
      </p>

      <Heading level={2}>コンテンツの変更・終了</Heading>

      <p>
        当サイトに公開されている内容・ツールは無料で提供しており、予告なく内容の変更や提供の終了を行う場合があります。
      </p>
    </>
  );
}
