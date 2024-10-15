import { SampleImage } from '@/components/specific/documents/pauljadam-modern-web-a11y-demos';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "HTML5のfigure要素とfigcaption要素 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
});

export default function Page() {
  return (
    <>
      <h1>
        HTML5の<code>figure</code>要素と<code>figcaption</code>要素
      </h1>

      <figure>
        <SampleImage filename="/accessiblenameimg-360bridge.jpg" alt="Pennybacker Bridge" width={800} height={533} />
        <figcaption>
          図1 - テキサス州オースティンで「360
          Bridge」として知られているペニーバッカー橋は、オースティン湖に掛かるスルーアーチタイプの橋で、Loop
          360という高速道路の北部と南部を結ぶものです。「テキサスハイウェイの首都」としても知られています。
        </figcaption>
      </figure>
    </>
  );
}
