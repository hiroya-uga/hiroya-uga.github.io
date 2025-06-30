import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';
import Link from 'next/link';

export const metadata = getMetadata('/documents/fantasized-specs');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>日々業務の中で思いついた「あんなこといいなできたらいいな」集。</p>
      </PageTitle>

      <ul className="pl-5">
        <li className="mb-2 list-disc pl-1">
          <Link href="/documents/fantasized-specs/html-carousel">The Carousel element</Link>
        </li>
        <li className="list-disc pl-1">
          <Link href="/documents/fantasized-specs/css-observer">CSS Observer</Link>
        </li>
      </ul>
    </>
  );
}
