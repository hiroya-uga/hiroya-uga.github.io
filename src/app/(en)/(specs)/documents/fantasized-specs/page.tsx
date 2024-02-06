import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'Fantasized specs',
  description: 'These are the spec proposals that I came up with in my daily work.',
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>

      <p>These are the spec proposals that I came up with in my daily work.</p>

      <ul className="pl-5">
        <li className="list-disc pl-1 mb-2">
          <a href="/documents/fantasized-specs/html-carousel">The Carousel element</a>
        </li>
        <li className="list-disc pl-1">
          <a href="/documents/fantasized-specs/css-observer">CSS Observer</a>
        </li>
      </ul>
    </>
  );
}
