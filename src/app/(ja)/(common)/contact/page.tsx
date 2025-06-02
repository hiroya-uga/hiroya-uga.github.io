import { TextLink } from '@/components/Clickable';
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

      <Heading level={2}>GitHubのアカウントをお持ちの方へ</Heading>

      <p>
        当サイトに関する技術的な問題は、
        <TextLink href="https://github.com/hiroya-uga/hiroya-uga.github.io/issues">GitHubリポジトリのIssues</TextLink>
        へお願いいたします。
      </p>

      <Heading level={2}>その他のみなさま</Heading>

      <p className="mb-paragraph">ご存じの方はEmailでご連絡ください。</p>

      <p>SNS経由の場合、各種サービスのDMは反応できない可能性が非常に高いです。</p>
      <p>
        御用の方はTwitter（X）のアカウント
        <a href="https://x.com/hiroya_UGA">@hiroya_UGA</a>へリプライをお願いいたします。
      </p>
    </>
  );
}
