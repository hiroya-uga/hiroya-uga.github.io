import type { Dispatch, SetStateAction } from 'react';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import {
  FullDateField,
  TimeField,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/parts/fields';
import { NoteBox } from '@/components/Box';

type FormState = Pick<SlackReminder.FormState, 'fullDate' | 'time'>;

type Props = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<SlackReminder.FormState>>;
};

export const OnetimePanel = ({ formState, setFormState }: Props) => (
  <>
    <FullDateField
      value={formState.fullDate}
      handleChange={(fullDate) => setFormState((prev) => ({ ...prev, fullDate }))}
    />
    <TimeField value={formState.time} handleChange={(time) => setFormState((prev) => ({ ...prev, time }))} />
    <NoteBox title="手書きの際、こんな相対表現も使えます">
      <dl>
        <div className="@w640:flex @w640:gap-2">
          <dt>次の金曜日</dt>
          <dd className='before:mr-2 before:content-["-"]'>
            <code>next Friday</code>
          </dd>
        </div>
        <div className="@w640:flex @w640:gap-2">
          <dt>30分後</dt>
          <dd className='before:mr-2 before:content-["-"]'>
            <code>in 30 minutes </code>
          </dd>
        </div>
        <div className="@w640:flex @w640:gap-2">
          <dt>今月の最終日</dt>
          <dd className='before:mr-2 before:content-["-"]'>
            <code>on the last day of this month</code>
          </dd>
        </div>
      </dl>
    </NoteBox>
  </>
);
