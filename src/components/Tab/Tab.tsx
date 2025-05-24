import clsx from 'clsx';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

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
    onChange?: (currentKey: string) => void;
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
        <div className="bg-white">
          <div className="border-b border-gray-300">
            <div
              role="tablist"
              className="relative top-px flex overflow-x-auto overflow-y-hidden whitespace-nowrap px-4"
            >
              {tabKeys.map((tabKey) => {
                const isSelected = currentKey === tabKey;

                return (
                  <button
                    type="button"
                    className={clsx([
                      'relative min-w-28 rounded-t-lg border border-gray-300 px-2 py-0.5 focus-visible:[outline-offset:-2px] [&:not(:first-child)]:border-l-0',
                      isSelected ? 'z-10 border-b-white bg-white font-bold' : 'border-b-gray-300 bg-gray-100',
                    ])}
                    key={tabKey}
                    id={`${id}-tab-${tabKey}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => {
                      setCurrentKey(tabKey);
                      onChange?.(tabKey);
                    }}
                    onKeyDown={onkeydown}
                    role="tab"
                    aria-controls={`${id}-panel-${tabKey}`}
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

    return (
      <div
        id={`${id}-panel-${tabKey}`}
        tabIndex={0}
        className="px-4 pt-8"
        hidden={currentKey !== tabKey}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${tabKey}`}
      >
        {children}
      </div>
    );
  },
};
