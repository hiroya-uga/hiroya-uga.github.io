import Link from 'next/link';

import { Heading } from '@/components/Heading';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { OSS_LINK_LIST, TOOLS_LINK_LIST } from '@/constants/link-list';
import { getMetadata } from '@/utils/get-metadata';
import { ToolCards } from './server';

interface Props {
  pageTitle: string;
  description: string;
}

export const ToolsPage = ({ pageTitle, description }: Props) => {
  return (
    <>
      <PageTitle title={pageTitle} description={description} shouldShowPrivacyPolicyMessage />

      <Heading level={2}>CLI</Heading>
      <ToolCards items={TOOLS_LINK_LIST.cli} />

      <Heading level={2}>Web</Heading>
      <ToolCards items={TOOLS_LINK_LIST.web} />

      <Heading level={3}>Playground</Heading>
      <SimpleDescriptionList
        list={TOOLS_LINK_LIST.playground
          .map(({ pathname }) => {
            const data = getMetadata(pathname);

            return {
              key: data.pageTitle,
              title: <Link href={pathname}>{data.pageTitle}</Link>,
              description: data.description.replaceAll('\n', ''),
            };
          })
          .sort((a, b) => a.key.localeCompare(b.key))}
      />

      <Heading level={2}>npm packages</Heading>
      <SimpleDescriptionList
        list={OSS_LINK_LIST.map(({ title, description: desc, url }) => ({
          key: title,
          title: <Link href={url}>{title}</Link>,
          description: desc,
        })).sort((a, b) => a.key.localeCompare(b.key))}
      />
    </>
  );
};
