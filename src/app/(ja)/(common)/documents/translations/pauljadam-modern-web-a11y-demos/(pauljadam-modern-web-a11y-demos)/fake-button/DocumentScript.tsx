// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function (e) {
      $('#faux-button').on('keyup', function (e) {
        if (e.key === 'Enter') {
          alert('いてて！ button[fake] が叩かれました！');
        }
      });
      $('#faux-button').on('click', function (e) {
        alert('いてて！ button[fake] がクリックされました！');
      });
      $('#alt-button').on('keyup', function (e) {
        if (e.key === 'Enter') {
          alert('いてて！ button[alt] が叩かれました！');
        }
      });
      $('#alt-button').on('click', function (e) {
        alert('いてて！ button[alt] がクリックされました！');
      });
      $('#title-button').on('keyup', function (e) {
        if (e.key === 'Enter') {
          alert('いてて！ button[title] が叩かれました！');
        }
      });
      $('#title-button').on('click', function (e) {
        alert('いてて！ button[title] がクリックされました!');
      });
    });
  }, []);

  return <></>;
};
