interface Props {
  list: (string | { value: React.ReactNode; key: string })[];
}

export const DiscList = ({ list }: Readonly<Props>) => {
  if (list.length === 0) {
    return null;
  }

  return (
    <ul className="w640:pl-2.5 leading-base space-y-1 pl-1.5">
      {list.map((item) => {
        const key = typeof item === 'string' ? item : item.key;
        const value = typeof item === 'string' ? item : item.value;

        return (
          <li
            key={key}
            className="before:bg-(--color-primary) flex gap-x-2 before:mt-[0.75em] before:inline-block before:size-[0.35714285714285715em] before:shrink-0 before:rounded-full before:content-[''] before:[font-size:inherit]"
          >
            <div className="grow">{value}</div>
          </li>
        );
      })}
    </ul>
  );
};
