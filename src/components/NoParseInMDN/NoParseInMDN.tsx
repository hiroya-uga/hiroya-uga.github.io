import { HTMLAttributes } from 'react';

type Props = Pick<HTMLAttributes<HTMLHeadingElement>, 'children'>;

export const NoParseInMDN = ({ children }: Props) => {
  console.log({ children });

  return <>{children}</>;
};
