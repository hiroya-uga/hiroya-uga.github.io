import { SITE_NAME, SITE_SUBTITLE } from '@/constants/meta';
import Link from 'next/link';

export const SiteName = () => {
  const siteName = (
    <Link
      href="/"
      /* bootstrapを読み込んでいる画面だとunderlineがつかない */
      className="focus-visible:focus-ring underline"
      style={
        {
          '--v-outline-color': 'var(--v-color-text-high-contrast)',
          '--v-outline-offset': '0',
        } as React.CSSProperties
      }
    >
      {SITE_NAME}
    </Link>
  );
  return (
    <>
      {/* <p className="text-[0.78125rem] mb-4 @w1520:mb-0">
        <span className="font-mono block bg-white min-w-[29.2929vh] text-right px-2 @w1520:fixed lg:-rotate-90 lg:inline-block lg:py-1 lg:origin-top-right lg:right-full lg:top-0 lg:max-w-[100vh] lg:overflow-auto lg:whitespace-nowrap">
          <a href="/" className="text-inherit">
            {SITE_NAME}
          </a>{' '}
          - {SITE_SUBTITLE}
        </span>
      </p> */}

      <p className="@w500:text-[0.78125rem] @w1520:fixed @w1520:left-0 @w1520:top-0 @w1520:mb-0 @w1520:overflow-auto @w1520:bg-transparent @w1520:py-0 mb-2 bg-[var(--v-color-background-header)] py-1 text-[12.5px]">
        <span className="@w1520:min-h-296px @w1520:box-content @w1520:h-[29.2929vh] @w1520:w-8 @w1520:min-w-8 @w1520:overflow-visible @w1520:pb-4 block overflow-auto bg-[var(--v-color-background-header)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="none"
            className="@w1520:h-296px @w1520:min-h-296px w500:w-60 @w1520:w-8 @w1520:min-w-8 ml-auto h-[1.465rem] max-h-full w-[240px] max-w-full overflow-visible [fill:var(--v-color-text-primary)]"
          >
            <text x="0" y="50%" textAnchor="start" className="@w1520:hidden translate-y-[4px]">
              {siteName}
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
              className="@w1520:block! border border-red-500"
              transform="rotate(-90)"
            >
              {siteName}
              <tspan> - {SITE_SUBTITLE}</tspan>
            </text>
          </svg>
        </span>
      </p>
    </>
  );
};
