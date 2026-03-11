import type { Dispatch, SetStateAction } from 'react';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import {
  DayField,
  StartingField,
  TimeField,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/parts/fields';

type FormState = Pick<SlackReminder.FormState, 'day' | 'time' | 'starting'>;

type Props = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

export const BiweeklyPanel = ({ formState, setFormState }: Props) => (
  <>
    <DayField value={formState.day} handleChange={(day) => setFormState((prev) => ({ ...prev, day }))} />
    <TimeField value={formState.time} handleChange={(time) => setFormState((prev) => ({ ...prev, time }))} />
    <StartingField
      value={formState.starting}
      handleChange={(starting) => setFormState((prev) => ({ ...prev, starting }))}
    />
  </>
);
