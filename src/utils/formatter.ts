export const formatStringToNumericString = (value: string) => {
  return value
    .replace(/[０-９ー]/g, (c) => {
      return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
    })
    .replace(/^0+|[^0-9-]/g, '');
};
