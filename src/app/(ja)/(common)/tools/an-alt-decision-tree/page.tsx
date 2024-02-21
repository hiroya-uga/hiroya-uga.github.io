import { AnAltDecisionTreeContent } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

export const metadata: Metadata = {
  title: 'An alt Decision Treeに基づく代替テキスト２択チャート',
  description:
    'An alt Decision Treeを参考に作られた、画像の代替テキストと呼ばれるalt属性値を決める手助けをする２択チャートです。',
};

export default function Page() {
  return (
    <>
      <PageTitle title="代替テキスト２択チャート" previous="An alt Decision Treeに基づく">
        <p>
          <code>img</code>要素の<code>alt</code>属性は省略せず、適切な値を設定する必要があります。
        </p>
        <p className="mt-2">
          これは、代替テキスト
          <ruby>
            決定木
            <rt>Decision Tree</rt>
          </ruby>
          の<a href="https://www.w3.org/WAI/tutorials/images/decision-tree/">An alt Decision Tree</a>
          （英語）を参考に用意したチャートです。
        </p>
        <p>代替テキストにお悩みの際にご活用ください。</p>
      </PageTitle>

      <section className="px-4 pt-10 pb-6 rounded-xl bg-white max-w-3xl mx-auto sm:px-6">
        <AnAltDecisionTreeContent />
      </section>
    </>
  );
}
