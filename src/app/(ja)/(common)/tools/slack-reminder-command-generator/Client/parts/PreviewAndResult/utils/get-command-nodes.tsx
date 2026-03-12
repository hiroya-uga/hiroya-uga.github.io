import {
  everyTypeName,
  type SlackReminder,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { isWeekday } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/utils';

const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getDays = ({ type, days }: Pick<SlackReminder.FormState, 'type' | 'days'>) => {
  if (type === everyTypeName.DAILY_OR_WEEKLY) {
    if (days.includes(false) === false || days.includes(true) === false) {
      return 'day';
    }
  }

  if (isWeekday(days)) {
    if (days[5] && days[6]) {
      return 'weekday, Saturday, Sunday';
    }

    if (days[5]) {
      return 'weekday, Saturday';
    }

    if (days[6]) {
      return 'weekday, Sunday';
    }

    return 'weekday';
  }

  return days
    .map((checked, index) => (checked ? dayList[index] : ''))
    .filter((value) => value !== '')
    .join(', ');
};

const getMonthlyDate = ({ monthState, day }: Pick<SlackReminder.FormState, 'monthState' | 'day'>) => {
  switch (monthState.type) {
    case 'last':
      return 'on the last day';

    case 'nth':
      return `on the ${monthState.nth} ${dayList[day] ?? '？'}`;

    case 'fixed': {
      const value = monthState.day
        .replace(/(0|[4-9])$/, '$1th')
        .replace(/1$/, '1st')
        .replace(/2$/, '2nd')
        .replace(/3$/, '3rd');
      return `on the ${value}`;
    }

    default:
      return '不具合です。選択した内容を開発者へご連絡ください。';
  }
};

export const getCommandNodes = ({
  who,
  message,
  time,
  days,
  day,
  starting,
  type,
  fullDate,
  date,
  monthState,
}: SlackReminder.FormState): SlackReminder.Result => {
  const checkedDays = getDays({ type, days });
  const commonValues = { who, message, time, starting };

  switch (type) {
    case everyTypeName.DAILY_OR_WEEKLY:
      return {
        ...commonValues,
        every: 'every',
        day: checkedDays,
      };

    case everyTypeName.BIWEEKLY:
      return {
        ...commonValues,
        every: 'every other',
        day: dayList[day],
      };

    case everyTypeName.MONTHLY:
      return {
        ...commonValues,
        date: getMonthlyDate({ monthState, day }),
        every: 'every month',
      };

    case everyTypeName.YEARLY: {
      const month = monthList[Number(date[0]) - 1] ?? '[Month]';

      return {
        ...commonValues,
        date: `on ${month} ${date[1] || '[Day]'}`,
        every: 'every year',
      };
    }

    case everyTypeName.ONETIME: {
      const [year, month, dayValue] = fullDate.split('-');
      const value = `${month}/${dayValue}/${year}`;

      return {
        ...commonValues,
        date: fullDate ? `on ${value}` : 'mm/dd/yyyy',
      };
    }

    default:
      return { who: 'エラー' };
  }
};
