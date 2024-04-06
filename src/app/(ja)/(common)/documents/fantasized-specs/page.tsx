import { PageTitle } from '@/components/structures/PageTitle';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'Fantasized specs',
  description: '日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
  twitter: {
    card: 'summary_large_image',
    title: 'Fantasized specs',
    description: '日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
  },
};

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.title}>
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
