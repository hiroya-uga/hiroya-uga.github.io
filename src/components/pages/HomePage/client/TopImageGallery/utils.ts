import clsx from 'clsx';

const viewportList = ['w400', 'w640', 'w768', 'w1024'] as const;

type Viewport = (typeof viewportList)[number];

const rowConfig: Record<
  Viewport,
  {
    lineBase: number;
    rows: { start: number; end: number }[];
  }
> = {
  w400: {
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
  w640: {
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
  w768: {
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
  w1024: {
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
  w400: {
    base: 'w400:row-start-(--_w400-row-start) w400:row-end-(--_w400-row-end)',
    cols: [
      'w400:col-start-1 w400:col-end-2 w400:aspect-auto',
      'w400:col-start-2 w400:col-end-3 w400:aspect-square',
      'w400:col-start-1 w400:col-end-2 w400:aspect-square',
      'w400:col-start-2 w400:col-end-3 w400:aspect-auto',
      'w400:col-start-1 w400:col-end-2 w400:aspect-auto',
      'w400:col-start-2 w400:col-end-3 w400:aspect-5/7',
      'w400:col-start-1 w400:col-end-2 w400:aspect-auto',
      'w400:col-start-1 w400:col-end-2 w400:aspect-auto',
      'w400:col-start-2 w400:col-end-3 w400:aspect-5/7',
      'w400:col-start-1 w400:col-end-3 w400:aspect-auto',
    ],
  },
  w640: {
    base: 'w640:row-start-(--_w640-row-start) w640:row-end-(--_w640-row-end)',
    cols: [
      'w640:col-start-1 w640:col-end-2 w640:aspect-auto',
      'w640:col-start-2 w640:col-end-3 w640:aspect-auto',
      'w640:col-start-3 w640:col-end-4 w640:aspect-square',
      'w640:col-start-1 w640:col-end-2 w640:aspect-square',
      'w640:col-start-2 w640:col-end-3 w640:aspect-3/5',
      'w640:col-start-3 w640:col-end-4 w640:aspect-auto',
      'w640:col-start-1 w640:col-end-2 w640:aspect-auto',
      'w640:col-start-2 w640:col-end-3 w640:aspect-auto',
      'w640:col-start-3 w640:col-end-4 w640:aspect-auto',
      'w640:col-start-1 w640:col-end-4 w640:aspect-5/2',
    ],
  },
  w768: {
    base: 'w768:row-start-(--_w768-row-start) w768:row-end-(--_w768-row-end)',
    cols: [
      'w768:col-start-1 w768:col-end-2 w768:aspect-3/4',
      'w768:col-start-2 w768:col-end-3 w768:aspect-auto',
      'w768:col-start-3 w768:col-end-4 w768:aspect-square',
      'w768:col-start-3 w768:col-end-4 w768:aspect-auto',
      'w768:col-start-4 w768:col-end-5 w768:aspect-auto',
      'w768:col-start-1 w768:col-end-2 w768:aspect-square',
      'w768:col-start-1 w768:col-end-2 w768:aspect-auto',
      'w768:col-start-2 w768:col-end-3 w768:aspect-auto',
      'w768:col-start-3 w768:col-end-5 w768:aspect-auto',
      'w768:col-start-3 w768:col-end-5 w768:aspect-auto',
    ],
  },
  w1024: {
    base: 'w1024:row-start-(--_w1024-row-start) w1024:row-end-(--_w1024-row-end)',
    cols: [
      'w1024:col-start-1 w1024:col-end-2 w1024:aspect-auto',
      'w1024:col-start-2 w1024:col-end-3 w1024:aspect-8/7',
      'w1024:col-start-2 w1024:col-end-3 w1024:aspect-auto',
      'w1024:col-start-3 w1024:col-end-4 w1024:aspect-auto',
      'w1024:col-start-4 w1024:col-end-6 w1024:aspect-64/27',
      'w1024:col-start-4 w1024:col-end-6 w1024:aspect-64/27',
      'w1024:col-start-1 w1024:col-end-2 w1024:aspect-auto',
      'w1024:col-start-2 w1024:col-end-5 w1024:aspect-400/87',
      'w1024:col-start-3 w1024:col-end-5 w1024:aspect-16/6',
      'w1024:col-start-5 w1024:col-end-6 w1024:aspect-auto',
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
