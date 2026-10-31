'use client';

import { useContentSwitcher } from '@/hooks/use-content-switcher';

interface Props {
  content: Record<string, React.ReactNode>;
}

export const SwitchByPlatformSection = ({ content }: Props) => {
  const [platform] = useContentSwitcher('platform');
  return <>{content[platform]}</>;
};
