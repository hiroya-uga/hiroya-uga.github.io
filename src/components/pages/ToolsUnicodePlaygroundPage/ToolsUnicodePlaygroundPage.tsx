import { PageTitle } from '@/components/structures/PageTitle';
import { Lang } from '@/types/lang';
import { Metadata } from '@/utils/get-metadata';

import { ShareSection } from '@/components/structures/ShareSection';
import { NoteBox } from '@/components/ui/boxes/NoteBox';
import { Heading } from '@/components/ui/headings/Heading';
import { Table } from '@/components/ui/tables/Table';
import { UnicodePlaygroundContent } from './client';
import { unicodePlaygroundLocales } from './locales';

interface Props {
  metadata: Pick<Metadata, 'pageTitle' | 'following' | 'description'>;
  lang?: Lang;
}

export const ToolsUnicodePlaygroundPage = ({ metadata, lang = 'ja' }: Readonly<Props>) => {
  const t = unicodePlaygroundLocales[lang].page;

  return (
    <>
      <PageTitle {...metadata} lang={lang} shouldShowPrivacyPolicyMessage shouldShowOtherLanguageLink />

      <UnicodePlaygroundContent lang={lang} />

      <Heading level={2}>Tips</Heading>

      <Table>
        <thead>
          <tr>
            <th scope="col">{t.tipsMetric}</th>
            <th scope="col">{t.tipsContent}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">UTF-16 length</th>
            <td>
              <p>
                <code>str.length</code>
              </p>
              <p>{t.utf16LengthDescription}</p>
            </td>
          </tr>
          <tr>
            <th scope="row">{t.utf8BytesLabel}</th>
            <td>
              <p>
                <code>{'new TextEncoder().encode(str).length'}</code>
              </p>
              <p>{t.utf8BytesDescription}</p>
            </td>
          </tr>
          <tr>
            <th scope="row">{t.codepointCountLabel}</th>
            <td>
              <p>
                <code>{'[...str].length'}</code>
              </p>
              <p>{t.codepointCountDescription}</p>
            </td>
          </tr>
          <tr>
            <th scope="row">{t.graphemeCountLabel}</th>
            <td>
              <p>
                <code>{'Intl.Segmenter'}</code>
              </p>
              <p>{t.graphemeCountDescription}</p>
            </td>
          </tr>
        </tbody>
      </Table>

      <div className="mt-6">
        <NoteBox title={t.graphemeBackspaceNoteTitle}>{t.graphemeBackspaceNoteBody}</NoteBox>
      </div>

      <ShareSection lang={lang} />
    </>
  );
};
