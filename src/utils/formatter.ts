export const formatStringToNumericString = (value: string) => {
  return value
    .replace(/[０-９ー]/g, (c) => {
      return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
    })
    .replace(/^0+|[^0-9-]/g, '');
};

export const formattedTimeStampString = (date: Date) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZone: 'Asia/Tokyo',
  }).format(date);

export const formattedDateString = (date: Date) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
    .format(date)
    .replace('/', '年')
    .replace('/', '月') + '日';

export const formattedTimeString = (date: Date) =>
  new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
    .format(date)
    .replace(':', '時') + '分';

export const formatHexString = (input: string) => {
  const value = input.trim().replace(/^#/, '');

  if (/^[0-9a-f]+$/i.test(value)) {
    if (value.length === 6) {
      return `#${value.toLowerCase()}`;
    }

    if (value.length === 3) {
      const [r, g, b] = value.split('');
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
  }

  return null;
};
