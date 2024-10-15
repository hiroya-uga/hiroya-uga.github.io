import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'Fantasized specs',
  description: '日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
});

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>日々業務の中で思いついた「あんなこといいなできたらいいな」集。</p>
      </PageTitle>

      <ul className="pl-5">
        <li className="mb-2 list-disc pl-1">
          <a href="/documents/fantasized-specs/html-carousel">The Carousel element</a>
        </li>
        <li className="list-disc pl-1">
          <a href="/documents/fantasized-specs/css-observer">CSS Observer</a>
        </li>
      </ul>
    </>
  );
}
