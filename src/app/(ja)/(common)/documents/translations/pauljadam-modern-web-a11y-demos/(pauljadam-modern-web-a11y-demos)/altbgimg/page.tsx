import { DivWithOnClickEvent } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/altbgimg/Client';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/altbgimg/page.module.css';

import { SampleImage } from '@/components/specific/documents/pauljadam-modern-web-a11y-demos';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/altbgimg');

export default function Page() {
  return (
    <div className={styles.page}>
      <h1>{metadata.pageTitle}</h1>

      <h2>背景画像</h2>

      <h3>
        CSSで視覚的に隠された説明文を持つ<code>div</code>要素
      </h3>

      <div className={styles['bg-img']}></div>
      <div className={styles.clipped}>
        Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
      </div>

      <h3>
        <code>div</code>要素に<code>role="img"</code>を付与し、<code>aria-labelledby</code>
        属性で「視覚的に隠された説明文をコンテンツに持つ<code>div[aria-hidden="true"]</code>」を参照する
      </h3>

      <div className={styles['bg-img']} role="img" aria-labelledby="bg-img-desc"></div>
      <div id="bg-img-desc" className={styles.clipped} aria-hidden="true">
        Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
      </div>

      <h3>
        コンテンツに、CSSで文字色が透明なっている説明文を持ち、<code>onClick</code>属性と<code>tabindex="0"</code>
        が付与された<code>div</code>要素
      </h3>

      <DivWithOnClickEvent />

      <h3>
        コンテンツに、CSSで画面外まで表示位置がずらされた説明文を持つ<code>a</code>要素 (
        <code>text-indent:-9999px;</code>)
      </h3>

      <div className={styles['linked-bg-img']}>
        {' '}
        <a href="http://www.deque.com" hrefLang="en-US">
          Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
        </a>{' '}
      </div>

      <h3>
        <code>aria-label</code>属性経由での代替テキストを持つ<code>a</code>要素
      </h3>

      <div className={styles['linked-bg-img']}>
        <a
          href="http://www.deque.com"
          hrefLang="en-US"
          aria-label="Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。"
        ></a>
      </div>

      <h2>
        複雑な画像（<code>img</code>要素)
      </h2>

      <h3>
        1つの同じ<code>p</code>要素（段落）に<code>alt</code>属性に代替テキストを持った<code>img</code>
        要素と、視覚的に非表示になった説明文を含む例
      </h3>

      <p>
        <SampleImage
          filename="/altbgimg-complexImageExample.png"
          width={400}
          height={414}
          alt="Webブラウジングに影響を与える障害"
        />
        <span className={styles.clipped}>
          Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
        </span>
      </p>

      <h3>
        1つの同じ<code>p</code>要素（段落）内で<code>alt</code>属性に代替テキストを持った<code>img</code>
        要素が、視覚的に非表示になった説明文を<code>aria-labelledby</code>属性で参照している例
      </h3>

      <p>
        <SampleImage
          filename="/altbgimg-complexImageExample.png"
          width={400}
          height={414}
          alt="Webブラウジングに影響を与える障害"
          aria-describedby="clipped-aria-desc"
        />
        <span className={styles.clipped} id="clipped-aria-desc">
          Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
        </span>
      </p>

      <h3>
        <code>alt</code>属性に代替テキストを持った<code>img</code>要素が、視覚的に非表示になった説明文を
        <code>longdesc</code>属性で参照している例
      </h3>

      <p>
        <SampleImage
          filename="/altbgimg-complexImageExample.png"
          width={400}
          height={414}
          alt="Webブラウジングに影響を与える障害"
          longdesc="#clipped-longdesc"
        />
        <span className={styles.clipped} id="clipped-longdesc">
          Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
        </span>
      </p>
    </div>
  );
}
