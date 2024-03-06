// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      var btn = document.getElementById('toggleBtn');
      var state = document.getElementById('pressed-state');
      var handleBtnClick = function () {
        var isPressed = this.getAttribute('aria-pressed') === 'true';
        var value = isPressed ? 'false' : 'true';

        this.setAttribute('aria-pressed', value);
        state.textContent = value;
      };

      btn.addEventListener('click', handleBtnClick);
    });
  }, []);

  return <></>;
};
