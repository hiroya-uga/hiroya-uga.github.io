import { SITE_NAME, SITE_SUBTITLE } from '@/constants/meta';

export const Header = () => {
  // Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう
  return (
    <header>
      <p className="text-[0.78125rem] mb-4 lg:mb-0">
        <span className="font-mono block bg-white min-w-[29.2929vh] text-right px-2 lg:fixed lg:-rotate-90 lg:inline-block lg:py-1 lg:origin-top-right lg:right-full lg:top-0 lg:max-w-[100vh] lg:overflow-auto lg:whitespace-nowrap">
          <a href="/" className="text-[inherit]">
            {SITE_NAME}
          </a>{' '}
          - {SITE_SUBTITLE}
        </span>
      </p>

      <div className="py-8 sm:py-16 px-4 sm:pl-10">
        <div className="max-w-content mx-auto relative">
          <p className="relative -left-4 -top-2">
            <a
              href="../"
              className="group rounded-md inline-block py-2 px-4 no-underline sm:hover:bg-white sm:focus:bg-white sm:transition-colors sm:delay-0 sm:duration-300"
            >
              <span className="underline">../</span>
              <span className="sm:opacity-0 sm:delay-0 sm:duration-300 sm:transition-opacity ml-4 group-focus:opacity-100 group-hover:opacity-100">
                １つ上のページへ戻る
              </span>
            </a>
          </p>
        </div>
      </div>
    </header>
  );
};
