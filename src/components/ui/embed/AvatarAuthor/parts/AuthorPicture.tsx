'use client';

import { Toast } from '@/components/ui/dialogs/Toast';
import { useAchievement } from '@/hooks/use-achievement';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { formatUrl } from '@/utils/formatter';
import { AuthorButton } from './AuthorButton';
import { BusinessCard } from './BusinessCard';

const KEY = '─';
const VALUE = '≡Σ⸨⸨_つ•̀ω•́）つ📇';

const AuthorPictureContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isExpandedFromQuery = searchParams.get(KEY) === VALUE;

  const [isExpanded, setIsExpanded] = useState(isExpandedFromQuery);
  const { toastProps, unlock } = useAchievement();

  useEffect(() => {
    setIsExpanded(isExpandedFromQuery);
  }, [isExpandedFromQuery]);

  const onClick = () => {
    setIsExpanded(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set(KEY, VALUE);
    router.push(
      formatUrl({
        pathname,
        query: params,
      }),
      { scroll: false },
    );
  };

  const onClose = () => {
    setIsExpanded(false);

    if (isExpandedFromQuery) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(KEY);
      router.replace(
        formatUrl({
          pathname,
          query: params,
        }),
        { scroll: false },
      );
    }

    unlock('ran-out-of-business-cards', 300);
  };

  return (
    <>
      <AuthorButton onClick={onClick} />
      <BusinessCard isOpen={isExpanded} onClose={onClose} />
      <Toast {...toastProps} />
    </>
  );
};

export const AuthorPicture = () => {
  return (
    <Suspense fallback={<AuthorButton />}>
      <AuthorPictureContent />
    </Suspense>
  );
};
