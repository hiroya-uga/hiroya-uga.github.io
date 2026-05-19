'use client';

import clsx from 'clsx';

import { unicodePlaygroundLocales } from '@/components/pages/ToolsUnicodePlaygroundPage/locales';
import { getCodepointMeta } from '@/components/pages/ToolsUnicodePlaygroundPage/utils';
import { Confirm } from '@/components/ui/dialogs/Confirm';
import { useConfirm } from '@/components/ui/dialogs/Confirm/hooks';
import { PromptModal, usePrompt } from '@/components/ui/dialogs/PromptModal';
import { Lang } from '@/types/lang';
import { decodeUnicodeEscapes, toHex } from '@/utils/unicode';
import { StringStatus } from './StringStatus';

interface Props {
  inputCodepoints: string[];
  clampedStep: number;
  currentValue: string;
  utf16Length: number;
  utf8Bytes: number;
  codepointCount: number;
  graphemeCount: number;
  onStepChange: (index: number) => void;
  onChange: (codepoints: string[]) => void;
  lang: Lang;
}

export const StepViewer = ({
  inputCodepoints,
  clampedStep,
  currentValue,
  utf16Length,
  utf8Bytes,
  codepointCount,
  graphemeCount,
  onStepChange,
  onChange,
  lang,
}: Readonly<Props>) => {
  const t = unicodePlaygroundLocales[lang].stepViewer;
  const tList = unicodePlaygroundLocales[lang].codepointList;
  const totalSteps = inputCodepoints.length;
  const currentStepCodepoint = inputCodepoints[clampedStep]?.codePointAt(0) ?? 0;
  const { confirmData, setConfirmData } = useConfirm();
  const { promptData, setPromptData } = usePrompt();
  const currentStepMeta = totalSteps > 0 ? getCodepointMeta(currentStepCodepoint, lang) : undefined;

  const handleReplace = ({ index, codePoint }: { index: number; codePoint: number }) => {
    setPromptData({
      message: tList.replaceMessage,
      description: tList.replaceDescription,
      yesLabel: tList.replaceConfirmLabel,
      noLabel: tList.cancelLabel,
      defaultValue:
        codePoint > 0xffff
          ? `\\u{${codePoint.toString(16).toUpperCase()}}`
          : `\\u${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      yes: (input) => {
        const newChars = [...decodeUnicodeEscapes(input)];
        if (newChars.length === 0) {
          return;
        }
        const newCodepoints = [...inputCodepoints];
        newCodepoints.splice(index, 1, ...newChars);
        onChange(newCodepoints);
        onStepChange(index);
      },
    });
  };

  const handleDelete = (index: number) => {
    const codepoint = inputCodepoints[index]?.codePointAt(0) ?? 0;
    setConfirmData({
      message: tList.deleteConfirm(toHex(codepoint)),
      yesLabel: tList.deleteConfirmLabel,
      noLabel: tList.cancelLabel,
      yes: () => {
        const newCodepoints = [...inputCodepoints];
        newCodepoints.splice(index, 1);
        onChange(newCodepoints);
        onStepChange(Math.min(clampedStep, Math.max(0, newCodepoints.length - 1)));
      },
      no: () => {},
    });
  };

  return (
    <>
      <div className="border-primary bg-secondary mt-3.5 flex items-center justify-center rounded-xl border px-6 py-8 text-center">
        <p
          aria-live="polite"
          className="font-emoji min-h-lh @w640:text-8xl whitespace-pre-line break-all text-7xl leading-tight"
        >
          {totalSteps > 0 && (
            <>
              <span className="sr-only">{t.readAloud(clampedStep + 1, totalSteps)}</span>
              {currentValue}
            </>
          )}
        </p>
      </div>

      <div className="mt-4">
        <StringStatus
          utf16Length={utf16Length}
          utf8Bytes={utf8Bytes}
          codepointCount={codepointCount}
          graphemeCount={graphemeCount}
          lang={lang}
        />
      </div>

      <div>
        <ul className="@w640:gap-x-19PX gap-x-33PX @w640:justify-start mt-12 flex flex-wrap justify-start gap-y-1.5">
          {inputCodepoints.map((char, index) => {
            const codePoint = char.codePointAt(0) ?? 0;
            const hex = toHex(codePoint);
            const { name, categoryLabel, className, noGlyph } = getCodepointMeta(codePoint, lang);
            const row3Label = noGlyph ? categoryLabel : name;
            const isCurrentStep = index === clampedStep;
            const handleEdit = () => handleReplace({ index, codePoint });

            return (
              <li key={`${index}-${codePoint}`} className="group flex flex-col gap-1.5">
                <div className="after:w-33PX @w640:after:w-19PX @w640:after:text-[11px] relative flex grow after:absolute after:bottom-0 after:left-full after:top-0 after:my-auto after:grid after:place-items-center after:text-[17px] after:content-['+'] group-last:after:hidden">
                  <button
                    type="button"
                    aria-label={t.stepAria(index + 1, hex)}
                    aria-pressed={isCurrentStep}
                    onClick={() => onStepChange(index)}
                    onDoubleClick={handleEdit}
                    className={clsx([
                      'min-w-80px px-8PX flex w-min grow flex-col items-center rounded-lg border border-dashed py-2 font-mono text-xs hover:border-solid hover:border-current',
                      isCurrentStep && 'ring-2 ring-indigo-500 ring-offset-1',
                      className,
                    ])}
                  >
                    {noGlyph ? (
                      <span className="min-h-lh mb-1 grid min-w-[1ic] place-items-center font-mono text-2xl leading-none">
                        <span className="text-2xs border border-dotted border-current p-1.5">{name}</span>
                      </span>
                    ) : (
                      <span className="font-emoji min-h-lh mb-1 min-w-[1ic] text-2xl leading-none">{char}</span>
                    )}
                    <span className="text-[0.7rem] font-bold">{toHex(codePoint)}</span>
                    <span className="text-secondary mt-0.5 text-center text-[0.65rem]">{row3Label}</span>
                  </button>
                </div>

                <button
                  type="button"
                  aria-label={tList.editAria(hex)}
                  tabIndex={isCurrentStep ? undefined : -1}
                  className={clsx([
                    'bg-panel-primary transition-bg border-primary hover:bg-panel-primary-hover mt-1 w-full rounded border px-1.5 py-0.5 text-xs font-bold',
                    isCurrentStep ? 'visible' : 'invisible',
                  ])}
                  onClick={handleEdit}
                >
                  {tList.editLabel}
                </button>

                <button
                  type="button"
                  aria-label={tList.deleteAria(hex)}
                  tabIndex={isCurrentStep ? undefined : -1}
                  className={clsx([
                    'bg-panel-primary transition-bg border-primary hover:bg-panel-primary-hover w-full rounded border px-1.5 py-0.5 text-xs font-bold',
                    isCurrentStep ? 'visible' : 'invisible',
                  ])}
                  onClick={() => handleDelete(index)}
                >
                  {tList.deleteLabel}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="shadow-sticky sticky bottom-4 mt-6">
          {currentStepMeta !== undefined && (
            <section className="border-primary px-12PX scroll-hint-y max-h-[20vh] overflow-auto rounded-lg border py-3">
              <h3 className="mb-2 text-sm font-bold">{`💡 ${currentStepMeta.noteSubject} (${toHex(currentStepCodepoint)})`}</h3>
              <div className="text-xs">
                <p aria-live="polite">{currentStepMeta.note}</p>
              </div>
            </section>
          )}

          {totalSteps > 1 && (
            <div
              role="group"
              aria-label={t.navLabel}
              className="mx-auto mt-4 flex w-fit flex-wrap justify-center gap-x-1 gap-y-2"
            >
              <p className="bg-primary rounded-full">
                <button
                  type="button"
                  className="bg-secondary px-8PX grid aspect-square shrink-0 place-items-center rounded-full border-2 text-sm font-bold disabled:opacity-40"
                  onClick={() => onStepChange(clampedStep - 1)}
                  disabled={clampedStep === 0}
                >
                  Prev
                </button>
              </p>
              <p className="text-secondary bg-primary grid place-items-center rounded-md px-1 text-sm">
                <span>
                  {clampedStep + 1} / {totalSteps}
                </span>
              </p>
              <p className="bg-primary rounded-full">
                <button
                  type="button"
                  className="bg-secondary px-8PX grid aspect-square shrink-0 place-items-center rounded-full border-2 text-sm font-bold disabled:opacity-40"
                  onClick={() => onStepChange(clampedStep + 1)}
                  disabled={clampedStep === totalSteps - 1}
                >
                  Next
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <Confirm confirm={confirmData} setConfirmData={setConfirmData} />
      <PromptModal prompt={promptData} setPromptData={setPromptData} />
    </>
  );
};
