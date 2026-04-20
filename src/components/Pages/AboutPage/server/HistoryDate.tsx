const toDateTimeAttr = (dateStr: string) => {
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  if (/^\d{4}\.\d{2}$/.test(dateStr)) {
    return dateStr.replace('.', '-');
  }
  return null;
};

export const HistoryDate = ({ data }: { data: string }) => {
  if (data.includes(' - ') === false) {
    const datetime = toDateTimeAttr(data);
    if (datetime === null) {
      return <>{data}</>;
    }
    return <time dateTime={datetime}>{data}</time>;
  }

  const [start, end] = data.split(' - ');
  const startDatetime = toDateTimeAttr(start);
  const endDatetime = end === undefined ? null : toDateTimeAttr(end);

  return (
    <>
      {startDatetime === null ? start : <time dateTime={startDatetime}>{start}</time>}
      {' - '}
      {endDatetime === null ? end : <time dateTime={endDatetime}>{end}</time>}
    </>
  );
};
