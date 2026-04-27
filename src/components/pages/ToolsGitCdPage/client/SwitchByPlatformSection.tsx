'use client';

import { usePlatform } from '@/components/ui/client/embed/CodeBlockWithPlatform/hooks';

interface Props {
  content: Record<string, React.ReactNode>;
}

export const SwitchByPlatformSection = ({ content }: Props) => {
  const [platform] = usePlatform();
  return <>{content[platform]}</>;
};
