// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function (e) {
      $('[role=checkbox]').on('click', function () {
        var checked = $(this).attr('aria-checked');
        if (checked == 'true') {
          $(this).attr('aria-checked', 'false');
          $(this).attr('class', 'unchecked');
        } else {
          $(this).attr('aria-checked', 'true');
          $(this).attr('class', 'checked');
        }
        return false;
      });
      $('[role=checkbox]').on('keypress', function (e) {
        var key = e.which;
        if (key == 32) {
          $(this).trigger('click');
          return false;
        }
      });
      $('#spancheckbox').on('click', function () {
        var checked = $(this).attr('class');
        if (checked == 'checked') {
          $(this).attr('class', 'unchecked');
        } else {
          $(this).attr('class', 'checked');
        }
        return false;
      });
    });
  }, []);

  return <></>;
};
