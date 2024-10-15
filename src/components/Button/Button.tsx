import Link, { LinkProps } from 'next/link';

export const Button = (props: Omit<LinkProps, 'className'> & { children: React.ReactNode }) => {
  return (
    <Link
      {...props}
      className="no-underline text-black bg-slate-200 px-4 py-3 rounded-lg text-sm hover:bg-slate-300 inline-block transition-colors"
    />
  );
};
