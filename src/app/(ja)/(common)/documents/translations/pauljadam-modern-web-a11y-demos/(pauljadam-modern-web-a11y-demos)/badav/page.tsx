import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/badav');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <video autoPlay controls loop>
        <source src="http://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="http://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
      </video>
      <p>
        <a href="../goodav">自動再生またはループのないオーディオ/ビデオの良い例</a>
      </p>
    </>
  );
}
