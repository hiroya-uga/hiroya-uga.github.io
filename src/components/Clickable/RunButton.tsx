import { SvgIcon } from '@/components/Icons';
import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef, Ref } from 'react';

type Props = {
  children?: React.ReactNode;
  beforeIcon?: Parameters<typeof SvgIcon>[0]['name'];
  afterIcon?: Parameters<typeof SvgIcon>[0]['name'];
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'disabled' | 'onTouchStart'>;

const RunButtonComponent = ({ children, beforeIcon, afterIcon, ...props }: Props, ref: Ref<HTMLButtonElement>) => {
  return (
    <button
      ref={ref}
      className={clsx([
        'max-w-260px bg-primary border-secondary text-high-contrast hover:bg-high-contrast-reverse pointer-events-auto mx-auto block w-full rounded-lg border border-solid py-2 transition-[background-color,border-color,box-shadow,opacity] hover:shadow-lg active:shadow-none disabled:opacity-50',
        beforeIcon && !afterIcon && 'pl-3.5 pr-4',
        afterIcon && !beforeIcon && 'pl-4 pr-3.5',
        !beforeIcon && !afterIcon && 'px-8',
        beforeIcon && afterIcon && 'px-4',
      ])}
      {...props}
    >
      {beforeIcon || afterIcon ? (
        <span
          className={clsx([
            'mx-auto grid w-fit place-items-center gap-2',
            afterIcon && beforeIcon && 'grid-cols-[1rem_auto_1rem]',
            afterIcon && !beforeIcon && 'grid-cols-[auto_1rem]',
            !afterIcon && beforeIcon && 'grid-cols-[1rem_auto]',
          ])}
        >
          {beforeIcon && (
            <span className="relative size-4">
              <SvgIcon alt="" name={beforeIcon} />
            </span>
          )}
          <span>{children}</span>
          {afterIcon && (
            <span className="relative size-4">
              <SvgIcon alt="" name={afterIcon} />
            </span>
          )}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export const RunButton = forwardRef(RunButtonComponent);
