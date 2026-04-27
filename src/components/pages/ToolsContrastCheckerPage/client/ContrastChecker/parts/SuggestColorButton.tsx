import clsx from 'clsx';
import { CSSProperties } from 'react';

interface Props {
  suggestedColor: string;
  label: string;
  title: string;
  onApply: (color: string) => void;
}

export const SuggestColorButton = ({ suggestedColor, label, title, onApply }: Readonly<Props>) => (
  <button
    type="button"
    onClick={() => onApply(suggestedColor)}
    className={clsx([
      'border-primary @w800:w-auto bg-panel-primary hover:bg-panel-primary-hover transition-bg @w800:leading-24px text-2xs @w640:text-xs flex w-full items-center gap-1.5 rounded-full border px-2 py-0.5',
      'before:border-primary before:bg-(--_background) before:block before:h-3 before:w-3 before:shrink-0 before:rounded-sm before:border',
    ])}
    title={title}
    style={{ '--_background': suggestedColor } as CSSProperties}
  >
    <span>
      {`${label}: `}
      <span className="font-mono">{suggestedColor}</span>
    </span>
  </button>
);
