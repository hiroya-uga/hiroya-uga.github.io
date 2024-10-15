import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "オーディオ/ビデオの自動再生とループを使った悪い例 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
});

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <video autoPlay controls loop>
        <source src="http://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="http://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
      </video>
      <p>
        <a href="./goodav">自動再生またはループのないオーディオ/ビデオの良い例</a>
      </p>
    </>
  );
}
