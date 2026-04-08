import { Lang } from '@/types/lang';
import { useId } from 'react';
import { contrastCheckerLocales } from '../locales';
import { ColorInput } from './ColorInput';

const i18n = contrastCheckerLocales;

interface Props {
  foregroundColor: string;
  backgroundColor: string;
  updateForegroundColor: (hex: string) => void;
  updateBackgroundColor: (hex: string) => void;
  idList?: {
    foreground: string;
    background: string;
  };
  lang: Lang;
}

export const ColorInputSection = ({
  foregroundColor,
  backgroundColor,
  updateForegroundColor,
  updateBackgroundColor,
  idList,
  lang,
}: Props) => {
  const id = useId();
  const t = i18n[lang];

  return (
    <div className="@w640:grid @w640:grid-cols-[1fr_auto_1fr] @w640:items-end @w640:gap-4 mb-14">
      <div className="@w640:mb-0 mb-6">
        <ColorInput
          id={idList?.foreground ?? `${id}-foreground`}
          label={t.fgLabel}
          value={foregroundColor}
          handleChange={updateForegroundColor}
        />
      </div>

      <p className="@w640:pb-[0.3125rem] grid place-items-center">
        <button
          type="button"
          className="border-primary bg-panel-primary hover:bg-panel-primary-hover transition-bg grid h-10 w-10 place-items-center rounded-full border"
          onClick={() => {
            updateForegroundColor(backgroundColor);
            updateBackgroundColor(foregroundColor);
          }}
        >
          <svg
            role="img"
            aria-label={t.swapLabel}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="block size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 16V4m0 0L3 8m4-4 4 4" className="@w640:hidden" />
            <path d="M17 8v12m0 0 4-4m-4 4-4-4" className="@w640:hidden" />

            <path d="M4 8H20m-4-4 4 4-4 4" className="@w640:block hidden" />
            <path d="M20 16H4m4-4-4 4 4 4" className="@w640:block hidden" />
          </svg>
        </button>
      </p>

      <div>
        <ColorInput
          id={idList?.background ?? `${id}-background`}
          label={t.bgLabel}
          value={backgroundColor}
          handleChange={updateBackgroundColor}
        />
      </div>
    </div>
  );
};
