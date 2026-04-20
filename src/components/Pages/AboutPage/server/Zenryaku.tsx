import { Fragment } from 'react';

import { ZENRYAKU } from '../constants';

export const Zenryaku = () => {
  return (
    <dl className="@w640:pt-1 leading-base text-sm font-normal">
      {ZENRYAKU.map(({ title, answer }) => (
        <Fragment key={title}>
          <dt className="bg-tertiary text-high-contrast mb-1 px-1.5">{title}</dt>
          <dd className="not-last:mb-6 pl-1.5">{answer}</dd>
        </Fragment>
      ))}
    </dl>
  );
};
