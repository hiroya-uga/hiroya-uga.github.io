import { HelpLink } from '@/components/Clickable';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';
import { NuValidatorBookmarkletGenerator } from './Client';

export const metadata = getMetadata('/tools/nu-bookmarklet-generator');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} following={metadata.following} shouldShowPrivacyPolicyMessage>
        {metadata.description.split('\n').map((description) => {
          return <p key={description}>{description}</p>;
        })}
        <p className="mt-4">
          <HelpLink href="https://validator.w3.org/nu/about.html" hrefLang="en">
            The Nu Html Checkerについて
          </HelpLink>
        </p>
      </PageTitle>

      <NuValidatorBookmarkletGenerator />
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink hashtags={['html', 'bookmarklet']} />
      </p>
    </>
  );
}
