import { SlackReminderCommandGenerator } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client';
import { HelpLink } from '@/components/Clickable';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools/slack-reminder-command-generator');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        {metadata.description.split('\n').map((description) => {
          return <p key={description}>{description}</p>;
        })}
        <p>
          <HelpLink href="https://slack.com/intl/ja-jp/help/articles/208423427-%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B">
            Slackリマインダーとは？
          </HelpLink>
        </p>
      </PageTitle>
      <SlackReminderCommandGenerator />
    </>
  );
}
