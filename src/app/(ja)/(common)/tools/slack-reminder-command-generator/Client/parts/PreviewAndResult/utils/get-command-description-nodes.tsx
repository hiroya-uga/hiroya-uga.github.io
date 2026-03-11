import {
  everyTypeName,
  type SlackReminder,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';

const toJapaneseShortDay = (value: string) =>
  value
    .replace('Monday', '月')
    .replace('Tuesday', '火')
    .replace('Wednesday', '水')
    .replace('Thursday', '木')
    .replace('Friday', '金')
    .replace('Saturday', '土')
    .replace('Sunday', '日');

const getDayComment = (result: SlackReminder.Result, type: SlackReminder.FormState['type']) => {
  switch (type) {
    case everyTypeName.DAILY_OR_WEEKLY:
      if (result.day === 'day') {
        return '毎日';
      }

      if (result.day === 'weekday') {
        return '毎週平日の';
      }

      return `毎週${result.day?.replaceAll(' ', '').replaceAll(',', '・').replace('weekday', '平日').replace('Monday', '月').replace('Tuesday', '火').replace('Wednesday', '水').replace('Thursday', '木').replace('Friday', '金').replace('Saturday', '土').replace('Sunday', '日')}曜日の`;

    case everyTypeName.ONETIME:
      return result.day;

    case everyTypeName.BIWEEKLY:
      return `隔週で${toJapaneseShortDay(result.day ?? '？')}曜日の`;

    default:
      return type || '？';
  }
};

const getDateComment = (result: SlackReminder.Result, type: SlackReminder.FormState['type']) => {
  switch (type) {
    case everyTypeName.MONTHLY: {
      if (!result.date) {
        return '[Date]';
      }

      if (result.date === 'on the last day') {
        return '月末の';
      }

      if (/on the \d/.test(result.date)) {
        const value = Number.parseInt(result.date.replace('on the ', ''));
        return `${value}日`;
      }

      return result.date
        .replace('on the first ', '第1')
        .replace('on the second ', '第2')
        .replace('on the third ', '第3')
        .replace('on the fourth ', '第4')
        .replace('on the last ', '最終')
        .replace('Monday', '月曜日の')
        .replace('Tuesday', '火曜日の')
        .replace('Wednesday', '水曜日の')
        .replace('Thursday', '木曜日の')
        .replace('Friday', '金曜日の')
        .replace('Saturday', '土曜日の')
        .replace('Sunday', '日曜日の');
    }

    case everyTypeName.YEARLY: {
      const [baseMonth, day] = (result.date ?? '').replace('on ', '').split(' ');
      const month = baseMonth
        .replace('January', '1')
        .replace('February', '2')
        .replace('March', '3')
        .replace('April', '4')
        .replace('May', '5')
        .replace('June', '6')
        .replace('July', '7')
        .replace('August', '8')
        .replace('September', '9')
        .replace('October', '10')
        .replace('November', '11')
        .replace('December', '12');

      return `${month}月${day}日`;
    }

    case everyTypeName.ONETIME: {
      if (!result.date || result.date === 'mm/dd/yyyy') {
        return 'yyyy年mm月dd日';
      }

      const [month, day, year] = result.date?.replace('on ', '').split('/') ?? [];
      return ` ${year}年${month}月${day}日`;
    }

    default:
      return undefined;
  }
};

const getTimeComment = (result: SlackReminder.Result) => {
  if (result.time) {
    const [hour, minute] = result.time.split(':');
    return `${Number(hour) >= 12 ? '午後' : '午前'}${String(Number(hour) % 12).padStart(2, '0')}時${minute}分`;
  }

  return '午前9時';
};

interface Params {
  result: SlackReminder.Result;
  type: SlackReminder.FormState['type'];
}

export const getCommandDescriptionNodes = ({ result, type }: Params) => {
  const day = getDayComment(result, type);
  const date = getDateComment(result, type);
  const time = getTimeComment(result);

  return [
    result.who === 'me' || Boolean(result.who) === false ? '自分' : `${result.who} `,
    '宛に',
    '「',
    result.message || 'ここにメッセージ',
    '」という内容を、',
    day,
    date,
    time,
    'にリマインドします。',
    result.starting && <span className="inline-block" key="開始日">{`（開始日: ${result.starting}）`}</span>,
  ].filter(Boolean);
};
