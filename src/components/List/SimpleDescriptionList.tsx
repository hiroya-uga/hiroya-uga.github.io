export const SimpleDescriptionList = ({
  list,
}: {
  list: (
    | { title: string; description: React.ReactNode; key?: never }
    | { title: React.ReactNode; description: React.ReactNode; key: string }
  )[];
}) => {
  return (
    <dl>
      {list.map(({ title, description, ...item }) => {
        const key = typeof title === 'string' ? title : item.key;

        return (
          <div key={key} className="clear-left not-last:mb-6 sm:not-last:mb-3">
            <dt className="mb-1 flex pl-2 font-bold sm:mb-0">
              <span className="min-w-2 max-w-2 px-px pt-[0.55rem] sm:pt-[0.7rem]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                  <circle cx="50" cy="50" r="50" fill="var(--color-text)" />
                </svg>
              </span>
              <span className="pl-3 leading-snug sm:leading-[inherit]">
                <span className="palt">{title}</span>
              </span>
            </dt>
            <dd className="pl-7 text-sm sm:text-base">{description}</dd>
          </div>
        );
      })}
    </dl>
  );
};
