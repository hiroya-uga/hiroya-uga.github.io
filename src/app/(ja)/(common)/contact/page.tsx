import { Heading } from '@/components/Heading';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/contact');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />

      <Heading level={2}>同じ組織で働いている方へ</Heading>

      <p>社内Slackからご連絡ください。</p>

      <Heading level={2}>その他のみなさま</Heading>

      <p>ご存じの方はEmailでご連絡ください。</p>
      <p>
        SNS経由の場合は、Twitter（X）のアカウント
        <a href="https://x.com/hiroya_UGA">@hiroya_UGA</a>へリプライをお願いいたします。
      </p>
    </>
  );
}
