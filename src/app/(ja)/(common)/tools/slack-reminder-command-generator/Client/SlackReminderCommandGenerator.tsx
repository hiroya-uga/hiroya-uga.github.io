'use client';

import { useState } from 'react';

import { TextField } from '@/components/Form';
import { Tab } from '@/components/Tab';

import {
  everyTypeName,
  type SlackReminder,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { useBeforeUnload } from '@/hooks/use-before-unload';
import { BiweeklyPanel, DailyOrWeeklyPanel, MonthlyPanel, OnetimePanel, PreviewAndResult, YearlyPanel } from './parts';

const getInitialFormState = (): SlackReminder.FormState => {
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  return {
    type: everyTypeName.DAILY_OR_WEEKLY,
    who: '',
    message: '',
    time: `${today.getHours().toString().padStart(2, '0')}:00`,
    date: [`${tomorrow.getMonth() + 1}`, `${tomorrow.getDate()}`],
    fullDate: tomorrow.toISOString().split('T')[0],
    day: 0,
    days: [false, false, false, false, false, false, false],
    starting: '',
    monthState: { type: 'fixed', nth: 'first', day: '1' },
  };
};

const formatTabKeyValue = (key: string): SlackReminder.Type => {
  if (Object.values(everyTypeName).includes(key as SlackReminder.Type)) {
    return key as SlackReminder.Type;
  }
  return everyTypeName.DAILY_OR_WEEKLY;
};

export const SlackReminderCommandGenerator = () => {
  const [formState, setFormState] = useState<SlackReminder.FormState>(getInitialFormState());

  const { ref } = useBeforeUnload();

  return (
    <>
      <div ref={ref} className="bg-secondary @w640:px-12 @w640:py-14 mx-auto max-w-5xl rounded-2xl p-4 py-10 shadow-md">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <TextField
              label="宛先"
              placeholder="me, #channel, @user"
              value={formState.who}
              onInput={(e) => {
                const value = e.currentTarget.value;
                setFormState((prev) => ({ ...prev, who: value }));
              }}
              autoComplete="off"
            />
          </div>

          <div className="mb-12">
            <TextField
              label="本文"
              placeholder="@group-name チケットの確認をお願いします！"
              value={formState.message}
              onInput={(e) => {
                const value = e.currentTarget.value;
                setFormState((prev) => ({ ...prev, message: value }));
              }}
              multiline
              autoResize
            />
          </div>

          <Tab.Wrapper
            defaultCurrentKey={formState.type}
            onChange={(key) => setFormState((prev) => ({ ...prev, type: formatTabKeyValue(key) }))}
          >
            <Tab.Panel tabKey={everyTypeName.DAILY_OR_WEEKLY}>
              <DailyOrWeeklyPanel formState={formState} setFormState={setFormState} />
            </Tab.Panel>

            <Tab.Panel tabKey={everyTypeName.BIWEEKLY}>
              <BiweeklyPanel formState={formState} setFormState={setFormState} />
            </Tab.Panel>

            <Tab.Panel tabKey={everyTypeName.MONTHLY}>
              <MonthlyPanel formState={formState} setFormState={setFormState} />
            </Tab.Panel>

            <Tab.Panel tabKey={everyTypeName.YEARLY}>
              <YearlyPanel formState={formState} setFormState={setFormState} />
            </Tab.Panel>

            <Tab.Panel tabKey={everyTypeName.ONETIME}>
              <OnetimePanel formState={formState} setFormState={setFormState} />
            </Tab.Panel>
          </Tab.Wrapper>
        </div>
      </div>

      <PreviewAndResult formState={formState} />
    </>
  );
};
