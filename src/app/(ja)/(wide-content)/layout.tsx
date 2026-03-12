import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <GlobalHeader layout="wide-content" />

      <main className="@container px-content-inline lg:pl-10">
        <div className="max-w-structure mx-auto">{children}</div>
      </main>

      <GlobalFooter />
    </div>
  );
}
