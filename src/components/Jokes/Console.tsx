'use client';

import { useEffect } from 'react';

let wrote = false;

export const Console = () => {
  useEffect(() => {
    if (wrote) {
      return;
    }

    //  _     _  ______ _______   ______  _______ _    _
    //  |     | |  ____ |_____|   |     \\ |______  \\  /
    //  |_____| |_____| |     | . |_____/ |______   \\/

    wrote = true;
    console.log(
      `%c
=====================================================

 Hello developer! Welcome to     _
                                | |
     _   _   __ _   __ _      __| |  ___ __   __
    | | | | / _\` | / _\` |    / _\` | / _ \\\\ \\ / /
    | |_| || (_| || (_| | _ | (_| ||  __/ \\ V /
     \\__,_| \\__, | \\__,_|(_) \\__,_| \\___|  \\_/
             __/ |
            |___/
                                              🍣🍣🍣
=====================================================%c`,
      'font-family: Consolas, Monaco, monospace;',
      '',
    );
  }, []);

  return null;
};
