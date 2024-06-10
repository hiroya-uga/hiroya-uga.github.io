import { ReactNode } from 'react';

export const ExampleBox = ({ children }: { children: ReactNode }) => {
  return (
    <figure>
      <figcaption className="relative z-10 w-fit bg-slate-600 px-2 text-white">Example</figcaption>
      <div className="mx-2 -mt-4 rounded-lg bg-white px-4 pb-4 pt-7">{children}</div>
    </figure>
  );
};
