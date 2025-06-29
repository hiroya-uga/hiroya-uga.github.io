// @ts-nocheck
'use client';

import { useEffect } from 'react';

import $ from 'jquery';

export const DocumentScript = () => {
  useEffect(() => {
    $(function () {
      var v = document.getElementsByTagName('video')[1];
      v.addEventListener(
        'play',
        function () {
          $('#play-pause').html('停止');
        },
        true,
      );
      v.addEventListener(
        'pause',
        function () {
          $('#play-pause').html('再生');
        },
        true,
      );

      $('#play-pause').on('click', function (_) {
        if (!$('#demo-video')[0].paused) {
          $('#demo-video')[0].pause();
          $('#play-pause').html('再生');
        } else {
          $('#demo-video')[0].play();
          $('#play-pause').html('停止');
        }
      });
      $('#captions').on('click', function (_) {
        if ($('#demo-video')[0].textTracks[0].mode == 'showing') {
          $('#captions').html('Enable Captions');
          $('#demo-video')[0].textTracks[0].mode = 'hidden';
        } else {
          $('#demo-video')[0].textTracks[0].mode = 'showing';
          $('#captions').html('Disable Captions');
        }
      });
    });
  }, []);

  return <></>;
};
