'use client';

import { useEffect } from 'react';

interface Props {
  scripts: { src: string; integrity: string }[];
}

export const SupportSpaScripts = ({ scripts }: Props) => {
  useEffect(() => {
    const controller = new AbortController();

    // next/script は src で重複排除するため、クライアント遷移後の再マウントで再実行されない。
    // 強制的に再実行してもスクリプト側のトップレベル `let` が再宣言エラーになる。
    // SRI を fetch で検証し、マウントごとに関数スコープで実行する。
    const run = async () => {
      const sources = await Promise.all(
        scripts.map(({ src, integrity }) =>
          fetch(src, {
            integrity,
            mode: 'cors',
            signal: controller.signal,
          }).then((response) => response.text()),
        ),
      );

      if (controller.signal.aborted) {
        return;
      }

      new Function(sources.join('\n;\n'))();
    };

    run().catch((error) => {
      if (controller.signal.aborted === false) {
        console.error(error);
      }
    });

    return () => {
      controller.abort();
    };
  }, [scripts]);

  return null;
};
