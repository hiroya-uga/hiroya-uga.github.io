import Link, { LinkProps } from 'next/link';

export const Button = (props: Omit<LinkProps, 'className'> & { children: React.ReactNode }) => {
  return (
    <Link
      {...props}
      className="inline-block rounded-lg bg-slate-200 px-4 py-3 text-sm text-black no-underline transition-colors hover:bg-slate-300"
    />
  );
};
