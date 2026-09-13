import { ToolCard } from '@/components/ui/card/ToolCard';
import { TOOLS_LINK_LIST } from '@/constants/link-list';
import { JOB_ROLES_JA } from '@/constants/works';
import { getMetadata } from '@/utils/get-metadata';

const toToolCardProps = (toolList: (typeof TOOLS_LINK_LIST)[string]) => {
  return toolList
    .map(({ pathname, userType }: { pathname: string; userType?: string[] }) => {
      const { pageTitle, description } = getMetadata(pathname);

      return {
        key: pageTitle,
        pageTitle,
        pathname,
        description: description.split('\n'),
        jobRoles: userType?.map((role) => JOB_ROLES_JA[role as keyof typeof JOB_ROLES_JA]) ?? [],
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));
};

interface Props {
  items: (typeof TOOLS_LINK_LIST)[string];
}

export const ToolCards = ({ items }: Props) => {
  const resolvedItems = toToolCardProps(items);

  return (
    <dl className="w640:px-1 w640:grid-cols-2 w800:grid-cols-3 grid grid-cols-1 gap-6">
      {resolvedItems.map(({ key, ...props }) => (
        <ToolCard key={key} {...props} />
      ))}
    </dl>
  );
};
