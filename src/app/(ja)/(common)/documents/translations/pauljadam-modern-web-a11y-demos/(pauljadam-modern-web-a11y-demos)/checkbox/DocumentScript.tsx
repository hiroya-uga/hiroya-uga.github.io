// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/checkbox/page.module.css';


export const DocumentScript = () => {
  useEffect(() => {
    $(function (_) {
      $('[role=checkbox]').on('click', function () {
        var checked = $(this).attr('aria-checked');
        if (checked == 'true') {
          $(this).attr('aria-checked', 'false');
          $(this).attr('class', styles.unchecked);
        } else {
          $(this).attr('aria-checked', 'true');
          $(this).attr('class', styles.checked);
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
          $(this).attr('class', styles.unchecked);
        } else {
          $(this).attr('class', styles.checked);
        }
        return false;
      });
    });
  }, []);

  return null;
};
