import {
  BookMarkSection,
  CategoriesSection,
  DiscoverSection,
  ExternalMediaSection,
  Header,
  MainVisualSection,
  ProfileSection,
} from '@/app/(ja)/parts';
import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { DEFAULT_JSON_LD } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';
import { PowerOfTheWebSection } from './parts/Client/ThePowerOfTheWebSection';

export const metadata = getMetadata('/');

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(DEFAULT_JSON_LD) }} />
      <Header pageTitle={metadata.pageTitle} />

      <main className="@container">
        <div className="bg-primary z-1 @w640:pb-16 relative pb-8">
          <MainVisualSection />
        </div>

        <PowerOfTheWebSection />

        <div className="bg-primary z-1 @w640:pt-28 relative pt-8">
          <DiscoverSection />
          <CategoriesSection />

          <div className="px-content-inline @w640:pb-20 pb-12">
            <div className="max-w-content mx-auto">
              <ExternalMediaSection />
              <BookMarkSection />
              <ProfileSection />
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </>
  );
}
