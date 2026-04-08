import { GlobalFooter } from '@/components/structures/GlobalFooter';

import { getMetadata } from '@/utils/get-metadata';
import { DiscoverSection, MainVisualSection, PowerOfTheWebSection } from './client';
import { BookMarkSection, CategoriesSection, ExternalMediaSection, Header, ProfileSection } from './server';

const { pageTitle } = getMetadata('/');

export const HomePage = () => {
  return (
    <>
      <Header pageTitle={pageTitle} />

      <main className="@container">
        <div className="bg-primary z-1 @w640:pb-16 relative pb-8">
          <MainVisualSection />
        </div>

        <PowerOfTheWebSection />

        <div className="bg-primary z-1 relative">
          <DiscoverSection />
          <CategoriesSection />

          <div className="px-content-inline @w640:pt-28 @w640:pb-23 pb-15 pt-11">
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
};
