'use client';

import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {}

export const Abbr = (props: Readonly<Props>) => {
  return <abbr {...props} />;
};
