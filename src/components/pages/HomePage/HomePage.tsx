import { GlobalFooter } from '@/components/structures/GlobalFooter';

import { getMetadata } from '@/utils/get-metadata';
import { DiscoverSection, MainVisualSection, PowerOfTheWebSection } from './client';
import { BookMarkSection, CategoriesSection, ExternalMediaSection, Header, ProfileSection } from './server';

import clsx from 'clsx';
import styles from './HomePage.module.css';

const { pageTitle } = getMetadata('/');

export const HomePage = () => {
  return (
    <>
      <Header pageTitle={pageTitle} />

      <main className={styles.root}>
        <div className="bg-primary z-1 w640:pb-16 relative pb-8">
          <MainVisualSection />
        </div>

        <PowerOfTheWebSection />

        <div className={clsx([styles.sections, 'bg-primary z-1 relative'])}>
          <DiscoverSection />
          <CategoriesSection />

          <div className="px-content-inline pt-(--x-section-padding-top) pb-(--x-section-padding-bottom)">
            <div className="max-w-content mx-auto">
              <ExternalMediaSection />

              <div className="mt-(--x-section-padding-top)">
                <BookMarkSection />
              </div>

              <ProfileSection />
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </>
  );
};
