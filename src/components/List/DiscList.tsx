export const DiscList = ({ list }: { list: (string | { value: React.ReactNode; key: string })[] }) => {
  if (list.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-1 pl-1.5 sm:pl-2.5">
      {list.map((item) => {
        const key = typeof item === 'string' ? item : item.key;
        const value = typeof item === 'string' ? item : item.value;

        return (
          <li
            key={key}
            className="before:size-5px flex gap-x-2 before:mt-3 before:inline-block before:shrink-0 before:rounded-full before:bg-[var(--color-text)] before:content-['']"
          >
            <span className="grow">{value}</span>
          </li>
        );
      })}
    </ul>
  );
};
