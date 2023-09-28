// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      setTimeout(function () {
        setInterval(function () {
          var time = $('#timer').text();
          $('#alert').html('保存までの残り時間: ' + time);
        }, 1000 * 60 * 1);
      }, 1000);

      setInterval(function () {
        $('.countdown').each(function () {
          var seconds = $(this).data('seconds');
          if (seconds > 0) {
            var second = seconds - 1;
            $(this).data('seconds', second);

            var date = new Date(null);
            date.setSeconds(second);
            $(this).html(date.toISOString().slice(11, 19));
          } else {
            $(this).html('Reload');
          }
        });
      }, 1000);
    });
  });

  return <></>;
};
