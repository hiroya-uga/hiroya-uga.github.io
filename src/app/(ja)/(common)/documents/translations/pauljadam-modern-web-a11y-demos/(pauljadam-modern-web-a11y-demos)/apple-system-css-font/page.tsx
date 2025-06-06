import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/apple-system-css-font/page.css';

import { SampleImage } from '@/components/specific/documents/pauljadam-modern-web-a11y-demos';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/apple-system-css-font');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <SampleImage
        filename="/apple-system-css-font-IMG_0371.png"
        alt="iOSのアクセシビリティ項目「さらに大きな文字」の設定画面のスクリーンショット"
        width={300}
        height={534}
      />
      <div className="body">
        <h2>Body</h2>
        <p>-apple-system-body</p>
        <p>
          素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。
        </p>
      </div>
      <h2 className="caption1">Caption 1</h2>

      <div className="caption1">-apple-system-caption 1</div>

      <h2 className="caption2">Caption 2</h2>

      <div className="caption2">-apple-system-caption 2</div>

      <h2 className="footnote">Footnote</h2>

      <div className="footnote">-apple-system-footnote</div>

      <h2 className="headline">Headline</h2>

      <div className="headline">-apple-system-headline</div>

      <div className="short-body">
        <h2>Short Body</h2>
        <p>-apple-system-short-body</p>
        <p>
          素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non consequatur, porro facilis voluptatem, provident
          quae, est aperiam laborum quibusdam consectetur quidem excepturi nobis sed perspiciatis ex! Doloremque
          reprehenderit odit nihil!
        </p>
      </div>
      <h2 className="short-caption1">Short Caption 1</h2>

      <div className="short-caption1">-apple-system-short-caption 1</div>

      <h2 className="short-footnote">Short Footnote</h2>

      <div className="short-footnote">-apple-system-short-footnote</div>

      <h2 className="short-headline">Short Headline</h2>

      <div className="short-headline">-apple-system-short-headline</div>

      <h2 className="short-subheadline">Short Subheadline</h2>

      <div className="short-subheadline">-apple-system-short-subheadline</div>

      <h2 className="subheadline">Subheadline</h2>

      <div className="subheadline">-apple-system-subheadline</div>

      <div className="tall-body">
        <h2>Tall Body</h2>
        <p>-apple-system-tall-body</p>
        <p>
          素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。
        </p>
      </div>
    </>
  );
}
