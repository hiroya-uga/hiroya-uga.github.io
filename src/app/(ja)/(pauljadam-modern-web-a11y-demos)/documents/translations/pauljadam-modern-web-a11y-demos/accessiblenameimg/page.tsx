import { SampleImage } from '@/components/specific/documents/pauljadam-modern-web-a11y-demos';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "img要素のアクセシブルネームの計算 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
});

export default function Page() {
  return (
    <>
      <h1>
        <code>img</code>要素のアクセシブルネームの計算
      </h1>

      <p>
        <a href="http://www.w3.org/TR/html-aapi/#img-element">
          HTML to Platform Accessibility APIs Implementation Guide
        </a>{' '}
        によると、WAI-ARIA属性は<code>img</code>
        要素のアクセシブルネームの計算に含まれます。ただし、常に最も堅牢な属性を利用して実装することが最善です。
      </p>

      <p>アクセシブルネームの計算順序は次の通りです。</p>

      <ol>
        <li>
          <code>aria-labelledby</code>属性を利用する
        </li>
        <li>
          それがなければ<code>aria-label</code>属性値を参照する
        </li>
        <li>
          それがなければ<code>alt</code>属性値を参照する
        </li>
        <li>
          それがなければ<code>title</code>属性値を参照する
        </li>
        <li>
          いずれも使用可能なテキストが得られない場合、この<code>img</code>要素にアクセシブルネームはありません。
        </li>
      </ol>

      <h2>OS・UA・ATのサポート状況</h2>

      <ul>
        <li>OS X 10.9.2 + Safari + VoiceOver</li>
        <li>iOS 7 + Mobile Safari + VoiceOver</li>
        <li>Windows 7 + Firefox 28 + NVDA 2013.1</li>
        <li>Windows 7 + Internet Explorer 8 + JAWS 14.0.1832</li>
        <li>Android 4.4.2 + Chrome 34.01847.114 + TalkBack 3.5.1</li>
        <li>Android 4.4.2 + Firefox 29.0.1 + TalkBack 3.5.1 </li>
      </ul>

      <h2>Support Notes</h2>

      <p>
        iOSおよびOS
        X用のVoiceOverでは、オプションの「イメージをナビゲート」で「常にする」「説明付き」「しない」の３項目を選ぶことができます。「説明付き」とはアクセシブルネームを持つ画像のことです。
      </p>

      <p>
        VoiceOverは、デフォルトだとアクセシブルネームを持たない<code>img</code>
        要素の場合、画像のファイル名を読み上げます。NVDA及びJAWSは、画像のファイル名を読み上げることはありません。故に、アクセシブルネームを持たない画像がページに存在することをユーザは知ることができません。AndroidのChromeではアクセシブルネームのない画像は無視され、Firefoxでは「graphic」として読み込まれます。
      </p>

      <h2>
        <code>aria-labelledby</code>属性を利用した例
      </h2>

      <p>
        <SampleImage
          filename="/accessiblenameimg-360bridge.jpg"
          aria-labelledby="penny-label"
          width={800}
          height={533}
        />
      </p>

      <p id="penny-label">ペニーバッカー橋（aria-labelledby属性経由）</p>

      <h2>
        <code>aria-label</code>属性を利用した例
      </h2>

      <p>
        <SampleImage
          filename="/accessiblenameimg-360bridge.jpg"
          aria-label="ペニーバッカー橋（aria-label属性指定）"
          width={800}
          height={533}
        />
      </p>

      <h2>
        <code>alt</code>属性を利用した例
      </h2>

      <p>
        <SampleImage
          filename="/accessiblenameimg-360bridge.jpg"
          alt="ペニーバッカー橋（alt属性指定）"
          width={800}
          height={533}
        />
      </p>

      <h2>
        <code>title</code>属性を利用した例
      </h2>

      <p>
        <SampleImage
          filename="/accessiblenameimg-360bridge.jpg"
          title="ペニーバッカー橋（title属性指定）"
          width={800}
          height={533}
        />
      </p>

      <h2>アクセシブルネームを持たない例</h2>

      <p>
        <SampleImage filename="/accessiblenameimg-360bridge.jpg" width={800} height={533} />
      </p>

      <h2>Android版FirefoxとTalkBackを使用してスクリーンリータが出力した様子のスクリーンショット</h2>

      <p>
        <SampleImage
          filename="/accessiblenameimg-titleasnametalkbackfirefox.jpg"
          alt='TalkBack reads "Pennybacker Bridge via title attribute graphic"'
          width={607}
          height={1080}
        />
      </p>
    </>
  );
}
