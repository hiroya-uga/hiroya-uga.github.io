// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      document.querySelectorAll('a[role="tab"]').forEach(function (elm) {
        elm.removeAttribute('href');
      });
    });
  });

  return <></>;
};
