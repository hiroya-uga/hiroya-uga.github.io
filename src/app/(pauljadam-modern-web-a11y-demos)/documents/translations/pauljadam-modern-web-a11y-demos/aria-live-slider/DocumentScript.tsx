// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      document.getElementById('temp').addEventListener('change', function () {
        document.getElementById('current-temp').innerHTML = '現在の気温は摂氏 ' + this.value + ' ℃です。';
      });
    });
  });

  return <></>;
};
