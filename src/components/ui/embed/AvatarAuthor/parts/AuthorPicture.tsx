'use client';

import { Toast } from '@/components/ui/dialogs/Toast';
import { useAchievement } from '@/hooks/use-achievement';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { formatUrl } from '@/utils/formatter';
import { AuthorButton } from './AuthorButton';

// 閉じた状態の <dialog> が描画後DOMに常駐すると、クローラーが名刺の文言を description に拾うため、初回に開くまで読み込まない
const BusinessCard = dynamic(() => import('./BusinessCard').then(({ BusinessCard }) => BusinessCard), { ssr: false });

const KEY = '─';
const VALUE = '≡Σ⸨⸨_つ•̀ω•́）つ📇';

const AuthorPictureContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isExpandedFromQuery = searchParams.get(KEY) === VALUE;

  const [isExpanded, setIsExpanded] = useState(isExpandedFromQuery);
  const [hasExpanded, setHasExpanded] = useState(isExpandedFromQuery);
  const { toastProps, unlock } = useAchievement();

  useEffect(() => {
    setIsExpanded(isExpandedFromQuery);

    if (isExpandedFromQuery) {
      setHasExpanded(true);
    }
  }, [isExpandedFromQuery]);

  const onClick = () => {
    setIsExpanded(true);
    setHasExpanded(true);

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
      {hasExpanded && <BusinessCard isOpen={isExpanded} onClose={onClose} />}
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
