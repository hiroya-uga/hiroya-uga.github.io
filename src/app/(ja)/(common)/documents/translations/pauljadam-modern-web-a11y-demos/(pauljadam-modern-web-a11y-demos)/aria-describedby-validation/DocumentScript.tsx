// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      $('#signup').submit(function () {
        $('#first-error, #last-error, #password-error, #email-error').remove();
        $('#first, #last, #password, #email').removeAttr('aria-invalid');
        if ($('#first').val() === '') {
          $('#first')
            .after('<strong id="first-error">名を入力してください</strong>')
            .attr({ 'aria-describedby': 'first-error', 'aria-invalid': 'true' });
        }
        if ($('#last').val() === '') {
          $('#last')
            .after('<strong id="last-error">姓を入力してください</strong>')
            .attr({ 'aria-describedby': 'last-error', 'aria-invalid': 'true' });
        }
        if ($('#password').val() === '') {
          $('#password')
            .after('<strong id="password-error">フォーマットにしたがってパスワードを入力してください。</strong>')
            .attr({ 'aria-describedby': 'password-error password-format', 'aria-invalid': 'true' });
        }
        if ($('#email').val() === '') {
          $('#email')
            .after('<strong id="email-error">メールアドレスをname@domain.comの形式で入力してください。</strong>')
            .attr({ 'aria-describedby': 'email-error', 'aria-invalid': 'true' });
        }
        if ($('#last').val() === '') {
          $('#last').focus();
        } else if ($('#first').val() === '') {
          $('#first').focus();
        } else if ($('#password').val() === '') {
          $('#password').focus();
        } else if ($('#email').val() === '') {
          $('#email').focus();
        }
        return false;
      });
    });
  }, []);

  return <></>;
};
