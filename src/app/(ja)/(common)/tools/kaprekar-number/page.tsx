import { KaprekarNumberContent } from '@/app/(ja)/(common)/tools/kaprekar-number/Client';
import { NoteBox } from '@/components/Box';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools/kaprekar-number');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} following={metadata.following}>
        <div className="pt-paragraph">
          <NoteBox type="note" title="カプレカ数の例">
            <p>2桁のカプレカ数：なし</p>
            <p>3桁のカプレカ数：495</p>
            <p>4桁のカプレカ数：6174</p>
            <p>5桁のカプレカ数：なし</p>
            <p>6桁のカプレカ数：549945および631764</p>
          </NoteBox>
        </div>
      </PageTitle>
      <KaprekarNumberContent />
    </>
  );
}
