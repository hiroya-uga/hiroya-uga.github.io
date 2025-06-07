export const DiscList = ({ list }: { list: (string | { value: React.ReactNode; key: string })[] }) => {
  if (list.length === 0) {
    return null;
  }

  return (
    <ul className="pl-1.5 sm:pl-2.5">
      {list.map((item) => {
        const key = typeof item === 'string' ? item : item.key;
        const value = typeof item === 'string' ? item : item.value;

        return (
          <li
            key={key}
            className=" flex gap-x-1 text-sm before:mt-[0.6875rem] before:inline-block before:size-1 before:shrink-0 before:rounded-full before:bg-black before:content-[''] sm:gap-x-2  sm:text-base sm:before:mt-3 sm:before:size-[0.3125rem] sm:[&:not(:last-child)]:mb-1"
          >
            <span className="grow">{value}</span>
          </li>
        );
      })}
    </ul>
  );
};
