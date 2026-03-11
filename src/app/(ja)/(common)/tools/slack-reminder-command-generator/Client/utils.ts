import type { SlackReminder } from './config';

export const isWeekday = (values: SlackReminder.FormState['days']) => {
  return values.slice(0, 5).filter(Boolean).length === 5;
};
