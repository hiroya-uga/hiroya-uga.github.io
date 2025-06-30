import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/goodav/DocumentScript';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/goodav');

export default function Page() {
  return (
    <>
      <DocumentScript />

      <h1>{metadata.pageTitle}</h1>
      <video controls>
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
      </video>

      <p>
        <a href="../badav">オーディオ/ビデオの自動再生とループを使った悪い例</a>
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
