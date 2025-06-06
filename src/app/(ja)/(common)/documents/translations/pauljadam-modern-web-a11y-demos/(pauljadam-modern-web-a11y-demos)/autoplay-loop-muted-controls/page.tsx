import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata(
  '/documents/translations/pauljadam-modern-web-a11y-demos/autoplay-loop-muted-controls',
);

export default function Page() {
  return (
    <>
      <h1>
        <code>video</code>要素の<code>autoplay</code>, <code>loop</code>, <code>muted</code>, <code>controls</code>
        属性をテスト
      </h1>

      <h2>
        <code>autoplay</code>, <code>loop</code>, <code>muted</code>, <code>controls</code>
      </h2>

      <video
        height="270"
        width="480"
        poster="https://content.bitsontherun.com/thumbs/bkaovAYt-320.jpg"
        autoPlay
        loop
        muted
        controls
      >
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
        <p className="warning">ご利用中のブラウザはHTML5のvideo要素をサポートしていないようです。</p>
      </video>

      <h2>
        <code>autoplay</code>, <code>loop</code>
      </h2>

      <video height="270" width="480" poster="https://content.bitsontherun.com/thumbs/bkaovAYt-320.jpg" autoPlay loop>
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
        <p className="warning">ご利用中のブラウザはHTML5のvideo要素をサポートしていないようです。</p>
      </video>

      <h2>
        <code>autoplay</code>, <code>loop</code>, <code>controls</code>
      </h2>

      <video
        height="270"
        width="480"
        poster="https://content.bitsontherun.com/thumbs/bkaovAYt-320.jpg"
        autoPlay
        loop
        controls
      >
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4" />
        <source src="https://content.bitsontherun.com/videos/bkaovAYt-27m5HpIu.webm" />
        <p className="warning">ご利用中のブラウザはHTML5のvideo要素をサポートしていないようです。</p>
      </video>
    </>
  );
}
