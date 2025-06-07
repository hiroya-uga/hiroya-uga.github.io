import { GetUrlFromDOMContent } from '@/app/(ja)/(common)/tools/get-url-from-dom/Client';
import { Heading } from '@/components/Heading';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools/get-url-from-dom');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} shouldShowPrivacyPolicyMessage />
      <GetUrlFromDOMContent />

      <Heading level={2}>使い方</Heading>

      <ol className="list-decimal space-y-2 pl-7">
        <li>URLを抽出したいページやアプリケーションを開く</li>
        <li>
          マウスドラッグや
          <kbd>
            <kbd>Ctrl</kbd>+<kbd>A</kbd>
          </kbd>
          を押下するなどで、抽出したい範囲を選択する
        </li>
        <li>
          <kbd>
            <kbd>Ctrl</kbd>+<kbd>C</kbd>
          </kbd>
          を押下してコピーする
        </li>
        <li>
          本ツールの
          <b>入力エリア</b>をクリックする
        </li>
        <li>
          <kbd>
            <kbd>Ctrl</kbd>+<kbd>V</kbd>
          </kbd>
          を押下して貼り付ける
        </li>
        <li>
          <b>Result</b>からURLをコピーする
        </li>
      </ol>
    </>
  );
}
