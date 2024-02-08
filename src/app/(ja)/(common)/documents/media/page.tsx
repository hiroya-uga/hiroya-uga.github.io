import { MediaContent } from '@/app/(ja)/(common)/documents/media/Client';

import { useId } from 'react';

export default function Page() {
  const id = useId();

  return (
    <>
      <h1>外部メディア</h1>

      <MediaContent id={id} />
    </>
  );
}
