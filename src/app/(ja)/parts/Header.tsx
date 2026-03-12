import { ThemeSwitch } from '@/components/structures/ThemeSwitch';

interface Props {
  pageTitle: string;
}

export const Header = ({ pageTitle }: Props) => {
  return (
    <header className="@container">
      <div className="@w1024:pb-60px @w1024:pt-14 px-4 pb-12 pt-20">
        <div className="max-w-content mx-auto">
          <div className="@w1024:mb-2 @w1024:flex items-center text-center">
            <h1 className="@w640:text-2xl @w640:leading-8 @w1024:mb-0 mb-3 text-xl font-bold leading-none">
              {pageTitle}
            </h1>
            <p className="text-xs">
              <span className="@w1024:inline hidden px-2">-</span>
              <span>
                Web標準とアクセシビリティの話が好きな、
                <span className="inline-block">大器晩成型のフロントエンドエンジニアの物置。</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="@w640:fixed @w640:pt-2 @w640:pr-2 absolute right-2 top-2 z-50 w-fit">
        <ThemeSwitch />
      </p>
    </header>
  );
};
