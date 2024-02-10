import { SITE_NAME, SITE_SUBTITLE } from '@/constants/meta';

export const SiteName = () => {
  return (
    <>
      {/* <p className="text-[0.78125rem] mb-4 lg:mb-0">
        <span className="font-mono block bg-white min-w-[29.2929vh] text-right px-2 lg:fixed lg:-rotate-90 lg:inline-block lg:py-1 lg:origin-top-right lg:right-full lg:top-0 lg:max-w-[100vh] lg:overflow-auto lg:whitespace-nowrap">
          <a href="/" className="text-[inherit]">
            {SITE_NAME}
          </a>{' '}
          - {SITE_SUBTITLE}
        </span>
      </p> */}

      <p className="text-[0.78125rem] mb-4 lg:mb-0 lg:fixed lg:top-0 lg:left-0 lg:overflow-auto lg:h-full">
        <span className="block overflow-auto lg:overflow-visible bg-white lg:w-[2rem] lg:min-w-[2rem] lg:min-h-[18.5rem] lg:h-[29.2929vh] lg:pb-4 lg:box-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="none presentation"
            className="ml-auto w-[18.5rem] min-w-[18.5rem] h-[1.465rem] lg:w-[2rem] lg:h-[18.5rem] lg:min-w-[2rem] lg:min-h-[18.5rem]"
          >
            <text x="58%" y="50%" textAnchor="middle" className="translate-y-[4px] lg:hidden">
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
              className="lg:!block border border-red-500"
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
