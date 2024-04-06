import '@/app/(ja)/(common)/common.css';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className="px-[16px] lg:pl-10">
        <div className="mx-auto max-w-content">{children}</div>
      </main>

      <Footer />
    </>
  );
}
