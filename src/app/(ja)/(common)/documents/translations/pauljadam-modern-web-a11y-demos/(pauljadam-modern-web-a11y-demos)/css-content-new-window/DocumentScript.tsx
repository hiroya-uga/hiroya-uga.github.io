// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function (_) {
      var allLinks = document.getElementsByTagName('a');
      for (var i = 0; i < allLinks.length; i++) {
        var thisElement = allLinks[i];
        var thisElementAttribute = thisElement.getAttribute('target');
        if (thisElementAttribute == '_blank') {
          thisElement.title = 'Opens New Window';
        }
      }
    });
  }, []);

  return <></>;
};
