// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      var btn = document.getElementById('toggleBtn');
      var handleBtnClick = function () {
        var isPressed = this.getAttribute('aria-pressed') === 'true';
        var value = isPressed ? 'false' : 'true';

        this.setAttribute('aria-pressed', value);
      };

      btn.addEventListener('click', handleBtnClick);
    });
  }, []);

  return <></>;
};
