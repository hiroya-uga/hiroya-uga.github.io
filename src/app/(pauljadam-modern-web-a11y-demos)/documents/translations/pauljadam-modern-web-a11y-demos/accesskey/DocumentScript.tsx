'use client';

import { useEffect } from 'react';

export const DocumentScript = () => {
  useEffect(() => {
    {
      // added code by UGA for React
      const head = document.querySelector('head');
      const style = document.createElement('style');

      style.id = 'show-hide-style';
      head?.appendChild(style);
    }

    document.getElementById('show')?.addEventListener('click', function () {
      if (document.getElementById('show-hide-style')) {
        document.getElementById('show-hide-style')!.textContent = '';
        // document.getElementById('show-hide-style').remove();
      }
      // var head = document.querySelector('head')!;
      if (navigator.userAgent.indexOf('Mac') > 0) {
        document.getElementById('show-hide-style')!.textContent +=
          // '<style id="show-hide-style"> @supports (-webkit-appearance:none) { *[accesskey]:after {content:" ⌃⌥" attr(accesskey) }; } </style>';
          '@supports (-webkit-appearance:none) { *[accesskey]:after {content:" ⌃⌥" attr(accesskey) }; }';
      }
      if (navigator.userAgent.indexOf('Win') > 0) {
        document.getElementById('show-hide-style')!.textContent +=
          '@supports (-webkit-appearance:none) { *[accesskey]:after {content:" (Alt+" attr(accesskey) ")"}; } @supports (-moz-appearance:none) { *[accesskey]:after {content:" (Alt+Shift+" attr(accesskey) ")"}; } @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) { *[accesskey]:after {content:" (Alt+" attr(accesskey) ")"}; }';
      }
    });
    document.getElementById('hide')?.addEventListener('click', function () {
      if (document.getElementById('show-hide-style')) {
        document.getElementById('show-hide-style')!.textContent = '';
        // document.getElementById('show-hide-style').remove();
      }
    });

    return () => {
      // added code by UGA for React
      document.getElementById('show-hide-style')?.remove();
    };
  });

  return <></>;
};
