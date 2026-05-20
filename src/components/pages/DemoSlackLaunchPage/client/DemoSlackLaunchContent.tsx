'use client';

import { SITE_NAME } from '@/constants/meta';
import clsx from 'clsx';
import { useId, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import styles from './DemoSlackLaunchContent.module.css';

export const DemoSlackLaunchContent = () => {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const searchParams = useSearchParams();
  const title = searchParams.get('t1') ?? 'Launching...';
  const title2 = searchParams.get('t2') ?? 'Oops!';

  return (
    <>
      <div
        className={clsx([
          'text-10px before:transition-fade relative grid place-items-center text-center transition-[min-height]',
          expanded
            ? 'animate-fade-in min-h-100px before:invisible before:opacity-0'
            : 'mt-80px min-h-160px before:size-48px text-white before:absolute before:inset-0 before:m-auto before:rounded-[clamp(4px,min(22.222%,12px),12px)] before:bg-white before:shadow-[inset_0_0_0_1px_#00000014]',
        ])}
      >
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 100 100" className={styles.circle} fill="none" strokeWidth="4">
            <circle cx="50" cy="50" r="35" stroke="#1d1c1d" opacity="0.25" />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#1264a3"
              strokeLinecap="round"
              strokeDasharray="55 200"
              strokeDashoffset="90"
            />
          </svg>
          <svg viewBox="0 0 100 100" className={clsx(styles.circle, styles.tail)} fill="none" strokeWidth="4">
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#1264a3"
              strokeLinecap="round"
              strokeDasharray="55 200"
              strokeDashoffset="90"
            />
          </svg>
        </span>
        <div>
          <p>{`これは${SITE_NAME}によるセキュリティ啓発用デモです。`}</p>
          <p>検索エンジンに載らないよう noindex などの検索避けもしています。</p>
        </div>
      </div>

      <div className="max-w-150 mx-auto text-center">
        {expanded === false && (
          <>
            <p className="relative m-0 text-[42px] font-black leading-[1.2143] text-[#1d1c1d]">
              <span className={styles.title}>{title}</span>
              <span className={styles.oops}>{title2}</span>
            </p>

            <div className="mt-16PX mb-24PX text-18px relative leading-[1.50001] text-[rgb(29_28_29/0.7)]">
              <p className={styles.status1}>Dredging pipes...</p>
              <p className={styles.status2}>Boiling water...</p>
              <p className={styles.status3}>Tuning channels...</p>
              <p className={styles.status4}>
                Click &quot;<b>Open Slack</b>&quot; to launch the desktop app.
                <br />
                Not working? You can also{' '}
                <button
                  type="button"
                  className="cursor-pointer bg-transparent p-0 font-[inherit] text-[#1264a3] no-underline hover:underline focus-visible:underline"
                  onClick={() => {
                    setExpanded(true);
                  }}
                  aria-expanded={expanded}
                  aria-controls={id}
                >
                  use Slack in your browser
                </button>
                .
              </p>
            </div>
          </>
        )}

        <div id={id} role="alert" className="contain-paint">
          {expanded && (
            <div className="mt-32PX max-w-600px px-28PX py-24PX mx-auto mb-[20vh] w-full rounded-lg border-2 border-[#e8912d] bg-[#fff7e6] text-left text-[15px] leading-relaxed text-[#1d1c1d]">
              <h2 className="mb-12PX mt-0 text-lg font-bold text-[#b45309]">これはセキュリティ啓発用のデモです</h2>

              <p>フィッシング攻撃を模した学習用デモです。</p>
              <p>本デモで使用している Slack ロゴ・ファビコン等の権利は Slack Technologies, LLC に帰属します。</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
