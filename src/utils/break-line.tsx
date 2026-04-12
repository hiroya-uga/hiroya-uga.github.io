interface Options {
  className?: string;
}

export const convertBreakLineToElement = (string: string, options?: Options) => {
  return string.split('\n').map((sentence, index) => {
    return (
      <span key={`${sentence}-${index}`} className={options?.className ?? 'inline-block'}>
        {sentence}
      </span>
    );
  });
};
