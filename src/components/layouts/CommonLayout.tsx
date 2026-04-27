import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';

export const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <GlobalHeader />

      <main className="@container px-content-inline">
        <div className="max-w-content mx-auto">{children}</div>
      </main>

      <GlobalFooter />
    </div>
  );
};
