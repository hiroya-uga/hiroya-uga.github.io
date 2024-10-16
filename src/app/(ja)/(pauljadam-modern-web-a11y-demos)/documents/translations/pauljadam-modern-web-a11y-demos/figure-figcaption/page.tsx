import { SampleImage } from '@/components/specific/documents/pauljadam-modern-web-a11y-demos';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/figure-figcaption');

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
