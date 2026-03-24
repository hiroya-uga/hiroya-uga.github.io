import { useCallback, useEffect, useMemo, useRef } from 'react';

interface Params {
  mimeType?: 'text/plain' | 'text/html';
}

type PlainCopyButtonHandler = (value: string, buttonLabel: HTMLElement) => Promise<void>;
type HtmlCopyButtonHandler = (value: { text: string; html: string }, buttonLabel: HTMLElement) => Promise<void>;

export function useCopyButton(): { handleClickCopyButton: PlainCopyButtonHandler };
export function useCopyButton(params: { mimeType?: 'text/plain' }): { handleClickCopyButton: PlainCopyButtonHandler };
export function useCopyButton(params: { mimeType: 'text/html' }): { handleClickCopyButton: HtmlCopyButtonHandler };
export function useCopyButton({ mimeType = 'text/plain' }: Params = {}) {
  const settimeoutIdRef = useRef(-1);

  const write = useCallback(async (buttonLabel: HTMLElement, write: () => Promise<void>) => {
    if (buttonLabel.textContent === 'Copied!') {
      return;
    }
    clearTimeout(settimeoutIdRef.current);

    try {
      await write();
      buttonLabel.textContent = 'Copied!';
    } catch {
      buttonLabel.textContent = 'Error!';
    }

    settimeoutIdRef.current = globalThis.window.setTimeout(() => {
      buttonLabel.textContent = 'Copy';
    }, 2000);
  }, []);

  const handleClickCopyButton = useMemo(() => {
    switch (mimeType) {
      case 'text/html':
        return ((value: { text: string; html: string }, buttonLabel: HTMLElement) => {
          return write(buttonLabel, () => {
            const clipboardItem = new ClipboardItem({
              'text/plain': new Blob([value.text], { type: 'text/plain' }),
              'text/html': new Blob([value.html], { type: 'text/html' }),
            });
            return navigator.clipboard.write([clipboardItem]);
          });
        }) satisfies HtmlCopyButtonHandler;

      default:
        return ((value: string, buttonLabel: HTMLElement) => {
          return write(buttonLabel, () => {
            return navigator.clipboard.writeText(value);
          });
        }) satisfies PlainCopyButtonHandler;
    }
  }, [mimeType]);

  useEffect(() => {
    return () => {
      clearTimeout(settimeoutIdRef.current);
    };
  }, []);

  return { handleClickCopyButton };
}
