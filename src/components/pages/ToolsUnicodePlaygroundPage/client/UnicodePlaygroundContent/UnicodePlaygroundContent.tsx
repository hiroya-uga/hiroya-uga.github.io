'use client';

import { useId } from 'react';

import { CodeBlock } from '@/components/ui/embed/CodeBlock';
import { Switch, TextField } from '@/components/ui/forms';
import { Heading } from '@/components/ui/headings/Heading';

import { unicodePlaygroundLocales } from '@/components/pages/ToolsUnicodePlaygroundPage/locales';
import { defaultValue, unicodeSuggest, unicodeSuggestEn } from '@/components/pages/ToolsUnicodePlaygroundPage/settings';
import { RunButton } from '@/components/ui/buttons/RunButton';
import { NoteList } from '@/components/ui/lists/NoteList';
import { Lang } from '@/types/lang';
import { getStringMetrics, toHex } from '@/utils/unicode';
import { getCodepointName } from '../../utils';
import { useUnicodePlaygroundState } from './hooks';
import { StepViewer } from './parts';

interface Props {
  lang?: Lang;
}

export const UnicodePlaygroundContent = ({ lang = 'ja' }: Readonly<Props>) => {
  const t = unicodePlaygroundLocales[lang].content;
  const suggests = lang === 'en' ? unicodeSuggestEn : unicodeSuggest;

  const id = useId();
  const { value, stepIndex, setStepIndex, multiline, setMultiline, applyValue } =
    useUnicodePlaygroundState(defaultValue);

  const inputCodepoints = [...value];
  const totalSteps = inputCodepoints.length;
  const clampedStep = Math.min(stepIndex, Math.max(0, totalSteps - 1));
  const currentValue = inputCodepoints.slice(0, clampedStep + 1).join('');
  const addedChar = inputCodepoints[clampedStep] ?? '';
  const addedCodepoint = addedChar.codePointAt(0) ?? 0;
  const addedCodepointName = getCodepointName(addedCodepoint);
  const stepTitle =
    totalSteps > 0
      ? [
          t.stepTitle(clampedStep + 1, totalSteps, toHex(addedCodepoint)),
          addedCodepointName ? `(${addedCodepointName})` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : t.stepTitleEmpty;
  const stringCode = JSON.stringify(currentValue);
  const { utf16Length, utf8Bytes, codepointCount, graphemeCount } = getStringMetrics(currentValue, lang);

  const textFieldProps = multiline
    ? ({
        multiline,
        autoResize: true,
      } as const)
    : ({
        list: `${id}-datalist`,
        autoComplete: 'off',
      } as const);

  return (
    <div className="pb-12">
      <Heading level={2}>
        <label htmlFor={id}>{t.inputLabel}</label>
      </Heading>

      <TextField
        {...textFieldProps}
        id={id}
        value={value}
        onInput={(e) => {
          applyValue(e.currentTarget.value);
        }}
        onPaste={(e) => {
          const pastedText = e.clipboardData.getData('text');
          const hasNewline = pastedText.includes('\n') || pastedText.includes('\r');

          if (hasNewline) {
            e.preventDefault();
            const element = e.currentTarget;
            const cursorStart = element.selectionStart ?? element.value.length;
            const cursorEnd = element.selectionEnd ?? element.value.length;
            applyValue(element.value.slice(0, cursorStart) + pastedText + element.value.slice(cursorEnd));
          }
        }}
      />

      <p className="ml-auto mt-2 flex w-fit items-center gap-2 text-sm">
        <Switch
          id={`${id}-multiline`}
          checked={multiline}
          onChange={(e) => {
            const nextMultiline = e.currentTarget.checked;
            setMultiline(nextMultiline);
            if (!nextMultiline) {
              applyValue(value.replaceAll(/[\n\r]/g, ''));
            }
          }}
        />
        <label htmlFor={`${id}-multiline`}>{t.multilineLabel}</label>
      </p>

      <datalist id={`${id}-datalist`}>
        {suggests.map(({ label, value }) => (
          <option value={value} key={label}>
            {label}
          </option>
        ))}
      </datalist>

      {value !== value.normalize('NFC') && (
        <div className="mt-3.5">
          <NoteList list={[t.nfcNote]} />
          <p className="ml-auto mt-3.5 w-fit">
            <RunButton
              type="button"
              onClick={() => {
                applyValue(value.normalize('NFC'));
              }}
            >
              {t.normalizeButton}
            </RunButton>
          </p>
        </div>
      )}

      <Heading level={3}>{stepTitle}</Heading>

      <StepViewer
        lang={lang}
        inputCodepoints={inputCodepoints}
        clampedStep={clampedStep}
        currentValue={currentValue}
        utf16Length={utf16Length}
        utf8Bytes={utf8Bytes}
        codepointCount={codepointCount}
        graphemeCount={graphemeCount}
        onStepChange={setStepIndex}
        onChange={(newCodepoints) => {
          applyValue(newCodepoints.join(''));
        }}
      />

      {value && (
        <div className="mt-24">
          <CodeBlock
            title={t.codeBlockTitle}
            language="javascript"
            code={[
              `const string = ${stringCode};`,
              '',
              `console.log(string.length); // > ${utf16Length}`,
              `console.log(new TextEncoder().encode(string).length); // > ${utf8Bytes}`,
              `console.log([...string].length); // > ${codepointCount}`,
              `const segmenter = new Intl.Segmenter('${lang}', { granularity: 'grapheme' })`,
              `console.log([...segmenter.segment(string)].length); // > ${graphemeCount}`,
            ]
              .join('\n')
              .trim()}
            nowrap
            copyButton
          />
        </div>
      )}
    </div>
  );
};
