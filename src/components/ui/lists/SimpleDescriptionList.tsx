interface Props {
  list: (
    | { title: string; description: React.ReactNode; key?: never }
    | { title: React.ReactNode; description: React.ReactNode; key: string }
  )[];
}

export const SimpleDescriptionList = ({ list }: Readonly<Props>) => {
  return (
    <dl>
      {list.map(({ title, description, ...item }) => {
        const key = typeof title === 'string' ? title : item.key;

        return (
          <div key={key} className="not-last:mb-6 w640:not-last:mb-3 clear-left">
            <dt className="w640:mb-0 mb-1 flex pl-2 font-bold">
              <span className="min-w-2 max-w-2 px-px pt-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                  <circle cx="50" cy="50" r="50" fill="var(--x-fill, var(--color-primary))" />
                </svg>
              </span>
              <span className="w640:leading-inherit pl-3">
                <span className="palt">{title}</span>
              </span>
            </dt>
            <dd className="w640:text-base pl-7 text-sm">{description}</dd>
          </div>
        );
      })}
    </dl>
  );
};
