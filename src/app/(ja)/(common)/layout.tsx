import '@/app/(ja)/(common)/common.css';

import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="px-[var(--content-padding-inline)] lg:pl-10">
        <div className="mx-auto max-w-content">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
