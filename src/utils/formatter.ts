export const formatStringToNumericString = (value: string) => {
  return value
    .replace(/[０-９ー]/g, (c) => {
      return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
    })
    .replace(/^0+|[^0-9-]/g, '');
};

export const formattedDateString = (date: Date) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
