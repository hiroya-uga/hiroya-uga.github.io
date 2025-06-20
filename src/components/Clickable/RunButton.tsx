import { ButtonHTMLAttributes } from 'react';

type Props = {
  children?: React.ReactNode;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'disabled'>;

export const RunButton = (props: Props) => {
  return (
    <button
      className="mx-auto block w-fit max-w-full rounded-md border border-solid border-black bg-[#f1f1f1] px-8 py-2 text-black transition-[background-color,border-color,box-shadow] hover:border-[#777] hover:bg-white hover:shadow-lg active:border-[#555] active:bg-[#e1e1e1] active:shadow-none disabled:opacity-50"
      {...props}
    />
  );
};
