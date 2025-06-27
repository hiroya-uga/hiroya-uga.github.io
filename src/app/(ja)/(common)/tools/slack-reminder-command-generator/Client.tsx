'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import {
  DateSection,
  DaySection,
  DaysSection,
  FullDateSection,
  isWeekday,
  StartingSection,
  TimeSection,
} from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Components';
import { NoteBox } from '@/components/Box';
import { Radio, TextField } from '@/components/Form';
import { Tab } from '@/components/Tab';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

let copyButtonSettimeoutId = -1;

type Result = {
  who?: string;
  message?: string;
  every?: string;
  day?: string;
  date?: string;
  time?: string;
  starting?: string;
};

type Every = '毎日・毎週' | '隔週' | '毎月' | '毎年' | '繰り返しなし';

const createComment = ({ result, type }: { result: Result; type: Every }) => {
  const day = (() => {
    switch (type) {
      case '毎日・毎週':
        if (result.day === 'day') {
          return '毎日';
        }

        if (result.day === 'weekday') {
          return '毎週平日の';
        }

        return `毎週${result.day?.replaceAll(' ', '').replaceAll(',', '・').replace('weekday', '平日').replace('Monday', '月').replace('Tuesday', '火').replace('Wednesday', '水').replace('Thursday', '木').replace('Friday', '金').replace('Saturday', '土').replace('Sunday', '日')}曜日の`;

      case '繰り返しなし':
        return result.day;

      case '隔週':
        return `隔週で${result.day?.replace('Monday', '月').replace('Tuesday', '火').replace('Wednesday', '水').replace('Thursday', '木').replace('Friday', '金').replace('Saturday', '土').replace('Sunday', '日') ?? '？'}曜日の`;

      default:
        return type || '？';
    }
  })();
  const date = (() => {
    switch (type) {
      case '毎月': {
        if (!result.date) {
          return '[Date]';
        }

        if (result.date === 'on the last day') {
          return '月末の';
        }

        if (/on the \d/.test(result.date)) {
          const value = parseInt(result.date.replace('on the ', ''));
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
      case '毎年': {
        const [month, day] = (result.date ?? '').replace('on ', '').split(' ');
        return `${month.replace('January', '1').replace('February', '2').replace('March', '3').replace('April', '4').replace('May', '5').replace('June', '6').replace('July', '7').replace('August', '8').replace('September', '9').replace('October', '10').replace('November', '11').replace('December', '12')}月${day}日`;
      }

      case '繰り返しなし': {
        if (!result.date || result.date === 'mm/dd/yyyy') {
          return 'yyyy年mm月dd日';
        }

        const [month, day, year] = result.date?.replace('on ', '').split('/') ?? [];
        return ` ${year}年${month}月${day}日`;
      }

      default:
        break;
    }
  })();
  const time = (() => {
    if (result.time) {
      const [hour, minute] = result.time.split(':');
      return `${Number(hour) >= 12 ? '午後' : '午前'}${String(Number(hour) % 12).padStart(2, '0')}時${minute}分`;
    }
    return '午前9時';
  })();

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
    result.starting && <span className="inline-block">{`（開始日: ${result.starting}）`}</span>,
  ].filter(Boolean);
};

const onbeforeunload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
};
const onchange = () => {
  window.addEventListener('beforeunload', onbeforeunload);
};
export const SlackReminderCommandGenerator = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [type, setType] = useState<Every>('毎日・毎週');
  const [who, setWho] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState(`${today.getHours()}:00`);
  const [date, setDate] = useState([`${tomorrow.getMonth() + 1}`, `${tomorrow.getDate()}`]);
  const [fullDate, setFullDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [day, setDay] = useState(0);
  const [days, setDays] = useState([false, false, false, false, false, false, false]);
  const [starting, setStarting] = useState('');

  // 毎月
  const [monthState, setMonthState] = useState<{
    type: 'fixed' | 'nth' | 'last';
    nth: 'first' | 'second' | 'third' | 'fourth' | 'last';
    day: string;
  }>({ type: 'fixed', nth: 'first', day: '1' });

  const [result, setResult] = useState<Result>({
    who: 'me',
    message: 'ここにメッセージ',
    every: 'every',
    day: 'day',
    time: '09:00',
  });

  useEffect(() => {
    const form = ref.current;

    form?.addEventListener('change', onchange);
    return () => {
      form?.removeEventListener('change', onchange);
      window.removeEventListener('beforeunload', onbeforeunload);
      if (copyButtonSettimeoutId) {
        clearTimeout(copyButtonSettimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const checkedDays = (() => {
      if (type === '毎日・毎週') {
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
    })();

    switch (type) {
      case '毎日・毎週':
        setResult({
          who: who,
          message,
          every: 'every',
          day: checkedDays,
          time,
          starting,
        });
        break;
      case '隔週':
        setResult({
          who: who,
          message,
          every: 'every other',
          day: dayList[day],
          time,
          starting,
        });
        break;
      case '毎月':
        setResult({
          who: who,
          message,
          date: (() => {
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
          })(),
          every: 'every month',
          time,
          starting,
        });
        break;
      case '毎年': {
        const monthKey = [
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
        const month = monthKey[Number(date[0]) - 1] ?? '[Month]';

        setResult({
          who: who,
          message,
          date: `on ${month} ${date[1] || '[Day]'}`,
          every: 'every year',
          time,
          starting,
        });
        break;
      }
      case '繰り返しなし': {
        const [year, month, day] = fullDate.split('-');
        const value = `${month}/${day}/${year}`;

        setResult({
          who: who,
          message,
          date: fullDate ? `on ${value}` : 'mm/dd/yyyy',
          time,
          starting,
        });
        break;
      }
      default:
        setResult({ who: 'エラー' });
    }
  }, [who, message, time, days, day, starting, type, fullDate, date, monthState]);

  return (
    <>
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-4 py-10 shadow-md sm:px-12 sm:py-14" ref={ref}>
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <TextField
              label="宛先"
              placeholder="me, #channel, @user"
              value={who}
              onInput={(e) => setWho(e.currentTarget.value)}
              autoComplete="off"
            />
          </div>

          <div className="mb-12">
            <TextField
              label="本文"
              placeholder="@group-name チケットの確認をお願いします！"
              value={message}
              onInput={(e) => setMessage(e.currentTarget.value)}
              multiline
              autoResize
            />
          </div>

          <Tab.Wrapper defaultCurrentKey={type} onChange={(key) => setType(key as Every)}>
            <Tab.Panel tabKey="毎日・毎週">
              <DaysSection values={days} dispatch={setDays} />
              <TimeSection value={time} dispatch={setTime} />
              <StartingSection value={starting} dispatch={setStarting} />
            </Tab.Panel>
            <Tab.Panel tabKey="隔週">
              <DaySection value={day} dispatch={setDay} />
              <TimeSection value={time} dispatch={setTime} />
              <StartingSection value={starting} dispatch={setStarting} />
            </Tab.Panel>

            <Tab.Panel tabKey="毎月">
              <fieldset className="mb-10">
                <legend className="mb-2 text-sm font-bold leading-snug">パターン</legend>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  <li>
                    <Radio
                      label="固定日"
                      checked={monthState.type === 'fixed'}
                      name="month-type"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setMonthState({
                            ...monthState,
                            type: 'fixed',
                          });
                        }
                      }}
                    />
                  </li>
                  <li>
                    <Radio
                      label="序数表現（e.g. 第3土曜日）"
                      checked={monthState.type === 'nth'}
                      name="month-type"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setMonthState({
                            ...monthState,
                            type: 'nth',
                          });
                        }
                      }}
                    />
                  </li>
                  <li>
                    <Radio
                      label="月末"
                      checked={monthState.type === 'last'}
                      name="month-type"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setMonthState({
                            ...monthState,
                            type: 'last',
                          });
                        }
                      }}
                    />
                  </li>
                </ul>
              </fieldset>

              {monthState.type === 'fixed' && (
                <>
                  <p className="mb-1 text-sm font-bold leading-snug">毎月</p>
                  <p className="outline-hidden has-focus-visible:outline-black mb-10 flex w-fit items-center gap-1 rounded-md border border-gray-300 px-2 py-1 outline-2">
                    <input
                      type="number"
                      min={1}
                      max={31}
                      id={'month-day'}
                      value={monthState.day}
                      className="focus-visible:outline-hidden box-content w-[2ch] px-0.5 py-1 text-center"
                      onInput={(e) => {
                        setMonthState({
                          ...monthState,
                          day: `${Number(e.currentTarget.value) || '1'}`,
                        });
                      }}
                    />
                    <label htmlFor={'month-day'} className="pt-0.5 text-xs leading-none">
                      日
                    </label>
                  </p>
                </>
              )}

              {monthState.type === 'nth' && (
                <>
                  <fieldset className="mb-10">
                    <legend className="mb-2 text-sm font-bold leading-snug">序数</legend>
                    <ul className="flex flex-wrap gap-x-4 gap-y-2">
                      {['first', 'second', 'third', 'fourth', 'last'].map((nth, index) => (
                        <li key={nth}>
                          <Radio
                            label={nth === 'last' ? '最終' : `第${index + 1}`}
                            checked={monthState.nth === nth}
                            name="nth"
                            onChange={(e) => {
                              if (e.currentTarget.checked) {
                                setMonthState({
                                  ...monthState,
                                  nth: nth as typeof monthState.nth,
                                });
                              }
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </fieldset>

                  <DaySection value={day} dispatch={setDay} />
                </>
              )}

              <TimeSection value={time} dispatch={setTime} />
              <StartingSection value={starting} dispatch={setStarting} />
            </Tab.Panel>

            <Tab.Panel tabKey="毎年">
              <DateSection values={date} dispatch={setDate} />
              <StartingSection value={starting} dispatch={setStarting} />
              <TimeSection value={time} dispatch={setTime} />
            </Tab.Panel>

            <Tab.Panel tabKey="繰り返しなし">
              <FullDateSection value={fullDate} dispatch={setFullDate} />
              <TimeSection value={time} dispatch={setTime} />
              <NoteBox title="手書きの際、こんな相対表現も使えます">
                <dl>
                  <div className="sm:flex sm:gap-2">
                    <dt>次の金曜日</dt>
                    <dd className='before:mr-2 before:content-["-"]'>
                      <code>next Friday</code>
                    </dd>
                  </div>
                  <div className="sm:flex sm:gap-2">
                    <dt>30分後</dt>
                    <dd className='before:mr-2 before:content-["-"]'>
                      <code>in 30 minutes </code>
                    </dd>
                  </div>
                  <div className="sm:flex sm:gap-2">
                    <dt>今月の最終日</dt>
                    <dd className='before:mr-2 before:content-["-"]'>
                      <code>on the last day of this month</code>
                    </dd>
                  </div>
                </dl>
              </NoteBox>
            </Tab.Panel>
          </Tab.Wrapper>
        </div>
      </div>
      <div className="mb-2 border-t border-gray-300 px-1 pt-14">
        <h2 className="mb-1 font-bold">出力結果：</h2>
        <p className="whitespace-pre-wrap">{createComment({ result, type })}</p>
      </div>
      <div className="pb-4 sm:sticky sm:bottom-0 sm:z-10">
        <div className="sm:shadow-sticky sm:grid sm:grid-cols-[1fr_auto] sm:rounded-lg sm:bg-white">
          <p
            className="whitespace-pre-wrap rounded-t-lg bg-gray-800 p-4 font-mono text-xs text-gray-300 sm:rounded-l-lg sm:rounded-r-none"
            onClick={(e) => {
              window.getSelection()?.removeAllRanges();
              const range = document.createRange();
              range.selectNodeContents(e.currentTarget);
              window.getSelection()?.addRange(range);
            }}
          >
            <span className="text-blue-400">/remind</span> <span className="text-red-300">{result.who || 'me'}</span>{' '}
            <span className="text-orange-300">"{result.message || 'ここにメッセージ'}"</span>{' '}
            {result.date && (
              <>
                <span className="text-[#b5cea8]">{result.date}</span>{' '}
                {result.every && (
                  <>
                    <span className="text-blue-400">{result.every}</span>{' '}
                  </>
                )}
              </>
            )}
            {result.day && (
              <>
                {result.every && (
                  <>
                    <span className="text-blue-400">{result.every}</span>{' '}
                  </>
                )}
                <span className="text-[#b5cea8]">{result.day}</span>{' '}
              </>
            )}
            <span className="text-red-300">at {result.time || '9:00'}</span>
            <span className="text-purple-300">{result.starting && ` starting ${result.starting}`}</span>
          </p>
          <p className="sm:w-89px grid rounded-b-lg bg-slate-200 text-xs sm:rounded-l-none sm:rounded-r-lg">
            <button
              type="button"
              className="grid grid-cols-[1rem_auto] items-center justify-center gap-1 rounded-r-lg p-3 transition-colors hover:bg-slate-300"
              onClick={(e) => {
                const label = e.currentTarget.lastElementChild;
                const value = e.currentTarget.parentElement?.previousElementSibling?.textContent?.trim();

                if (!label) {
                  return;
                }

                clearTimeout(copyButtonSettimeoutId);

                try {
                  if (value) {
                    navigator.clipboard.writeText(value);
                    label.textContent = 'Copied!';
                  }
                } catch {
                  label.textContent = 'Error!';
                }

                copyButtonSettimeoutId = window.setTimeout(() => {
                  label.textContent = 'Copy';
                }, 2000);
              }}
            >
              <Image src="/common/images/icons/copy.svg" alt="" className="size-4" width={16} height={16} />
              <span className="font-bold leading-4" aria-live="assertive" title="出力結果をコピー">
                Copy
              </span>
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
