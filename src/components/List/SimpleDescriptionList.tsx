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
          <div key={key} className="[&:not(:last-child)]:mb-2 clear-left">
            <dt className="font-bold flex items-center pl-2 sm:float-left">
              <span className="w-2 px-[1px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                  <circle cx="50" cy="50" r="50" fill="#333" />
                </svg>
              </span>
              <span className="pl-2 palt">{title}</span>：
            </dt>
            <dd className="pl-6 text-sm sm:text-base">{description}</dd>
          </div>
        );
      })}
    </dl>
  );
};
