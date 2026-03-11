export const everyTypeName = {
  DAILY_OR_WEEKLY: '毎日・毎週',
  BIWEEKLY: '隔週',
  MONTHLY: '毎月',
  YEARLY: '毎年',
  ONETIME: '繰り返しなし',
} as const;

namespace SlackReminder {
  export type Type = (typeof everyTypeName)[keyof typeof everyTypeName];

  export type Result = {
    who?: string;
    message?: string;
    every?: string;
    day?: string;
    date?: string;
    time?: string;
    starting?: string;
  };

  export type MonthState = {
    type: 'fixed' | 'nth' | 'last';
    nth: 'first' | 'second' | 'third' | 'fourth' | 'last';
    day: string;
  };

  export type FormState = {
    type: Type;
    who: string;
    message: string;
    time: string;
    date: string[];
    fullDate: string;
    day: number;
    days: boolean[];
    starting: string;
    monthState: MonthState;
  };
}

export type { SlackReminder };
