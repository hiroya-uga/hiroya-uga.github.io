// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function (e) {
      $('#shipping-toggle').on('click', function (e) {
        $('#shipping-panel').stop(true, false).slideToggle('500');
        $(this).find('i').toggleClass('fa-plus-square fa-minus-square');
      });
    });
  }, []);

  return <></>;
};
