import { JsonLd } from '@/components/Meta';
import { GamesSudokuPage } from '@/components/Pages/GamesSudokuPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/sudoku');

export default function Page() {
  const jsonLd = {
    ...DEFAULT_JSON_LD,
    '@type': 'Game',
    name: metadata.pageTitle,
    description: metadata.description,
    url: `${URL_ORIGIN}/games/sudoku/`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <GamesSudokuPage metadata={metadata} />
    </>
  );
}
