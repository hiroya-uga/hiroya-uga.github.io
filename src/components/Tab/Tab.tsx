import { createContext, useCallback, useContext, useId, useMemo, useState } from 'react';

import clsx from 'clsx';

import styles from '@/components/Tab/Tab.module.css';

type Context = {
  readonly currentKey: string;
  readonly id: string;
};

const TabContext = createContext<Context>({
  currentKey: '',
  id: '',
});

type Props = {
  Wrapper: {
    defaultCurrentKey?: string;
    children: React.ReactElement[];
    onChange?: (_: string) => void;
  };
  Panel: {
    tabKey: string;
    children: React.ReactNode;
  };
};

export const Tab = {
  Wrapper: ({ children, onChange }: Props['Wrapper']) => {
    const id = useId();
    const tabKeys = useMemo(() => {
      return children
        .filter((item): item is React.ReactElement<Props['Panel']> => item.type === Tab.Panel)
        .map((item) => item.props.tabKey);
    }, [children]);

    const [currentKey, setCurrentKey] = useState(tabKeys[0]);
    const onkeydown = useCallback((e: React.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return;
      }

      const { currentTarget } = e;
      const current = (target: HTMLElement) => {
        e.preventDefault();
        target.click();
        target.focus();
      };

      switch (e.key) {
        case 'ArrowRight': {
          const target = currentTarget.nextElementSibling;
          if (target instanceof HTMLElement) {
            current(target);
            break;
          }
        }
        // eslint-disable-next-line no-fallthrough
        case 'Home': {
          const target = currentTarget.parentElement?.firstElementChild;
          if (target instanceof HTMLElement) {
            current(target);
          }
          break;
        }
        case 'ArrowLeft': {
          const target = currentTarget.previousElementSibling;
          if (target instanceof HTMLElement) {
            current(target);
            break;
          }
        }
        // eslint-disable-next-line no-fallthrough
        case 'End': {
          const target = currentTarget.parentElement?.lastElementChild;
          if (target instanceof HTMLElement) {
            current(target);
          }
          break;
        }
      }
    }, []);

    return (
      <TabContext.Provider value={{ currentKey, id }}>
        <div className={clsx(styles.root, 'bg-(--v-tab)')}>
          <div className="border-(--v-tab-border) border-b">
            <div
              role="tablist"
              className="relative top-px flex overflow-x-auto overflow-y-hidden whitespace-nowrap px-4"
            >
              {tabKeys.map((tabKey) => {
                const isSelected = currentKey === tabKey;
                const safeTabKey = tabKey.replace(/\s/g, '-');

                return (
                  <button
                    type="button"
                    className={clsx([
                      'not-first:border-l-0 border-(--v-tab-border) relative w-28 min-w-fit rounded-t-lg border px-2 py-0.5 transition-colors focus-visible:-outline-offset-2',
                      isSelected
                        ? 'border-b-(--v-tab) bg-(--v-tab) z-10 font-bold'
                        : 'border-b-(--v-tab-border) bg-(--v-tab-inactive) hover:bg-(--v-tab-hover)',
                    ])}
                    key={tabKey}
                    id={`${id}-tab-${safeTabKey}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => {
                      setCurrentKey(tabKey);
                      onChange?.(tabKey);
                    }}
                    onKeyDown={onkeydown}
                    role="tab"
                    aria-controls={`${id}-panel-${safeTabKey}`}
                    aria-selected={isSelected}
                  >
                    {tabKey}
                  </button>
                );
              })}
            </div>
          </div>
          {children}
        </div>
      </TabContext.Provider>
    );
  },
  Panel: ({ tabKey, children }: Props['Panel']) => {
    const { currentKey, id } = useContext(TabContext);
    const safeTabKey = tabKey.replace(/\s/g, '-');

    return (
      <div
        id={`${id}-panel-${safeTabKey}`}
        tabIndex={0}
        className="px-4 pt-8"
        hidden={currentKey !== tabKey}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${safeTabKey}`}
      >
        {children}
      </div>
    );
  },
};
