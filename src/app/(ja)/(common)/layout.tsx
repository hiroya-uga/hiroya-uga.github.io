import '@/app/(ja)/(common)/common.css';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className="px-[16px] sm:pl-10">
        <div className="max-w-content mx-auto">{children}</div>
      </main>

      <Footer />
    </>
  );
}
