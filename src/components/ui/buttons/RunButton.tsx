import { SvgIcon } from '@/components/ui/media/SvgIcon';
import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef, Ref } from 'react';

type Props = {
  children?: React.ReactNode;
  beforeIcon?: Parameters<typeof SvgIcon>[0]['name'];
  afterIcon?: Parameters<typeof SvgIcon>[0]['name'];
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'disabled' | 'onTouchStart'>;

const RunButtonComponent = (
  { type = 'button', children, beforeIcon, afterIcon, ...props }: Readonly<Props>,
  ref: Ref<HTMLButtonElement>,
) => {
  return (
    <button
      {...props}
      type={type}
      ref={ref}
      className={clsx([
        'btn-run',
        'max-w-260px block py-2',
        beforeIcon && !afterIcon && 'pl-14PX pr-16PX',
        afterIcon && !beforeIcon && 'pl-16PX pr-14PX',
        !beforeIcon && !afterIcon && 'px-32PX',
        beforeIcon && afterIcon && 'px-16PX',
      ])}
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
