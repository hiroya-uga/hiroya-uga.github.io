// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/csunmobile/accordion-bad/page.module.css';


export const DocumentScript = () => {
  useEffect(() => {
    $(function (_) {
      $(`#${styles["shipping-toggle"]}`).on('click', function (_) {
        $(`#${styles["shipping-panel"]}`).stop(true, false).slideToggle('500');
        $(this).find('i').toggleClass('fa-plus-square fa-minus-square');
      });
    });
  }, []);

  return <></>;
};
