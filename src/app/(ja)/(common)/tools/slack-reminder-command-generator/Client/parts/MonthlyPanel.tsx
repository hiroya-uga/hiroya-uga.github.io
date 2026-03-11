import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import {
  DayField,
  StartingField,
  TimeField,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/parts/fields';
import { Radio } from '@/components/Form';
import type { Dispatch, SetStateAction } from 'react';

type FormState = Pick<SlackReminder.FormState, 'day' | 'time' | 'starting' | 'monthState'>;

const ordinalOptions: { value: SlackReminder.MonthState['nth']; label: string }[] = [
  { value: 'first', label: '第1' },
  { value: 'second', label: '第2' },
  { value: 'third', label: '第3' },
  { value: 'fourth', label: '第4' },
  { value: 'last', label: '最終' },
];

type OrdinalRadiosProps = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

const OrdinalRadios = ({ formState, setFormState }: OrdinalRadiosProps) => (
  <>
    <fieldset className="mb-10">
      <legend className="mb-2 text-sm font-bold leading-snug">序数</legend>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {ordinalOptions.map(({ value, label }) => (
          <li key={value}>
            <Radio
              label={label}
              checked={formState.monthState.nth === value}
              name="nth"
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  setFormState((prev) => ({
                    ...prev,
                    monthState: { ...prev.monthState, nth: value },
                  }));
                }
              }}
            />
          </li>
        ))}
      </ul>
    </fieldset>
    <DayField value={formState.day} handleChange={(day) => setFormState((prev) => ({ ...prev, day }))} />
  </>
);

type FixedDayInputProps = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

const FixedDayInput = ({ formState, setFormState }: FixedDayInputProps) => (
  <>
    <p className="mb-1 text-sm font-bold leading-snug">毎月</p>
    <p className="outline-hidden has-focus-visible:outline-black mb-10 flex w-fit items-center gap-1 rounded-md border border-gray-300 px-2 py-1 outline-2">
      <input
        type="number"
        min={1}
        max={31}
        id="month-day"
        value={formState.monthState.day}
        className="focus-visible:outline-hidden box-content w-[2ch] px-0.5 py-1 text-center"
        onInput={(e) => {
          setFormState((prev) => ({
            ...prev,
            monthState: { ...prev.monthState, day: `${Number((e.target as HTMLInputElement).value) || '1'}` },
          }));
        }}
      />
      <label htmlFor="month-day" className="pt-0.5 text-xs leading-none">
        日
      </label>
    </p>
  </>
);

type MonthTypeRadiosProps = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

const monthTypeOptions: { value: SlackReminder.MonthState['type']; label: string }[] = [
  { value: 'fixed', label: '固定日' },
  { value: 'nth', label: '序数表現（e.g. 第3土曜日）' },
  { value: 'last', label: '月末' },
];

const MonthTypeRadios = ({ formState, setFormState }: MonthTypeRadiosProps) => (
  <fieldset className="mb-10">
    <legend className="mb-2 text-sm font-bold leading-snug">パターン</legend>
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {monthTypeOptions.map(({ value, label }) => (
        <li key={value}>
          <Radio
            label={label}
            checked={formState.monthState.type === value}
            name="month-type"
            onChange={(e) => {
              if (e.currentTarget.checked) {
                setFormState((prev) => ({
                  ...prev,
                  monthState: { ...prev.monthState, type: value },
                }));
              }
            }}
          />
        </li>
      ))}
    </ul>
  </fieldset>
);

type Props = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

export const MonthlyPanel = ({ formState, setFormState }: Props) => {
  const { type } = formState.monthState;

  return (
    <>
      <MonthTypeRadios formState={formState} setFormState={setFormState} />
      {type === 'fixed' && <FixedDayInput formState={formState} setFormState={setFormState} />}
      {type === 'nth' && <OrdinalRadios formState={formState} setFormState={setFormState} />}
      <TimeField value={formState.time} handleChange={(time) => setFormState((prev) => ({ ...prev, time }))} />
      <StartingField
        value={formState.starting}
        handleChange={(starting) => setFormState((prev) => ({ ...prev, starting }))}
      />
    </>
  );
};
