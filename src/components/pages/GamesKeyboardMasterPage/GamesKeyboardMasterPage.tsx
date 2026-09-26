import { GAME_ROOT_ID } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { PageTitle } from '@/components/structures/PageTitle';
import { DiscList } from '@/components/ui/lists/DiscList';
import { Metadata } from '@/utils/get-metadata';
import { KeyboardMasterChallengeClient } from './client';

interface Props {
  metadata: Metadata;
}

export const GamesKeyboardMasterPage = ({ metadata }: Readonly<Props>) => (
  <>
    <PageTitle {...metadata}>
      <p>
        プレイ方法については<a href="#play-guide">遊び方</a>をご覧ください。
      </p>
    </PageTitle>

    <div
      className="mb-paragraph w640:min-h-0 w640:aspect-4/3 relative mx-auto max-h-[calc(100dvh-80px)] min-h-[50vh] rounded"
      role="group"
      aria-label="ゲーム画面"
      id={GAME_ROOT_ID}
    >
      <KeyboardMasterChallengeClient />
    </div>

    <h2 className="mb-3 mt-16 font-bold" id="play-guide">
      遊び方
    </h2>
    <DiscList
      list={[
        {
          key: 'focus-trap',
          value: (
            <strong>プレイ中はフォーカストラップが作動します。中断するにはESCキーを3秒以上押し続けてください。</strong>
          ),
        },
        'キーボード操作のみでお題をクリアしていくゲームです。',
        'ポインティングデバイス（マウスなど）でクリックしたり、お題のルールを守らない操作をすると失敗になります。',
        '設定変更から制限時間を有効にできます。',
        {
          key: 'how-to-focus',
          value: (
            <>
              <span className="block">
                操作したいUI（部品）に、フォーカス（操作対象）を合わせてから操作してください。
              </span>
              <kbd>Tab</kbd>
              キーで次の要素へ、
              <kbd>
                <kbd>Shift</kbd>+<kbd>Tab</kbd>
              </kbd>
              キーで前の要素へ移動できます（macOS Safariでは設定により
              <kbd>
                <kbd>Option</kbd>+<kbd>Tab</kbd>
              </kbd>
              、
              <kbd>
                <kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>Tab</kbd>
              </kbd>
              になっている場合があります）。
            </>
          ),
        },
      ]}
    />
  </>
);
