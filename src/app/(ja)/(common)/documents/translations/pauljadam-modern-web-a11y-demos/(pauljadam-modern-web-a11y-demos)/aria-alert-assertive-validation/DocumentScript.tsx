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
      $('#signup2').on('submit', function () {
        $('#errors2').html('');

        if ($('#last2').val() === '') {
          $('#errors2').append('<p>姓を入力してください。</p>');
        }
        if ($('#first2').val() === '') {
          $('#errors2').append('<p>名を入力してください。</p>');
        }
        if ($('#email2').val() === '') {
          $('#errors2').append('<p>メールアドレスを入力してください。</p>');
        }

        return false;
      });
      $('#signup3').on('submit', function () {
        $('#errors3').html('');

        if ($('#last3').val() === '') {
          $('#errors3').append('<p>姓を入力してください。</p>');
        }
        if ($('#first3').val() === '') {
          $('#errors3').append('<p>名を入力してください。</p>');
        }
        if ($('#email3').val() === '') {
          $('#errors3').append('<p>メールアドレスを入力してください。</p>');
        }

        return false;
      });
    });
  }, []);

  return <></>;
};
