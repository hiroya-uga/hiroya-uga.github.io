import clsx from 'clsx';
import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';

type Props = {
  children?: React.ReactNode;
  afterIcon?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'disabled'>;

export const RunButton = ({ children, afterIcon, ...props }: Props) => {
  return (
    <button
      className={clsx([
        'max-w-260px pointer-events-auto mx-auto block w-full rounded-md border border-solid border-black bg-[#f1f1f1] py-2 text-black transition-[background-color,border-color,box-shadow] hover:border-[#777] hover:bg-white hover:shadow-lg active:border-[#555] active:bg-[#e1e1e1] active:shadow-none disabled:opacity-50',
        afterIcon ? 'pl-5 pr-4' : 'px-8',
      ])}
      {...props}
    >
      {afterIcon ? (
        <span className="mx-auto grid w-fit grid-cols-[auto_1rem] place-items-center gap-1">
          <span>{children}</span>
          <span>
            <Image width={16} height={16} alt="" src={afterIcon} />
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
