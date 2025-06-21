export const NoteList = ({ list }: { list: (string | { value: React.ReactNode; key: string })[] }) => {
  if (list.length === 0) {
    return null;
  }

  if (list.length === 1) {
    const value = typeof list[0] === 'string' ? list[0] : list[0].value;

    return (
      <p className="palt flex gap-x-1 text-xs leading-relaxed  sm:text-sm">
        <span>※</span>
        <small>{value}</small>
      </p>
    );
  }

  return (
    <ul>
      {list.map((item) => {
        const key = typeof item === 'string' ? item : item.key;
        const value = typeof item === 'string' ? item : item.value;

        return (
          <li key={key} className="palt flex gap-x-1 text-xs leading-relaxed sm:text-sm sm:not-last:mb-1">
            <span>※</span>
            <small>{value}</small>
          </li>
        );
      })}
    </ul>
  );
};
