// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      setTimeout(function () {
        document.getElementById('alert-div')!.innerHTML = '<p>Hello ARIA World!（role="alert"経由）</p>';
      }, 6000);
    });
  });

  return <></>;
};
