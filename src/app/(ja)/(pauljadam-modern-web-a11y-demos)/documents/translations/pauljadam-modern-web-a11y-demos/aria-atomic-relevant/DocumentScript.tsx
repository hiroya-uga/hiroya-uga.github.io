// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    function updateCharsLeft() {
      var remaining = 280 - ($('#message').val() as string).length;
      $('#chars').text(remaining);
    }
    function updateCharsLeft2() {
      var remaining = 280 - ($('#message2').val() as string).length;
      $('#chars2').text(remaining);
    }
    function updateCharsLeft3() {
      var remaining = 280 - ($('#message3').val() as string).length;
      $('#chars3').text(remaining);
    }
    function updateCharsLeft4() {
      var remaining = 280 - ($('#message4').val() as string).length;
      $('#chars4').text(remaining);
    }
    function updateCharsLeft5() {
      var remaining = 280 - ($('#message5').val() as string).length;
      $('#chars5').text(remaining);
    }
    function updateCharsLeft6() {
      var remaining = 280 - ($('#message6').val() as string).length;
      $('#chars6').text(remaining);
    }
    function updateCharsLeft7() {
      var remaining = 280 - ($('#message7').val() as string).length;
      $('#chars7').text(remaining);
      if (remaining <= 70) {
        $('#input-info7').attr('aria-live', 'assertive');
      } else {
        $('#input-info7').attr('aria-live', 'polite');
      }
    }

    $(function () {
      $('#message').on('input propertychange', updateCharsLeft);
      $('#message2').on('input propertychange', updateCharsLeft2);
      $('#message3').on('input propertychange', updateCharsLeft3);
      $('#message4').on('input propertychange', updateCharsLeft4);
      $('#message5').on('input propertychange', updateCharsLeft5);
      $('#message6').on('input propertychange', updateCharsLeft6);
      $('#message7').on('input propertychange', updateCharsLeft7);
    });
  }, []);

  return <></>;
};
