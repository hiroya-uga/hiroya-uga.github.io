// @ts-nocheck
'use client';

import { useEffect } from 'react';

import jQuery from 'jquery';
import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/annotated-tables/page.module.css';


export const DocumentScript = () => {
  const $ = (argument) => {
    if (typeof argument === 'string') {
      const newSelector = argument.split(/\s/).map((selector) => {
        if (selector.startsWith('.')) {
          return `.${styles[selector.slice(1)]}`;
        }
        if (selector.startsWith('#')) {
          console.log(selector.slice(1));

          return `#${styles[selector.slice(1)]}`;
        }

        return selector;
      }).join(' ');
      return jQuery(newSelector);
    }

    return jQuery(argument);
  };


  useEffect(() => {
    var key = -1;
    var resized = function () {
      [].forEach.call(document.querySelectorAll('connection'), function (el) {
        // @ts-ignore
        el.remove();
      });

      [].forEach.call(document.querySelectorAll(`.${styles.ttbtn}`), function (el: HTMLElement) {
        el.addEventListener('click', function () {
          if (el.getAttribute('aria-expanded') == 'true') {
            (el.nextElementSibling as HTMLElement).style.visibility = 'hidden';
            el.setAttribute('aria-expanded', 'false');
            (el.nextElementSibling as HTMLElement).removeAttribute('id');
            el.removeAttribute('aria-describedby');
          } else {
            (el.nextElementSibling as HTMLElement).style.visibility = 'visible';
            el.setAttribute('aria-expanded', 'true');
            (el.nextElementSibling as HTMLElement).setAttribute('id', 'tooltip');
            el.setAttribute('aria-describedby', 'tooltip');
          }
        });
        el.addEventListener('mouseover', function () {
          (el.nextElementSibling as HTMLElement).style.visibility = 'visible';
          el.setAttribute('aria-expanded', 'true');
          (el.nextElementSibling as HTMLElement).setAttribute('id', 'tooltip');
          el.setAttribute('aria-describedby', 'tooltip');
        });
        el.addEventListener('mouseout', function () {
          (el.nextElementSibling as HTMLElement).style.visibility = 'hidden';
          el.setAttribute('aria-expanded', 'false');
          (el.nextElementSibling as HTMLElement).removeAttribute('id');
          el.removeAttribute('aria-describedby');
        });
        el.addEventListener('focus', function () {
          (el.nextElementSibling as HTMLElement).style.visibility = 'visible';
          el.setAttribute('aria-expanded', 'true');
          (el.nextElementSibling as HTMLElement).setAttribute('id', 'tooltip');
          el.setAttribute('aria-describedby', 'tooltip');
        });
        el.addEventListener('blur', function () {
          (el.nextElementSibling as HTMLElement).style.visibility = 'hidden';
          el.setAttribute('aria-expanded', 'false');
          (el.nextElementSibling as HTMLElement).removeAttribute('id');
          el.removeAttribute('aria-describedby');
        });
        el.addEventListener('keydown', function (event) {
          if (event.keyCode == 27) {
            (el.nextElementSibling as HTMLElement).style.visibility = 'hidden';
            el.setAttribute('aria-expanded', 'false');
            (el.nextElementSibling as HTMLElement).removeAttribute('id');
            el.removeAttribute('aria-describedby');
          }
        });
      });

      // @ts-ignore
      $('.heading-info').connections();
      // @ts-ignore
      $('.service-revenue-info').connections();
      // @ts-ignore
      $('.rent-expense-info').connections();
      // @ts-ignore
      $('.net-income-info').connections();

      $('.heading-info button').on('mouseover focus', function (_) {
        $('.heading-info').addClass(styles.hovered);
      });
      $('.heading-info button').on('mouseout blur', function (_) {
        $('.heading-info').removeClass(styles.hovered);
      });
      $('.service-revenue-info button').on('mouseover focus', function (_) {
        $('.service-revenue-info').addClass(styles.hovered);
      });
      $('.service-revenue-info button').on('mouseout blur', function (_) {
        $('.service-revenue-info').removeClass(styles.hovered);
      });
      $('.rent-expense-info button').on('mouseover focus', function (_) {
        $('.rent-expense-info').addClass(styles.hovered);
      });
      $('.rent-expense-info button').on('mouseout blur', function (_) {
        $('.rent-expense-info').removeClass(styles.hovered);
      });
      $('.net-income-info button').on('mouseover focus', function (_) {
        $('.net-income-info').addClass(styles.hovered);
      });
      $('.net-income-info button').on('mouseout blur', function (_) {
        $('.net-income-info').removeClass(styles.hovered);
      });

      $('#hide-show').on('click', function (_) {
        $('.info-cell').toggleClass('info-cell-hidden');
        if ($(this).text() == '隠す') {
          $(this).text('表示する');
          $('connection').hide();
          $('.annotations-wrapper div').hide();
        } else {
          $(this).text('隠す');
          $('connection').show();
          $('.annotations-wrapper div').show();
        }
      });

      $("td:contains('Clos. 2')").css('color', '#a56900').attr('tabindex', '0');
      $("td:contains('Clos. 1')").css('color', 'green').attr('tabindex', '0');
      $("td:contains('Clos. 3')").css('color', 'blue').attr('tabindex', '0');
      $("td:contains('Clos. 4')").css('color', '#767676').attr('tabindex', '0');

      $("td:contains('Clos. 2')").on('mouseover focus', function (_) {
        $("td:contains('Clos. 2')").addClass(styles.clos2hovered);
      });
      $("td:contains('Clos. 2')").on('mouseout blur', function (_) {
        $("td:contains('Clos. 2')").removeClass(styles.clos2hovered);
      });
      $("td:contains('Clos. 1')").on('mouseover focus', function (_) {
        $("td:contains('Clos. 1')").addClass(styles.clos1hovered);
      });
      $("td:contains('Clos. 1')").on('mouseout blur', function (_) {
        $("td:contains('Clos. 1')").removeClass(styles.clos1hovered);
      });
      $("td:contains('Clos. 3')").on('mouseover focus', function (_) {
        $("td:contains('Clos. 3')").addClass(styles.clos3hovered);
      });
      $("td:contains('Clos. 3')").on('mouseout blur', function (_) {
        $("td:contains('Clos. 3')").removeClass(styles.clos3hovered);
      });
      $("td:contains('Clos. 4')").on('mouseover focus', function (_) {
        $("td:contains('Clos. 4')").addClass(styles.clos4hovered);
      });
      $("td:contains('Clos. 4')").on('mouseout blur', function (_) {
        $("td:contains('Clos. 4')").removeClass(styles.clos4hovered);
      });
    };
    var handler = function () {
      clearTimeout(key);

      console.log('do');
      key = window.setTimeout(resized, 200);
    };

    var option = {
      passive: true,
    };

    (async () => {
      await import('./lib/jquery.connections');

      console.log('add');
      window.addEventListener('resize', handler, option);

      resized();
    })();

    return () => {
      console.log('remove');

      [].forEach.call(document.querySelectorAll('connection'), function (el) {
        // @ts-ignore
        el.remove();
      });

      window.removeEventListener('resize', handler, option);
      window.removeEventListener('resize', handler, option);
    }
  }, []);

  return <></>;
};
