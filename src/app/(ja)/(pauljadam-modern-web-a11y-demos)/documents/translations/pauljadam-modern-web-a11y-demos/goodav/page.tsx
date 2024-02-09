import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/goodav/DocumentScript';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: "自動再生またはループのないオーディオ/ビデオの良い例 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
};

export default function Page() {
  return (
    <>
      <DocumentScript />

      <h1>{metadata.title}</h1>
      <video controls>
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
      </video>

      <p>
        <a href="./badav">オーディオ/ビデオの自動再生とループを使った悪い例</a>
      </p>

      <h2>自動再生やループ、独自コントローラーのないより良いオーディオ/ビデオの例</h2>

      <video id="demo-video" controls>
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
      </video>

      <div role="group" aria-label="Better Audio/Video Example Player Controls">
        <button id="play-pause">再生</button>
        {/* <button id="captions">Disable Captions</button> */}
        {/* <button id="full-screen">Full Screen</button> */}
      </div>
    </>
  );
}
