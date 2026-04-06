import clsx from 'clsx';

const viewportList = ['xs', 'sm', 'md', 'lg'] as const;

type Viewport = (typeof viewportList)[number];

const rowConfig: Record<
  Viewport,
  {
    lineBase: number;
    rows: { start: number; end: number }[];
  }
> = {
  xs: {
    lineBase: 10,
    rows: [
      { start: 1, end: 3 },
      { start: 1, end: 2 },
      { start: 3, end: 4 },
      { start: 2, end: 5 },
      { start: 4, end: 6 },
      { start: 5, end: 7 },
      { start: 6, end: 8 },
      { start: 8, end: 10 },
      { start: 7, end: 10 },
      { start: 10, end: 11 },
    ],
  },
  sm: {
    lineBase: 8,
    rows: [
      { start: 1, end: 3 },
      { start: 1, end: 4 },
      { start: 1, end: 2 },
      { start: 3, end: 5 },
      { start: 4, end: 7 },
      { start: 2, end: 6 },
      { start: 5, end: 8 },
      { start: 7, end: 8 },
      { start: 6, end: 8 },
      { start: 8, end: 9 },
    ],
  },
  md: {
    lineBase: 6,
    rows: [
      { start: 1, end: 3 },
      { start: 1, end: 4 },
      { start: 1, end: 2 },
      { start: 2, end: 5 },
      { start: 1, end: 5 },
      { start: 3, end: 5 },
      { start: 5, end: 7 },
      { start: 4, end: 7 },
      { start: 5, end: 6 },
      { start: 6, end: 7 },
    ],
  },
  lg: {
    lineBase: 4,
    rows: [
      { start: 1, end: 3 },
      { start: 1, end: 2 },
      { start: 2, end: 4 },
      { start: 1, end: 3 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 3, end: 5 },
      { start: 4, end: 5 },
      { start: 3, end: 4 },
      { start: 3, end: 5 },
    ],
  },
};

const classes: Record<Viewport, { base: string; cols: string[] }> = {
  xs: {
    base: 'xs:row-start-(--_xs-row-start) xs:row-end-(--_xs-row-end)',
    cols: [
      'xs:col-start-1 xs:col-end-2 xs:aspect-auto',
      'xs:col-start-2 xs:col-end-3 xs:aspect-square',
      'xs:col-start-1 xs:col-end-2 xs:aspect-square',
      'xs:col-start-2 xs:col-end-3 xs:aspect-auto',
      'xs:col-start-1 xs:col-end-2 xs:aspect-auto',
      'xs:col-start-2 xs:col-end-3 xs:aspect-5/7',
      'xs:col-start-1 xs:col-end-2 xs:aspect-auto',
      'xs:col-start-1 xs:col-end-2 xs:aspect-auto',
      'xs:col-start-2 xs:col-end-3 xs:aspect-5/7',
      'xs:col-start-1 xs:col-end-3 xs:aspect-auto',
    ],
  },
  sm: {
    base: 'sm:row-start-(--_sm-row-start) sm:row-end-(--_sm-row-end)',
    cols: [
      'sm:col-start-1 sm:col-end-2 sm:aspect-auto',
      'sm:col-start-2 sm:col-end-3 sm:aspect-auto',
      'sm:col-start-3 sm:col-end-4 sm:aspect-square',
      'sm:col-start-1 sm:col-end-2 sm:aspect-square',
      'sm:col-start-2 sm:col-end-3 sm:aspect-3/5',
      'sm:col-start-3 sm:col-end-4 sm:aspect-auto',
      'sm:col-start-1 sm:col-end-2 sm:aspect-auto',
      'sm:col-start-2 sm:col-end-3 sm:aspect-auto',
      'sm:col-start-3 sm:col-end-4 sm:aspect-auto',
      'sm:col-start-1 sm:col-end-4 sm:aspect-5/2',
    ],
  },
  md: {
    base: 'md:row-start-(--_md-row-start) md:row-end-(--_md-row-end)',
    cols: [
      'md:col-start-1 md:col-end-2 md:aspect-3/4',
      'md:col-start-2 md:col-end-3 md:aspect-auto',
      'md:col-start-3 md:col-end-4 md:aspect-square',
      'md:col-start-3 md:col-end-4 md:aspect-auto',
      'md:col-start-4 md:col-end-5 md:aspect-auto',
      'md:col-start-1 md:col-end-2 md:aspect-square',
      'md:col-start-1 md:col-end-2 md:aspect-auto',
      'md:col-start-2 md:col-end-3 md:aspect-auto',
      'md:col-start-3 md:col-end-5 md:aspect-auto',
      'md:col-start-3 md:col-end-5 md:aspect-auto',
    ],
  },
  lg: {
    base: 'lg:row-start-(--_lg-row-start) lg:row-end-(--_lg-row-end)',
    cols: [
      'lg:col-start-1 lg:col-end-2 lg:aspect-auto',
      'lg:col-start-2 lg:col-end-3 lg:aspect-8/7',
      'lg:col-start-2 lg:col-end-3 lg:aspect-auto',
      'lg:col-start-3 lg:col-end-4 lg:aspect-auto',
      'lg:col-start-4 lg:col-end-6 lg:aspect-64/27',
      'lg:col-start-4 lg:col-end-6 lg:aspect-64/27',
      'lg:col-start-1 lg:col-end-2 lg:aspect-auto',
      'lg:col-start-2 lg:col-end-5 lg:aspect-400/87',
      'lg:col-start-3 lg:col-end-5 lg:aspect-16/6',
      'lg:col-start-5 lg:col-end-6 lg:aspect-auto',
    ],
  },
};

export const getCSSRowVariables = (index: number, lineIndex: number) => {
  return Object.fromEntries(
    viewportList.flatMap((viewport) => {
      const config = rowConfig[viewport];
      const row = config.rows[index];
      const base = lineIndex * config.lineBase;
      return [
        [`--_${viewport}-row-start`, base + row.start],
        [`--_${viewport}-row-end`, base + row.end],
      ];
    }),
  ) as React.CSSProperties;
};

export const getClassNameForPhotoItem = (index: number) => {
  return clsx(
    viewportList.map((viewport) => {
      return clsx(classes[viewport].base, classes[viewport].cols?.[index] ?? '');
    }),
  );
};
