import { JsonLd } from '@/components/Meta';
import { AboutPage } from '@/components/Pages/AboutPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/about');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'ProfilePage',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/about`,
  mainEntity: {
    ...DEFAULT_JSON_LD.author,
    alternateName: '宇賀景哉',
    image: `${URL_ORIGIN}/common/images/profile.png`,
    jobTitle: 'フロントエンドエンジニア',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutPage />
    </>
  );
}
