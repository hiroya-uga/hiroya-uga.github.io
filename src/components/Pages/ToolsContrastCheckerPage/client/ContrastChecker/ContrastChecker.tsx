'use client';

import clsx from 'clsx';
import { useDeferredValue, useId, useMemo } from 'react';

import { Lang } from '@/types/lang';

import { NoteList } from '@/components/List';
import { convertHexToRgb } from '@/utils/color';
import { useContrastColors } from './hooks';
import { contrastCheckerLocales } from './locales';
import { ColorInputSection, SuggestColorButton } from './parts';
import { calcContrastRatio, findAccessibleColor, getLuminance } from './utils';

const CRITERIA = [
  { key: 'aa-ui', min: 3 },
  { key: 'aa-large', min: 3 },
  { key: 'aa-normal', min: 4.5 },
  { key: 'aaa-large', min: 4.5 },
  { key: 'aaa-normal', min: 7 },
] as const;

type CriterionKey = (typeof CRITERIA)[number]['key'];

const i18n = contrastCheckerLocales;

export const ContrastChecker = ({ lang }: { lang: Lang }) => {
  const id = useId();

  const t = i18n[lang];
  const { foregroundColor, backgroundColor, updateForegroundColor, updateBackgroundColor } = useContrastColors();

  const foregroundRgb = convertHexToRgb(foregroundColor);
  const backgroundRgb = convertHexToRgb(backgroundColor);
  const ratio =
    foregroundRgb && backgroundRgb ? calcContrastRatio(getLuminance(foregroundRgb), getLuminance(backgroundRgb)) : null;

  const deferredForegroundColor = useDeferredValue(foregroundColor);
  const deferredBackgroundColor = useDeferredValue(backgroundColor);
  const suggestions = useMemo(() => {
    const deferredForegroundRgb = convertHexToRgb(deferredForegroundColor);
    const deferredBackgroundRgb = convertHexToRgb(deferredBackgroundColor);
    const deferredRatio =
      deferredForegroundRgb && deferredBackgroundRgb
        ? calcContrastRatio(getLuminance(deferredForegroundRgb), getLuminance(deferredBackgroundRgb))
        : null;

    const result: Partial<Record<CriterionKey, { fg: string | null; bg: string | null }>> = {};
    for (const { key, min } of CRITERIA) {
      if (deferredRatio !== null && deferredRatio < min) {
        result[key] = {
          fg: findAccessibleColor({
            hexColor: deferredForegroundColor,
            otherHex: deferredBackgroundColor,
            targetRatio: min,
          }),
          bg: findAccessibleColor({
            hexColor: deferredBackgroundColor,
            otherHex: deferredForegroundColor,
            targetRatio: min,
          }),
        };
      }
    }
    return result;
  }, [deferredForegroundColor, deferredBackgroundColor]);

  const contrastRatioLabelId = `${id}-contrast-ratio-label`;
  const foregroundInputId = `${id}-foreground-input`;
  const backgroundInputId = `${id}-background-input`;

  return (
    <>
      <div className="bg-secondary sticky top-0 z-10 mb-10 pt-3 text-center shadow-[0_0_20px_var(--background-color-secondary)]">
        <p className="text-sm font-bold" id={contrastRatioLabelId}>
          {t.contrastRatioLabel}
        </p>
        <output
          className="text-4xl font-bold tabular-nums"
          htmlFor={[foregroundInputId, backgroundInputId].join(' ')}
          aria-labelledby={contrastRatioLabelId}
        >
          {ratio === null ? '—' : `${ratio.toFixed(2)} : 1`}
        </output>
      </div>

      <ColorInputSection
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
        updateForegroundColor={updateForegroundColor}
        updateBackgroundColor={updateBackgroundColor}
        idList={{
          foreground: foregroundInputId,
          background: backgroundInputId,
        }}
        lang={lang}
      />

      <div className="mb-14">
        <div
          className="border-primary mb-6 rounded-lg border p-6 pt-4"
          style={{ backgroundColor: backgroundColor, color: foregroundColor }}
        >
          <p className="bg-primary text-primary border-primary pt-1px -ml-3 mb-2 w-fit rounded-md border px-3 text-sm font-bold">
            {t.previewLabel}
          </p>

          <p className="mb-6">{t.previewNormal}</p>
          <p className="mb-4 text-[1.1875rem] font-bold">{t.previewBoldLarge}</p>
          <p className="mb-6 text-2xl">{t.previewLarge}</p>

          <p>
            <span
              className="block w-fit rounded-md px-6 pb-2.5 pt-2"
              style={{ backgroundColor: foregroundColor, color: backgroundColor }}
            >
              Example
            </span>
          </p>
        </div>
      </div>

      <ColorInputSection
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
        updateForegroundColor={updateForegroundColor}
        updateBackgroundColor={updateBackgroundColor}
        lang={lang}
      />

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="mb-1 text-left text-sm font-bold">{t.criteriaTitle}</caption>
          <thead>
            <tr className="border-primary border-y text-xs font-bold">
              <th scope="col" className="py-2">
                {t.criteriaHeaderCriteria}
              </th>
              <th scope="col" className="px-4 py-2">
                {t.criteriaHeaderResult}
              </th>
              <th scope="col" className="py-2">
                {t.criteriaHeaderSuggest}
              </th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map(({ key, min }) => {
              const { label, threshold } = t.criteriaLabels[key];
              const pass = typeof ratio === 'number' ? ratio >= min : null;
              const suggestion = suggestions[key];

              return (
                <tr key={key} className="border-primary border-b last:border-0">
                  <td className="@w640:leading-31px @w640:pl-16PX pl-8PX @w640:text-sm @w360:w-[calc(20em+8px)] py-2 align-top text-xs">
                    {lang === 'ja' ? `${label}（${threshold}）` : `${label} (${threshold})`}
                  </td>

                  <td className="px-16PX @w360:w-[calc(4.5em+32px)] py-2 text-center align-middle">
                    {pass === null ? (
                      '—'
                    ) : (
                      <span
                        className={clsx(
                          'w-46px inline-block text-nowrap rounded px-2 py-0.5 text-center text-xs font-bold',
                          pass ? 'bg-success text-high-contrast' : 'bg-error text-high-contrast',
                        )}
                      >
                        {pass ? 'Pass' : 'Fail'}
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-center">
                    {suggestion ? (
                      <div className="@w640:gap-1 @w640:flex-wrap @w800:flex-row ml-auto flex w-fit flex-col items-end gap-2">
                        {suggestion.fg && (
                          <SuggestColorButton
                            suggestedColor={suggestion.fg}
                            label={t.fixFg}
                            title={t.fixDescription}
                            onApply={updateForegroundColor}
                          />
                        )}
                        {suggestion.bg && (
                          <SuggestColorButton
                            suggestedColor={suggestion.bg}
                            label={t.fixBg}
                            title={t.fixDescription}
                            onApply={updateBackgroundColor}
                          />
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NoteList list={[t.largeTextNote]} symbol={lang === 'ja' ? '※' : '*'} />
    </>
  );
};
