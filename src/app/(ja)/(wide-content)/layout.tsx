import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <Header layout="wide-content" />

      <main className="px-content-inline lg:pl-10">
        <div className="max-w-structure mx-auto">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
