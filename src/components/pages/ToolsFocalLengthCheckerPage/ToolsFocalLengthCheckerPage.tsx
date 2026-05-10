import { PageTitle } from '@/components/structures/PageTitle';
import { Picture } from '@/components/ui/features/Picture';
import { NoteList } from '@/components/ui/lists/NoteList';
import { Metadata } from '@/utils/get-metadata';
import { FocalLengthChecker, PwaInstall } from './client';

export const ToolsFocalLengthCheckerPage = (props: Metadata) => {
  return (
    <>
      <div className="px-content-inline pwa:hidden">
        <div className="mx-auto max-w-[max(40rem,40vw)]">
          <PageTitle {...props}>
            <p className="mt-4">このツールはインストール版が利用できます。</p>
            <p>
              詳細は<a href="#how-to-use">使い方はこちら</a>を参照してください。
            </p>
          </PageTitle>
        </div>
      </div>

      <FocalLengthChecker />

      <div className="px-content-inline pwa:hidden mt-20">
        <div className="mx-auto max-w-[max(40rem,40vw)]">
          <h2 className="mb-10 text-center text-2xl font-bold leading-snug" id="how-to-use">
            使い方
          </h2>

          <h3 className="mb-paragraph text-lg font-bold">1. 焦点距離の確認</h3>

          <div className="flow-root">
            <div className="mb-paragraph @w640:ml-32PX @w640:float-right">
              <Picture
                src="/public/tools/focal-length-checker/images/step-01.webp"
                width={600 / 2}
                height={750 / 2}
                alt=""
                className="mx-auto rounded-md border border-black dark:border-white/20"
              />
            </div>
            <div className="space-y-paragraph">
              <p>まずデバイスのカメラの焦点距離（35mm換算）を確認します。</p>

              <p>iPhoneの場合は、 カメラアプリのズームボタンを長押し（またはスワイプ）すると焦点距離が表示されます。</p>
            </div>
          </div>

          <h3 className="mb-paragraph mt-20 text-lg font-bold">2. カメラ情報を入力</h3>

          <div className="flow-root">
            <div className="mb-paragraph @w640:ml-32PX @w640:float-right">
              <Picture
                src="/public/tools/focal-length-checker/images/step-02.webp"
                width={600 / 2}
                height={480 / 2}
                alt=""
                className="mx-auto rounded-md border border-black dark:border-white/20"
              />
            </div>
            <div className="space-y-paragraph">
              <p>デバイス情報のレンズは複数表示されますが、その中から動作するものをお選びください。</p>
              <p>
                続いて、確認した焦点距離を設定し、お持ちのカメラのセンサーサイズやアスペクト比などの情報を入力します。
              </p>
            </div>
          </div>

          <h3 className="mb-paragraph mt-20 text-lg font-bold">3. 撮影</h3>

          <NoteList list={['キャプチャは開発中のものです。']} />

          <div className="@w640:grid @w640:grid-cols-2 mb-paragraph mt-2 gap-4">
            <div className="@w640:m-0 mb-4">
              <Picture
                src="/public/tools/focal-length-checker/images/step-03.webp"
                width={600 / 2}
                height={902 / 2}
                alt="本アプリで東京駅を写し、各種焦点距離を確認している様子の画面キャプチャ"
                className="@w640:w-full mx-auto border border-black dark:border-white/20"
              />
            </div>
            <div>
              <Picture
                src="/public/tools/focal-length-checker/images/step-04.webp"
                width={600 / 2}
                height={902 / 2}
                alt="実際に200mmで撮影した東京駅"
                className="@w640:w-full mx-auto border border-black dark:border-white/20"
              />
            </div>
          </div>

          <div className="space-y-paragraph">
            <p>スマホカメラで被写体を映しながら、画面上のフレームで各焦点距離の画角を確認しまず。</p>

            <p>
              狙った焦点距離のフレームに収まるよう構図を見つけたら、お持ちのカメラでシャッターを切ります。サンプル写真は200mmで撮影したものです。
            </p>
          </div>

          <h3 className="mb-paragraph mt-20 text-lg font-bold">4. スマホにインストール</h3>

          <div className="flow-root">
            <div className="mb-paragraph @w640:ml-32PX @w640:float-right">
              <Picture
                src="/public/tools/focal-length-checker/images/step-05.webp"
                width={600 / 2}
                height={1298 / 2}
                alt=""
                className="mx-auto rounded-md border border-black dark:border-white/20"
              />
            </div>
            <p>このツールはインストール版がご利用いただけます。</p>
            <PwaInstall />

            <div className="mt-4">
              <NoteList list={['このツールのアイコンはChatGPTにより生成されました。']} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
