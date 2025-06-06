// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    var key = -1;
    var resized = function () {
      [].forEach.call(document.querySelectorAll('connection'), function (el) {
        // @ts-ignore
        el.remove();
      });

      [].forEach.call(document.querySelectorAll('.ttbtn'), function (el: HTMLElement) {
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

      $('.heading-info button').on('mouseover focus', function (e) {
        $('.heading-info').addClass('hovered');
      });
      $('.heading-info button').on('mouseout blur', function (e) {
        $('.heading-info').removeClass('hovered');
      });
      $('.service-revenue-info button').on('mouseover focus', function (e) {
        $('.service-revenue-info').addClass('hovered');
      });
      $('.service-revenue-info button').on('mouseout blur', function (e) {
        $('.service-revenue-info').removeClass('hovered');
      });
      $('.rent-expense-info button').on('mouseover focus', function (e) {
        $('.rent-expense-info').addClass('hovered');
      });
      $('.rent-expense-info button').on('mouseout blur', function (e) {
        $('.rent-expense-info').removeClass('hovered');
      });
      $('.net-income-info button').on('mouseover focus', function (e) {
        $('.net-income-info').addClass('hovered');
      });
      $('.net-income-info button').on('mouseout blur', function (e) {
        $('.net-income-info').removeClass('hovered');
      });

      $('#hide-show').on('click', function (e) {
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

      $("td:contains('Clos. 2')").on('mouseover focus', function (e) {
        $("td:contains('Clos. 2')").addClass('clos2hovered');
      });
      $("td:contains('Clos. 2')").on('mouseout blur', function (e) {
        $("td:contains('Clos. 2')").removeClass('clos2hovered');
      });
      $("td:contains('Clos. 1')").on('mouseover focus', function (e) {
        $("td:contains('Clos. 1')").addClass('clos1hovered');
      });
      $("td:contains('Clos. 1')").on('mouseout blur', function (e) {
        $("td:contains('Clos. 1')").removeClass('clos1hovered');
      });
      $("td:contains('Clos. 3')").on('mouseover focus', function (e) {
        $("td:contains('Clos. 3')").addClass('clos3hovered');
      });
      $("td:contains('Clos. 3')").on('mouseout blur', function (e) {
        $("td:contains('Clos. 3')").removeClass('clos3hovered');
      });
      $("td:contains('Clos. 4')").on('mouseover focus', function (e) {
        $("td:contains('Clos. 4')").addClass('clos4hovered');
      });
      $("td:contains('Clos. 4')").on('mouseout blur', function (e) {
        $("td:contains('Clos. 4')").removeClass('clos4hovered');
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

      window.removeEventListener('resize', handler, option);
      window.removeEventListener('resize', handler, option);
    }
  }, []);

  return <></>;
};
