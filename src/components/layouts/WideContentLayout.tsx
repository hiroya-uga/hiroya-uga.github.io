import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';

interface Props {
  children: React.ReactNode;
}

export const WideContentLayout = ({ children }: Readonly<Props>) => {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <GlobalHeader layout="wide-content" />

      <main className="px-content-inline">
        <div className="max-w-structure mx-auto">{children}</div>
      </main>

      <GlobalFooter />
    </div>
  );
};
