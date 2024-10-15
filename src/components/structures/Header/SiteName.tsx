import { SITE_NAME, SITE_SUBTITLE } from '@/constants/meta';

export const SiteName = () => {
  return (
    <>
      {/* <p className="text-[0.78125rem] mb-4 2xl:mb-0">
        <span className="font-mono block bg-white min-w-[29.2929vh] text-right px-2 2xl:fixed lg:-rotate-90 lg:inline-block lg:py-1 lg:origin-top-right lg:right-full lg:top-0 lg:max-w-[100vh] lg:overflow-auto lg:whitespace-nowrap">
          <a href="/" className="text-[inherit]">
            {SITE_NAME}
          </a>{' '}
          - {SITE_SUBTITLE}
        </span>
      </p> */}

      <p className="mb-4 bg-white py-1 text-[0.78125rem] lg:mb-0 2xl:fixed 2xl:left-0 2xl:top-0 2xl:mb-0 2xl:h-full 2xl:overflow-auto 2xl:bg-transparent 2xl:py-0">
        <span className="block overflow-auto bg-white 2xl:box-content 2xl:h-[29.2929vh] 2xl:min-h-[18.5rem] 2xl:w-8 2xl:min-w-8 2xl:overflow-visible 2xl:pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="none"
            className="ml-auto h-[1.465rem] w-[18.5rem] min-w-[18.5rem] 2xl:h-[18.5rem] 2xl:min-h-[18.5rem] 2xl:w-8 2xl:min-w-8"
          >
            <text x="58%" y="50%" textAnchor="middle" className="translate-y-[4px] 2xl:hidden">
              {/* bootstrapを読み込んでいる画面だとunderlineがつかない */}
              <a href="/" className="underline">
                {SITE_NAME}
              </a>
              <tspan> - {SITE_SUBTITLE}</tspan>
            </text>

            <text
              x="-750%"
              y="6.5%"
              textAnchor="start"
              style={{
                // bootstrapを読み込んでいる画面だと .hidden に display: none!imortant がついている
                // e.g. /documents/translations/pauljadam-modern-web-a11y-demos/bootstrap-dropdown/
                display: 'none',
              }}
              className="border border-red-500 2xl:!block"
              transform="rotate(-90)"
            >
              <a href="/" className="underline">
                {SITE_NAME}
              </a>
              <tspan> - {SITE_SUBTITLE}</tspan>
            </text>
          </svg>
        </span>
      </p>
    </>
  );
};
