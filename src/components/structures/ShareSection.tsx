import { TweetLink } from '@/components/ui/buttons/TweetLink';
import { Lang } from '@/types/lang';
import clsx from 'clsx';

interface Props {
  lang?: Lang;
  align?: 'center' | 'right';
  message?: Parameters<typeof TweetLink>[0]['message'];
}

export const ShareSection = ({ lang = 'ja', align = 'right', message }: Readonly<Props>) => {
  return (
    <p
      className={clsx([
        'mt-share-buttons pwa:hidden mx-auto grid',
        align === 'right' && 'justify-end',
        align === 'center' && 'place-items-center',
      ])}
    >
      <TweetLink lang={lang} message={message} />
    </p>
  );
};
