// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $('#shipping-toggle').on('click', function (e) {
      $('#shipping-panel').stop(true, false).slideToggle('500');
      $(this).find('i').toggleClass('fa-plus-square fa-minus-square');
      if ($(this).attr('aria-expanded') === 'false') {
        $(this).attr('aria-expanded', 'true');
      } else {
        $(this).attr('aria-expanded', 'false');
      }
    });
  });

  return <></>;
};
