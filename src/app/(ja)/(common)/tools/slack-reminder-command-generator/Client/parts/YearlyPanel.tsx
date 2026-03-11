import type { Dispatch, SetStateAction } from 'react';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import {
  DateField,
  StartingField,
  TimeField,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/parts/fields';

type FormState = Pick<SlackReminder.FormState, 'date' | 'starting' | 'time'>;

type Props = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

export const YearlyPanel = ({ formState, setFormState }: Props) => (
  <>
    <DateField values={formState.date} handleChange={(date) => setFormState((prev) => ({ ...prev, date }))} />
    <StartingField
      value={formState.starting}
      handleChange={(starting) => setFormState((prev) => ({ ...prev, starting }))}
    />
    <TimeField value={formState.time} handleChange={(time) => setFormState((prev) => ({ ...prev, time }))} />
  </>
);
