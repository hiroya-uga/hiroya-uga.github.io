import { SudokuClient } from '@/app/(ja)/(common)/games/sudoku/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/games/sudoku');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p>
          キーボードの場合は方向キーと<kbd>Enter</kbd>キーおよび
          <kbd>
            <kbd>Shift</kbd>+<kbd>Enter</kbd>
          </kbd>
          キーでもマスを移動できます。
        </p>
      </PageTitle>
      <div className="@container">
        <SudokuClient />
      </div>
    </>
  );
}
