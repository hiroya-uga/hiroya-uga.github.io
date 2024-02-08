export const PageTitle = ({
  title,
  previous,
  children,
}: {
  title: string;
  previous?: string;
  children?: React.ReactNode;
}) => {
  if (previous) {
    return (
      <div className="mb-12">
        <h1 className="leading-none">
          <span className="text-sm">{previous}</span>
          <strong className="font-normal block leading-relaxed">{title}</strong>
        </h1>
        {children}
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h1>{title}</h1>
      {children}
    </div>
  );
};
