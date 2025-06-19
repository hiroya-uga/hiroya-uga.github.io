import { TableDevSupporterContent } from '@/app/(ja)/(full-screen)/tools/markup-dev-supporter/Client';
import { getMetadata } from '@/utils/seo';

import styles from '@/app/(ja)/(full-screen)/tools/markup-dev-supporter/page.module.css';
import { SITE_NAME } from '@/constants/meta';
import clsx from 'clsx';
import Link from 'next/link';

export const metadata = getMetadata('/tools/markup-dev-supporter');

export default function Page() {
  return (
    <div className={clsx([styles.page, 'grid grid-cols-1 grid-rows-[auto,1fr,auto] bg-[#222] text-white '])}>
      <header className="flex items-center border-b border-black bg-[#333] text-xs leading-none text-[#9c9c9c] sm:gap-1 sm:px-2 sm:pr-[var(--navigation-width)] sm:pt-1px">
        <p>
          <Link href="../" className="grid size-8 place-items-center rounded-full sm:size-6">
            <svg
              role="img"
              aria-label="戻る"
              version="1.1"
              id="_x32_"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              className="size-3"
            >
              <g>
                <path
                  d="M469.672,213.675H145.324L275.68,84.727c16.623-16.438,16.767-43.253,0.329-59.866
		c-16.438-16.624-43.243-16.767-59.867-0.328L12.566,225.901C4.52,233.863,0,244.691,0,256.003c0,11.312,4.52,22.13,12.566,30.093
		l203.576,201.368c16.624,16.438,43.428,16.304,59.867-0.33c16.438-16.613,16.294-43.417-0.329-59.855L145.324,298.322h324.347
		c23.374,0,42.328-18.945,42.328-42.319C512,232.62,493.045,213.675,469.672,213.675z"
                  style={{ fill: 'rgb(156, 156, 156)' }}
                ></path>
              </g>
            </svg>
          </Link>
        </p>
        <h1 className="sm:pt-px">{metadata.pageTitle}</h1>
      </header>
      <main className="relative grid sm:pr-[var(--navigation-width)]">
        <TableDevSupporterContent />
      </main>
      <footer className="border-t border-black bg-[#333] px-2 pb-px text-center text-xs text-[#9c9c9c] sm:pr-[calc(var(--navigation-width)_+_0.75rem)] sm:text-right">
        <p>
          <small className="text-[100%]">
            &copy;{' '}
            <Link href="/" className="text-inherit">
              {SITE_NAME}
            </Link>
          </small>
        </p>
      </footer>
    </div>
  );
}
