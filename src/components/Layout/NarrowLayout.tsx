import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';

export const NarrowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <GlobalHeader />

      <main className="@container px-content-inline">
        <div className="mx-auto max-w-[50rem]">{children}</div>
      </main>

      <GlobalFooter />
    </div>
  );
};
