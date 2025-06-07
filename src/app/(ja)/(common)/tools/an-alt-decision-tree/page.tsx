import { AnAltDecisionTreeContent } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';
import { Suspense } from 'react';

export const metadata = getMetadata('/tools/an-alt-decision-tree');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} previous={metadata.previous}>
        <p>
          <code>img</code>要素の<code>alt</code>属性は省略せず、適切な値を設定する必要があります。
        </p>
        <p className="mt-2">
          これは、代替テキスト
          <ruby>
            決定木
            <rt>Decision Tree</rt>
          </ruby>
          の
          <a href="https://www.w3.org/WAI/tutorials/images/decision-tree/ja">
            altディシジョンツリー（An alt Decision Tree）
          </a>
          を参考に用意したチャートです。
        </p>
        <p>代替テキストにお悩みの際にご活用ください。</p>
      </PageTitle>

      <section className="mx-auto max-w-3xl rounded-xl bg-white px-4 pb-6 pt-10 sm:px-6">
        <Suspense>
          <AnAltDecisionTreeContent />
        </Suspense>
      </section>
    </>
  );
}
