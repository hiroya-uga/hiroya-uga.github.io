import type { Dispatch, SetStateAction } from 'react';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import {
  DaysField,
  StartingField,
  TimeField,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/parts/fields';

type FormState = Pick<SlackReminder.FormState, 'days' | 'time' | 'starting'>;

type Props = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

export const DailyOrWeeklyPanel = ({ formState, setFormState }: Props) => (
  <>
    <DaysField values={formState.days} handleChange={(days) => setFormState((prev) => ({ ...prev, days }))} />
    <TimeField value={formState.time} handleChange={(time) => setFormState((prev) => ({ ...prev, time }))} />
    <StartingField
      value={formState.starting}
      handleChange={(starting) => setFormState((prev) => ({ ...prev, starting }))}
    />
  </>
);
