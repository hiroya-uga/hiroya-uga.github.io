import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ExampleBox = ({ children }: Readonly<Props>) => {
  return (
    <figure>
      <figcaption className="relative z-10 w-fit bg-slate-600 px-2 text-white">Example</figcaption>
      <div className="bg-secondary mx-2 -mt-4 rounded-lg px-4 pb-4 pt-7">{children}</div>
    </figure>
  );
};
