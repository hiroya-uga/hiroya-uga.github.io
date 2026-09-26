import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/utils/get-metadata';
import { KeyboardMasterChallengeClient } from './client';

interface Props {
  metadata: Metadata;
}

export const GamesKeyboardMasterPage = ({ metadata }: Readonly<Props>) => {
  return (
    <>
      <PageTitle {...metadata}>
        <p>中断するにはESCキーを3秒以上押し続けてください。</p>
      </PageTitle>

      <div className="w640:min-h-0 w640:aspect-4/3 relative min-h-[50vh] rounded" role="group" aria-label="ゲーム画面">
        <KeyboardMasterChallengeClient />
      </div>
    </>
  );
};
