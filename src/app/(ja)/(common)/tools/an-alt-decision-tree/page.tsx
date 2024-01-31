import { AnAltDecisionTreeContent } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/Client';

import { Metadata } from 'next';

export default function Page() {
  return (
    <>
      <h1>
        An alt Decision Tree - <strong className="font-normal">代替テキスト決定木</strong>
      </h1>

      <p>
        <code>img</code>要素の<code>alt</code>属性を省略してはいけません。
      </p>
      <p className="mt-2">
        どんな時にはどんな値を入れればいいのかを教えてくれる
        <ruby>
          決定木
          <rt>Decision Tree</rt>
        </ruby>
        「<a href="https://www.w3.org/WAI/tutorials/images/decision-tree/">An alt Decision Tree</a>
        」のざっくり日本語訳です。
      </p>
      <p>代替テキストにお悩みの際にご活用ください。</p>
      <p className="mt-4">
        <small className="text-xs">※ この決定木はすべてのケースをカバーしているわけではありません。</small>
      </p>

      <section className="mt-8 px-6 pt-10 pb-6 rounded-xl bg-white max-w-3xl mx-auto">
        <AnAltDecisionTreeContent />
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: 'An alt Decision Tree',
  description: 'Altテキストを決める手助けをします。',
};
