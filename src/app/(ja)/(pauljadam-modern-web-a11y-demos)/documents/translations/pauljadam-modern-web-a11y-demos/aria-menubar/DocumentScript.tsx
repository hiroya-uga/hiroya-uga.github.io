// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    function showMenu() {
      $('[role=menu]').attr('style', 'clip: rect(0 0 0 0)');
      $('[role=menu]').attr('aria-hidden', 'true');
      $('[aria-expanded]').attr('aria-expanded', 'false');
      document.getElementById($(this).attr('aria-controls')).setAttribute('aria-hidden', 'false');
      $(this).attr('aria-expanded', 'true');
      document
        .getElementById($(this).attr('aria-controls'))
        .setAttribute('style', 'left:' + $(this).offset().left + 'px; clip: auto;position: absolute;');
    }
    function hideMenu() {
      $('[role=menu]').attr('style', 'clip: rect(0 0 0 0)');
      $('[role=menu]').attr('aria-hidden', 'true');
      $('[aria-expanded]').attr('aria-expanded', 'false');
    }
    /*var hasPopups = document.querySelectorAll('[aria-haspopup=true]');
      for (var i = 0; i < hasPopups.length; i++ ) {
        hasPopups[i].addEventListener("mouseover", showMenu, false);
        hasPopups[i].addEventListener("focus", showMenu, false);
        hasPopups[i].addEventListener('mouseover', function(){ showMenu }, false);
      }
    */
    $(function () {
      $('[aria-haspopup]').on('mouseover focus', showMenu);
      $('[role=menu]').on('mouseleave', hideMenu);
      $('a').on('focus', function () {
        var $self = $(this);

        if ($self.closest('[role="menubar"]').length <= 0) {
          hideMenu();

          return;
        }

        (function () {
          var $menu = $self.closest('[role="menu"]');
          var id = $menu.attr('id');
          var $target = null;

          if (!id) {
            return;
          }

          $target = $('[aria-controls="' + id + '"]');

          if ($target.length <= 0) {
            return;
          }

          showMenu.call($target[0]);
        })();
      });
    });
  }, []);

  return <></>;
};
