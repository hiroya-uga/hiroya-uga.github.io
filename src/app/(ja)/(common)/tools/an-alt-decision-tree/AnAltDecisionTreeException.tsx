import { AnAltDecisionTreeHeading as Heading } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/AnAltDecisionTreeHeading';
import Image from 'next/image';
import Link from 'next/link';

export const AnAltDecisionTreeException = () => {
  return (
    <>
      <Heading>例外パターンのようです</Heading>

      <div className="mb-8 mt-12">
        <Image src="/tools/an-alt-decision-tree/exception.png" width={246} height={292} alt="" className="mx-auto" />
      </div>

      <div className="px-4 sm:px-0 sm:text-center">
        <p className="mb-4">この決定木はすべてのケースをカバーしているわけではありません。</p>

        <p>
          どのような代替テキストを設定すればいいか不明な場合は、
          <span className="inline-block">
            詳しくは
            <Link href="/documents/translations/w3c/wai/tutorials/images/">Image Tutorial の日本語訳</Link>
            を参照してください。
          </span>
        </p>
      </div>
    </>
  );
};
