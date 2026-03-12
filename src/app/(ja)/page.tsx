import {
  BookMarkSection,
  CategorySection,
  ExternalMediaSection,
  Header,
  PickUpListSection,
  ProfileSection,
  TopImageSection,
  WelcomeMessageSection,
} from '@/app/(ja)/parts';
import { GlobalFooter } from '@/components/structures/GlobalFooter';

import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/');

export default function Home() {
  return (
    <>
      <Header pageTitle={metadata.pageTitle} />

      <main className="@container">
        <TopImageSection />
        <WelcomeMessageSection />

        <div className="bg-secondary px-content-inline @w640:mb-28 @w640:pb-11 @w640:pt-7 mb-8 py-8">
          <div className="max-w-content mx-auto">
            <h2 className="@w640:text-2xl mb-4 mt-0 text-xl font-bold">The power of the web</h2>

            <figure>
              <blockquote
                cite="https://www.w3.org/mission/accessibility/"
                lang="en"
                className="@w640:my-6 @w640:text-base @w1024:text-center mb-2 text-xs"
              >
                <p>
                  “
                  <a href="https://www.w3.org/mission/accessibility/#:~:text=The%20power%20of%20the%20Web%20is%20in%20its%20universality.%20Access%20by%20everyone%20regardless%20of%20disability%20is%20an%20essential%20aspect.">
                    The power of the Web is in its universality. Access by everyone regardless of disability is an
                    essential aspect.
                  </a>
                  ”
                </p>
              </blockquote>
              <figcaption className="text-2xs @w640:text-sm @w1024:pr-2 @w1024:text-center text-right">
                <p>
                  — <cite>Tim Berners-Lee</cite>, W3C Director and inventor of the World Wide Web
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        <PickUpListSection />
        <CategorySection />

        <div className="px-content-inline @w640:pb-20 pb-12">
          <div className="max-w-content mx-auto">
            <ExternalMediaSection />
            <BookMarkSection />
            <ProfileSection />
          </div>
        </div>
      </main>

      <GlobalFooter />
    </>
  );
}
