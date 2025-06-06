// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      $('#signup').on('submit', function () {
        $('#errors').html('');

        if ($('#last').val() === '') {
          $('#errors').append('<p>姓を入力してください。</p>');
        }
        if ($('#first').val() === '') {
          $('#errors').append('<p>名を入力してください。</p>');
        }
        if ($('#email').val() === '') {
          $('#errors').append('<p>メールアドレスを入力してください。</p>');
        }

        return false;
      });
    });
  }, []);

  return <></>;
};
