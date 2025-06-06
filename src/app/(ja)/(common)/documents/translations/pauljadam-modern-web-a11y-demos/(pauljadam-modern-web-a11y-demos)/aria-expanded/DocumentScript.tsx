// @ts-nocheck
// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

// @ts-nocheck

export const DocumentScriptA = () => {
  useEffect(() => {
    $(function () {
      var dynCtrlr = document.querySelector('[aria-controls=dynamic-container]');
      dynCtrlr.addEventListener('click', expandCollapseContainer);
      function expandCollapseContainer(event) {
        event.preventDefault();
        dynCtrlr = document.querySelector('[aria-controls=dynamic-container]');
        var dynCtnr = document.querySelector('#dynamic-container');
        var isExpanded = dynCtrlr.getAttribute('aria-expanded');
        if (isExpanded == 'true') {
          dynCtnr.style.visibility = 'hidden';
          dynCtrlr.innerHTML = '<span aria-hidden=true>[+]</span> 詳細';
          dynCtrlr.setAttribute('aria-expanded', 'false');
        } else {
          dynCtnr.style.visibility = 'visible';
          dynCtrlr.innerHTML = '<span aria-hidden=true>[-]</span> 詳細';
          dynCtrlr.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }, []);

  return <></>;
};
export const DocumentScriptB = () => {
  useEffect(() => {
    $(function () {
      var dynBtnCtrlr = document.querySelector('[aria-controls=dynamic-button-container]');
      dynBtnCtrlr.addEventListener('click', expandCollapseBtnContainer);
      function expandCollapseBtnContainer() {
        dynBtnCtrlr = document.querySelector('[aria-controls=dynamic-button-container]');
        var dynBtnCtnr = document.querySelector('#dynamic-button-container');
        var isExpanded = dynBtnCtrlr.getAttribute('aria-expanded');
        if (isExpanded == 'true') {
          dynBtnCtnr.style.visibility = 'hidden';
          dynBtnCtrlr.innerHTML = '<span aria-hidden=true>[+]</span> 詳細';
          dynBtnCtrlr.setAttribute('aria-expanded', 'false');
        } else {
          dynBtnCtnr.style.visibility = 'visible';
          dynBtnCtrlr.innerHTML = '<span aria-hidden=true>[-]</span> 詳細';
          dynBtnCtrlr.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }, []);

  return <></>;
};

export const DocumentScriptC = () => {
  useEffect(() => {
    $(function () {
      var tablist = document.getElementById('tablist');
      var tabPanel = document.getElementsByClassName('tab-panel');

      tablist.setAttribute('role', 'tablist');

      Array.prototype.forEach.call(tablist.children, function (tab, idx) {
        tab.id = 'tab-' + idx;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', tabPanel[idx].id);

        if (idx === 1) {
          tab.tabIndex = 0;
          tab.setAttribute('aria-expanded', 'true');

          return;
        }

        tab.tabIndex = -1;
        tab.setAttribute('aria-expanded', 'false');
      });

      Array.prototype.forEach.call(tabPanel, function (panel, idx) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tablist.children[idx].id);
      });

      {
        var tabs = document.querySelectorAll('[role=tab]');
        for (var i = 0; i < tabs.length; i++) {
          tabs[i].addEventListener('click', showTabPanel);
          tabs[i].addEventListener('keydown', showTabPanelKbrd);
        }
        function showTabPanel(el) {
          var tabs2 = document.querySelectorAll('[role=tab]');
          for (var i = 0; i < tabs2.length; i++) {
            tabs2[i].innerText = 'タブ' + (i + 1);
            tabs2[i].setAttribute('aria-expanded', 'false');
            tabs2[i].tabIndex = -1;
            tabs2[i].setAttribute('aria-selected', 'false');
          }
          el.target.tabIndex = 0;
          el.target.innerHTML =
            '<span aria-hidden=true>[</span>' + el.target.textContent.trim() + '<span aria-hidden=true>]</span>';
          el.target.setAttribute('aria-expanded', 'true');
          el.target.setAttribute('aria-selected', 'true');
          var tabPanelToOpen = el.target.getAttribute('aria-controls');
          var tabPanels = document.querySelectorAll('[role=tabpanel]');
          for (var i = 0; i < tabPanels.length; i++) {
            tabPanels[i].style.display = 'none';
          }
          document.getElementById(tabPanelToOpen).style.display = 'block';
        }
        function showTabPanelKbrd(e) {
          var key = e.key.replace('Arrow', '');

          if (e.keyCode == '13' || e.keyCode == '32') {
            showTabPanel(e);
          } else if (key === 'Up' || key === 'Left') {
            e.preventDefault();

            if (this.previousElementSibling) {
              this.previousElementSibling.click();
              this.previousElementSibling.focus();
            }
          } else if (key === 'Down' || key === 'Right') {
            e.preventDefault();

            if (this.nextElementSibling) {
              this.nextElementSibling.click();
              this.nextElementSibling.focus();
            }
          }
        }

        tabs[1].click();
      }
    });
  }, []);

  return <></>;
};
