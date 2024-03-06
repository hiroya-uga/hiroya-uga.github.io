// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function (e) {
      $('#trigger').on('click', function () {
        $('main, [role=navigation]').attr('aria-hidden', 'true');
        $('body').attr('style', 'background-color:gray;');
        $('a').attr('tabindex', '-1');
        $('a').attr('style', 'cursor:default;');
        $('button').attr('disabled', 'true');
        var modalOverlay = $('<div>').attr({ id: 'modalOverlay' });
        $(modalOverlay).appendTo('body');
        var dialog = $('<div>').attr({
          role: 'alertdialog',
          'aria-labelledby': 'alertHeading',
          'aria-describedby': 'alertText',
        });
        $(dialog)
          .html(
            '<h1 id="alertHeading">警告！番地が一致していません</h1><div id="alertText"><p>入力された住所の郵便番号が正しくないようです。</p><p>入力された値： 東京都hoge区1-2-3</p></div><button id="yes">はい、正しい値です</button><button>修正する</button>',
          )
          .appendTo('#modalOverlay');
        $('#yes').trigger('focus');

        $('[role=alertdialog] button').on('click', function (e) {
          $('main, [role=navigation]').attr('aria-hidden', 'false');
          $('body, a').removeAttr('style');
          $('a').removeAttr('tabindex');
          $('button').removeAttr('disabled');
          $(modalOverlay).remove();
          $(dialog).remove();
          $('#trigger').trigger('focus');
        });
        return false;
      });

      $('#trigger-spec').on('click', function () {
        $('main, [role=navigation]').attr('aria-hidden', 'true');
        $('body').attr('style', 'background-color:gray;');
        $('a').attr('tabindex', '-1');
        $('a').attr('style', 'cursor:default;');
        $('button').attr('disabled', 'true');
        var modalOverlay = $('<div>').attr({ id: 'modalOverlay' });
        $(modalOverlay).appendTo('body');
        var dialog = $('<div>').attr({
          role: 'alertdialog',
          'aria-labelledby': 'alertHeading',
          'aria-describedby': 'alertText',
        });
        $(dialog)
          .html(
            '<h1 id="alertHeading">警告！番地が一致していません</h1><div id="alertText" tabindex="0" role="document"><p>入力された住所の郵便番号が正しくないようです。</p><p>入力された値： 東京都hoge区1-2-3</p></div><button id="yes">正しい値です</button><button>修正する</button>',
          )
          .appendTo('#modalOverlay');
        $('#alertText').trigger('focus');

        $('[role=alertdialog] button').on('click', function (e) {
          $('main, [role=navigation]').attr('aria-hidden', 'false');
          $('body, a').removeAttr('style');
          $('a').removeAttr('tabindex');
          $('button').removeAttr('disabled');
          $(modalOverlay).remove();
          $(dialog).remove();
          $('#trigger-spec').trigger('focus');
        });
        return false;
      });
    });
  }, []);

  return <></>;
};
