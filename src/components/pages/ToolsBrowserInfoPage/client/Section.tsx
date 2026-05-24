import clsx from 'clsx';

interface Props {
  title: string;
  children: React.ReactNode;
  refresh?: { label: string; onClick: () => void };
}

export const Section = ({ title, children, refresh }: Readonly<Props>) => {
  const hasRefresh = refresh !== undefined;

  return (
    <>
      <div
        className={clsx([
          'text-high-contrast mt-[2lh] text-center font-bold',
          hasRefresh ? 'mb-1.5' : 'mb-paragraph',

          'w640:m-0 w640:border-x w640:border-secondary w640:bg-slate-200 dark:w640:bg-slate-800 w640:text-sm w640:py-2 w640:font-sans w640:leading-normal w640:border-t',

          hasRefresh && 'w640:grid w640:items-center grid-cols-3',
        ])}
      >
        <h2 className={clsx(['pr-[0.5em]', hasRefresh && 'w640:col-start-2'])}>{title}</h2>
        {hasRefresh && (
          <div className="flex justify-end pr-2">
            <button
              type="button"
              onClick={refresh.onClick}
              className="border-secondary px-12PX bg-panel-primary hover:bg-panel-primary-hover rounded border py-1 text-xs font-normal before:content-['↻_']"
            >
              {refresh.label}
            </button>
          </div>
        )}
      </div>
      <dl
        className={clsx([
          'text-high-contrast grid grid-cols-1 gap-y-4 text-sm',
          'w640:grid-cols-[25em_1fr] w640:gap-y-0',
          'w640:border-secondary w640:border-x w640:border-t w640:last-of-type:border-b',
        ])}
      >
        {children}
      </dl>
    </>
  );
};
