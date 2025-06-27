import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';

type Props = { size?: 'small' | 'medium'; children?: ReactNode; onClick: () => void };

export const ClearButton = ({ size = 'medium', children = 'クリア', onClick }: Props) => {
  return (
    <button
      type="button"
      className={clsx([
        'rounded-full border border-black bg-[#f1f1f1] transition-[background-color,border-color,box-shadow] hover:border-[#777] hover:bg-white hover:shadow-lg active:border-[#555] active:bg-[#e1e1e1] active:shadow-none disabled:opacity-50',
        size === 'small' && 'px-2.5 py-1.5 text-xs',
        size === 'medium' && 'px-3 py-2 text-sm',
      ])}
      onClick={onClick}
    >
      <span className="mx-auto grid w-fit grid-cols-[auto_1rem] place-items-center gap-0.5 leading-none">
        <span className="pt-px">{children}</span>
        <span>
          <Image src="/common/images/icons/trash-can.svg" alt="" width={16} height={16} className="size-3" />
        </span>
      </span>
    </button>
  );
};
