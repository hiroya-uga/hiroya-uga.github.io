// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/dialog/page.module.css';

const modalOverlayId = styles.modalOverlay;

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      $('#trigger-modal').on('click', function () {
        $('main').attr('aria-hidden', 'true');
        //var lastFocus = document.activeElement; wont' work on iOS
        var modalOverlay = $('<div>').attr({ id: modalOverlayId, id: modalOverlayId });
        $(modalOverlay).appendTo('body');
        $('#trigger-modal').attr('disabled', 'true');
        var dialog = $('<div role="dialog">').attr({
          'aria-labelledby': 'dialog-heading',
          'aria-describedby': 'dialog-description',
          'aria-modal': 'true',
        });
        $(dialog)
          .html(
            '<div id="firstElement" tabindex="0"></div><h1 id="dialog-heading">アカウントログイン</h1><div id="dialog-description"><p>アカウントにサインインするには、以下にユーザー名とパスワードを入力してください。「新規登録」ボタンをクリックして新しいアカウントを作成します。</p></div><form><label>ユーザー名 <input id="username" type="text"></label><br><label>パスワード <input type="password"></label></form><button id="firstButton">ログイン</button><button>新規登録</button><button id="' + styles.lastButton + '" aria-label="アカウントログインダイアログを閉じる">X</button><div id="lastElement" tabindex="0"></div>',
          )
          .appendTo('body');
        $('#username').trigger('focus');

        $('#lastElement').on('focusin', function (e) {
          $('#username').trigger('focus');
        });
        $('#firstElement').on('focusin', function (e) {
          $('#lastButton').trigger('focus');
        });

        $('body').on('keyup', function (e) {
          if (e.key === 'Escape' || e.ket === 'ESC') {
            $('main').attr('aria-hidden', 'false');
            $(modalOverlay).remove();
            $(dialog).remove();
            $('#trigger-modal').removeAttr('disabled').trigger('focus'); //works on iOS
          }
        });

        $('[role=dialog] button').on('click', function (e) {
          $('main').attr('aria-hidden', 'false');
          $(modalOverlay).remove();
          $(dialog).remove();
          //lastFocus.trigger('focus'); not working on iOS
          $('#trigger-modal').removeAttr('disabled').trigger('focus'); //works on iOS
        });
        return false;
      });
    });
  }, []);

  return <></>;
};
