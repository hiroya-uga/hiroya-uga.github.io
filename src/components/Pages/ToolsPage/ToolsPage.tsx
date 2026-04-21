import Link from 'next/link';

import { Heading } from '@/components/Heading';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { OSS_LINK_LIST, TOOLS_LINK_LIST } from '@/constants/link-list';
import { JOB_ROLES_JA } from '@/constants/works';
import { getMetadata } from '@/utils/get-metadata';
import { ToolCard } from './server';

const toToolCardProps = ({ pathname, userType }: { pathname: string; userType?: string[] }) => {
  const { pageTitle, description } = getMetadata(pathname);

  return {
    key: pageTitle,
    pageTitle,
    pathname,
    description: description.split('\n'),
    jobRoles: userType?.map((role) => JOB_ROLES_JA[role as keyof typeof JOB_ROLES_JA]) ?? [],
  };
};

interface Props {
  pageTitle: string;
  description: string;
}

export const ToolsPage = ({ pageTitle, description }: Props) => {
  const cliTools = TOOLS_LINK_LIST.cli.map(toToolCardProps).sort((a, b) => a.key.localeCompare(b.key));
  const webTools = TOOLS_LINK_LIST.web.map(toToolCardProps).sort((a, b) => a.key.localeCompare(b.key));
  const playgroundTools = TOOLS_LINK_LIST.playground
    .map(({ pathname }) => {
      const data = getMetadata(pathname);

      return {
        key: data.pageTitle,
        title: <Link href={pathname}>{data.pageTitle}</Link>,
        description: data.description.replaceAll('\n', ''),
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  return (
    <>
      <PageTitle title={pageTitle} description={description} shouldShowPrivacyPolicyMessage />

      <Heading level={2}>CLI</Heading>

      <dl className="@w640:grid-cols-2 @w640:lg:grid-cols-3 grid grid-cols-1 gap-6">
        {cliTools.map(({ key, ...props }) => (
          <ToolCard key={key} {...props} />
        ))}
      </dl>

      <Heading level={2}>Web</Heading>

      <dl className="@w640:grid-cols-2 @w640:lg:grid-cols-3 grid grid-cols-1 gap-6">
        {webTools.map(({ key, ...props }) => (
          <ToolCard key={key} {...props} />
        ))}
      </dl>

      <Heading level={3}>Playground</Heading>

      <SimpleDescriptionList list={playgroundTools} />

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
