import '@/app/(specs)/common.css';
import { Footer } from '@/components/structures/Footer/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="py-8 sm:py-16 px-4 sm:pl-10 mb-4">
        <div className="max-w-[960px] mx-auto">
          <p>
            <a href="../">../</a>
          </p>
        </div>
      </header>

      <main className="px-4 sm:pl-10">
        <div className="max-w-[960px] mx-auto">{children}</div>
      </main>

      <Footer />
    </>
  );
}
