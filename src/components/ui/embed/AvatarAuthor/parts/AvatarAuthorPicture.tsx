'use client';

import { Toast } from '@/components/ui/dialogs/Toast';
import { Picture } from '@/components/ui/features/Picture';
import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { PROFILE_TEXT, SITE_AUTHOR, SITE_AUTHOR_JA, SITE_NAME } from '@/constants/meta';
import { useDialog } from '@/hooks/use-dialog';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

const ACHIEVEMENT_MESSAGE = '実績解除：デジタル名刺を見つけた';

const AVATAR_SRC = '/common/images/profile.png';
const QR_CODE_SRC = '/about/images/qrcode-to-about-page.png';
const X_HANDLE = '@hiroya_UGA';

interface BusinessCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessCard = ({ isOpen, onClose }: Readonly<BusinessCardProps>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { renderDialog } = useDialog();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog === null) {
      return;
    }

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return renderDialog(
    <dialog
      ref={dialogRef}
      aria-label="デジタル名刺"
      closedby="any"
      className={clsx([
        'shadow-sticky transition-fade [[open]]:pointer-events-auto [[open]]:visible [[open]]:opacity-100 backdrop:opacity-0',
        'backdrop:transition-fade backdrop:black/85 [[open]]:backdrop:animate-fade-in [[open]]:backdrop:[backdrop-filter:blur(8px)] wrap-anywhere bg-primary text-primary gap-16PX p-24PX pointer-events-none invisible fixed inset-0 z-50 m-auto grid size-full max-h-none max-w-none grid-rows-[1fr_auto] items-center text-center opacity-0',
        //
        'landscape:px-16PX landscape:grid-cols-[1fr_auto] landscape:grid-rows-1 landscape:pb-1 landscape:text-left',
        // wide
        '[@media(min-width:640px)_and_(min-height:500px)]:min-h-fit',
        '[@media(min-width:640px)_and_(min-height:500px)]:rounded-tr-[16px]',
        '[@media(min-width:640px)_and_(min-height:500px)]:size-auto',
        // landscape
        '[@media(min-width:640px)_and_(min-height:500px)]:portrait:aspect-[1/1.618]',
        '[@media(min-width:640px)_and_(min-height:500px)]:portrait:px-8PX',
        '[@media(min-width:640px)_and_(min-height:500px)]:portrait:pb-1',
        '[@media(min-width:640px)_and_(min-height:500px)]:portrait:h-[min(90vh,480px)]',
        // portrait
        '[@media(min-width:640px)_and_(min-height:500px)]:landscape:aspect-[1.618/1]',
        '[@media(min-width:640px)_and_(min-height:500px)]:landscape:w-[min(90vw,480px)]',
        '[@media(min-width:640px)_and_(min-height:500px)]:landscape:grid-cols-1',
      ])}
      onClose={onClose}
    >
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        aria-label="デジタル名刺を閉じる"
        className="bg-panel-primary hover:bg-panel-primary-hover size-32PX right-8PX top-8PX absolute grid place-items-center rounded-full"
      >
        <span className="size-16PX relative block">
          <SvgIcon name="cross" alt="" />
        </span>
      </button>

      <div className="landscape:gap-16PX mb-24PX landscape:flex">
        <p className="mb-16PX landscape:mb-44PX mx-auto w-fit">
          <Picture
            width={96}
            height={96}
            src={AVATAR_SRC}
            alt="似顔絵アイコン"
            className="min-w-112PX block h-auto rounded-full drop-shadow"
          />
        </p>

        <div className="min-w-0 flex-1">
          <p className="mb-8PX whitespace-pre-wrap text-sm [@media(min-width:640px)_and_(min-height:500px)]:text-[12px]">
            {PROFILE_TEXT.replace('、', '、\n')}
          </p>

          <p className="leading-tight">
            <span className="block text-3xl font-bold tracking-[1px] [@media(min-width:640px)_and_(min-height:500px)]:text-[20px]">
              {SITE_AUTHOR_JA}
            </span>
            <span className="block [@media(min-width:640px)_and_(min-height:500px)]:text-[16px]">{SITE_AUTHOR}</span>
          </p>

          <p
            className={clsx([
              'mt-12PX gap-4PX text-14px flex items-center justify-center landscape:justify-start',
              '[@media(min-width:640px)_and_(min-height:500px)]:text-[14px]',
              '[@media(min-width:640px)_and_(min-height:500px)]:mt-8PX',
            ])}
          >
            <Picture
              width={16}
              height={16}
              src="/common/images/logos/twitter.svg"
              alt=""
              className="size-14px dark:invert [@media(min-width:640px)_and_(min-height:500px)]:size-[12px]"
            />
            <span>{X_HANDLE}</span>
          </p>
        </div>
      </div>

      <div
        className={clsx([
          'min-w-fit text-center landscape:self-end',
          '[@media(min-width:640px)_and_(min-height:500px)]:landscape:absolute',
          '[@media(min-width:640px)_and_(min-height:500px)]:landscape:right-16PX',
          '[@media(min-width:640px)_and_(min-height:500px)]:landscape:bottom-4PX',
        ])}
      >
        <p className="mx-auto w-fit">
          <Picture
            width={96}
            height={96}
            src={QR_CODE_SRC}
            alt={`${SITE_NAME} へのQRコード`}
            className="min-w-80PX h-auto rounded drop-shadow"
          />
        </p>
        <p className="mt-4PX text-12px [@media(min-width:640px)_and_(min-height:500px)]:text-[10px]">{SITE_NAME}</p>
      </div>
    </dialog>,
  );
};

export const AvatarAuthorPicture = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpen = () => {
    setIsExpanded(true);

    const achievement = getLocalStorage('achievement');

    if (achievement?.['business-card'] === true) {
      return;
    }

    setToastMessage(ACHIEVEMENT_MESSAGE);
    setLocalStorage('achievement', {
      ...achievement,
      'business-card': true,
    });
  };

  return (
    <>
      <button type="button" className="block aspect-square rounded-full" aria-haspopup="dialog" onClick={handleOpen}>
        <Picture width={160} height={160} src={AVATAR_SRC} alt="似顔絵アイコン" className="w-full" priority />
      </button>

      <BusinessCard isOpen={isExpanded} onClose={() => setIsExpanded(false)} />
      <Toast message={toastMessage} setMessage={setToastMessage} popover />
    </>
  );
};
